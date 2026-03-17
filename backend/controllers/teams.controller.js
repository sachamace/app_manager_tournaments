const PlayersModel = require('../models/players.model');
const TeamsModel = require('../models/teams.model');
const TournamentsModel = require('../models/tournaments.model');


// Les controllers GET 

module.exports.getTeams = async(req,res) =>{
    const teams = await TeamsModel.find();
    res.status(200).json(teams);
};

module.exports.getTeam = async(req,res) =>{
    // On utilise .populate() pour récupérer les détails des joueurs, pas seulement leurs IDs.
    const team = await TeamsModel.findById(req.params.id).populate('players');
    if (!team) {
        // Le message était incorrect, il s'agit d'une équipe
        return res.status(404).json({ message: "Équipe non trouvée" });
    }
    res.status(200).json(team);
};

module.exports.getHistoricalMatches = async(req,res)=>{
    const team = await TeamsModel.findById(req.params.id);
    if (!team) {
        return res.status(404).json({ message: "Matches non trouvés" });
    }
    res.status(200).json(team.matches); 
};

module.exports.getCaptainTeam = async(req,res)=>{
    const team = await TeamsModel.findById(req.params.id);
    if (!team) {
        return res.status(404).json({ message: "Captaine non trouvé" });
    }
    res.status(200).json(team.captain); 
};

module.exports.getPlayerInTeam = async(req,res)=>{
    const team = await TeamsModel.findById(req.params.id);
    if (!team) {
        return res.status(404).json({ message: "Joueurs non trouvés" });
    }
    res.status(200).json(team.players); 
};


// Les controllers Set 

module.exports.createTeam = async(req,res) => {
    try {
        const {tournament, nom, acronyme, logo,captain,players,matches} = (req.body && Object.keys(req.body).length > 0) ? req.body : req.query;
        const team = await TeamsModel.create({
            tournament,
            nom,
            acronyme,
            logo,
            captain,
            players,
            matches
        });

        // On ajoute l'équipe créée directement dans le tableau list_teams du tournoi
        if (tournament) {
            await TournamentsModel.findByIdAndUpdate(tournament, { 
                $addToSet: { list_teams: team._id } 
            });
        }

        res.status(200).json(team);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

module.exports.addPlayerInTeam = async(req,res) => {
    try {
        const userId = req.params.id
        const elementIdToAdd = req.body
        const team = await TeamsModel.findById(userId);

        if (!team) {
            return res.status(404).json({ message: "La team est introuvable." });
        }
        
        const updatedTeam = await TeamsModel.findByIdAndUpdate(
            userId,
            { $addToSet: { players: elementIdToAdd } },
            { returnDocument: 'after', runValidators: true }
        );

        return res.status(200).json({
            message: "Player ajouté dans la team avec succès !",
            data: updatedTeam 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

module.exports.addCaptainInTeam = async(req,res) => {
    try {
        const userId = req.params.id
        const elementIdToAdd = req.body
        const team = await TeamsModel.findById(userId);

        if (!team) {
            return res.status(404).json({ message: "La team est introuvable." });
        }

        if (team.captain && team.captain.length > 0) {
            return res.status(400).json({ 
                message: "Il existe déjà un capitaine dans votre équipe." 
            });
        }
        const updatedTeam = await TeamsModel.findByIdAndUpdate(
            userId,
            { $addToSet: { captain: elementIdToAdd } },
            { returnDocument: 'after', runValidators: true }
        );

        return res.status(200).json({
            message: "Un capitaine est ajouté dans la team avec succès !",
            data: updatedTeam 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};


// Patch 
module.exports.updateTeam = async (req,res) => {
    try {
        const teamId = req.params.id;
        const updateData = (req.body && Object.keys(req.body).length > 0) ? req.body : req.query;

        if (updateData && updateData.tournament) { 
            delete updateData.tournament;
        }

        const updatedTeam = await TeamsModel.findByIdAndUpdate(
            teamId,
            { $set: updateData },
            { returnDocument: 'after', runValidators: true }
        );

        console.log("Résultat de la mise à jour (updatedTeam) :", updatedTeam);

        if (!updatedTeam) {
            return res.status(404).json({ message: "Équipe non trouvée." });
        }

        return res.status(200).json(updatedTeam);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

// DELETE 

module.exports.deleteTeam = async (req,res) => {
    try {
        const teamId = req.params.id

        const deleteTeam = await TeamsModel.findByIdAndDelete(teamId);
        
        if (!deleteTeam) {
            return res.status(404).json({ message: "Cet team est introuvable ." });
        }
        
        // 2. LE NETTOYAGE : On supprime TOUS les joueurs liés à l'équipe
        const deletedPlayers = await PlayersModel.deleteMany({ team: teamId });

        // NOUVEAU : On retire également l'équipe du tournoi auquel elle était rattachée
        if (deleteTeam.tournament) {
            await TournamentsModel.findByIdAndUpdate(deleteTeam.tournament, {
                $pull: { list_teams: teamId }
            });
        }

        // 3. On n'oublie pas de renvoyer une réponse de succès !
        return res.status(200).json({ 
            message: "L'équipe a été supprimée avec succès.",
            playersDelete: deletedPlayers.deletedCount
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur serveur", error: error.message }); 
    }
};