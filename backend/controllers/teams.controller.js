const TeamsModel = require('../models/teams.model');


const { deleteTeamLogic , createTeamLogic , addCaptainInTeamLogic} = require('../services/team.service');

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
        const teamData = (req.body && Object.keys(req.body).length > 0) ? req.body : req.query;
        
        const team = await createTeamLogic(teamData);

        res.status(201).json(team);
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

        const updatedTeam = await addCaptainInTeamLogic(userId,elementIdToAdd);

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
        const teamId = req.params.id;

        // On appelle notre service neutre
        const result = await deleteTeamLogic(teamId);
        
        if (!result) {
            return res.status(404).json({ message: "Cette team est introuvable." });
        }
        
        return res.status(200).json({ 
            message: "L'équipe a été supprimée avec succès.",
            playersDelete: result.deletedPlayersCount
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur serveur", error: error.message }); 
    }
};