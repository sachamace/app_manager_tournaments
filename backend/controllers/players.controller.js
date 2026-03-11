const PlayersModel = require('../models/players.model');
const TeamsModel = require('../models/teams.model');
// Les controller GET

module.exports.getPlayers = async(req,res) =>{
    const players = await PlayersModel.find();
    res.status(200).json(players);
};

module.exports.getPlayer = async(req,res) =>{
    const player = await PlayersModel.findById(req.params.id);
    if (!player) {
        return res.status(404).json({ message: "Joueur non trouvé" });
    }
    res.status(200).json(player);
};


// Les controllers POST

module.exports.createPlayer = async(req,res) => {
    try {
        const {pseudo, team} = (req.body && Object.keys(req.body).length > 0) ? req.body : req.query;
        const player = await PlayersModel.create({
            pseudo,
            team
        });
        res.status(200).json(player);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};


// Les controllers Patch 
module.exports.updatePseudo = async(req,res) => {
    const pseudo = (req.body && Object.keys(req.body).length > 0) ? req.body : req.query;
    const player = await PlayersModel.findById(req.params.id);
    if(!player){
        return res.status(400).json({message : "Ce joueur n'existe pas !"});
    }
    const updatePlayer = await PlayersModel.findByIdAndUpdate(
        player,
        pseudo,
        {new : true}   
    )
    res.status(200).json(updatePlayer);
};

module.exports.updateTeam = async(req,res) => {
    const team = (req.body && Object.keys(req.body).length > 0) ? req.body : req.query;
    const player = await PlayersModel.findById(req.params.id);
    if(!player){
        return res.status(400).json({message : "Ce joueur n'existe pas !"});
    }
    const updatePlayer = await PlayersModel.findByIdAndUpdate(
        player,
        team,
        {new : true}   
    )
    res.status(200).json(updatePlayer);
};

// Les controllers Delete

module.exports.deletePlayer = async(req,res) => {
try {
        const playerId = req.params.id;
        
        const deletedPlayer = await PlayersModel.findByIdAndDelete(playerId);

        if (!deletedPlayer) {
            return res.status(404).json({ message: "Ce joueur n'existe pas." });
        }

        // 2. On met à jour l'équipe SEULEMENT si ce joueur avait une équipe
        if (deletedPlayer.team) {
            await TeamsModel.updateOne(
                { 
                    _id: deletedPlayer.team, 
                    captain: deletedPlayer._id 
                }, 
                { $unset: { captain: "" } } 
            );
        }

        // 3. On n'oublie pas de renvoyer une réponse de succès !
        return res.status(200).json({ 
            message: "Joueur supprimé avec succès.",
            player: deletedPlayer
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

// Les controllers PUT

module.exports.updatePlayer = async(req,res) => {
    try {
        const playerId = req.params.id;
        const { pseudo, team } = req.body;

        const updateData = {};

        if (pseudo) updateData.pseudo = pseudo;

        if (team) updateData.team = team;

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "Aucune donnée à modifier." });
        }
        const updatedPlayer = await PlayersModel.findByIdAndUpdate(
            playerId,       
            updateData,     
            { new: true, runValidators: true } 
        );

        if (!updatedPlayer) {
            return res.status(404).json({ message: "Ce joueur n'existe pas." });
        }

        return res.status(200).json({
            message: "Joueur mis à jour avec succès !",
            player: updatedPlayer
        });


    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};