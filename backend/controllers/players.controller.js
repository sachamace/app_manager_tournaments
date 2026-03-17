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
    try {
        const { pseudo } = (req.body && Object.keys(req.body).length > 0) ? req.body : req.query;
        if(!pseudo){
            return res.status(400).json({message : "Veuillez fournir un pseudo."});
        }
        const updatedPlayer = await PlayersModel.findByIdAndUpdate(
            req.params.id,
            { $set: { pseudo: pseudo } },
            { returnDocument: 'after', runValidators: true }   
        );
        if(!updatedPlayer){
            return res.status(404).json({message : "Ce joueur n'existe pas !"});
        }
        res.status(200).json(updatedPlayer);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

module.exports.updateTeam = async(req,res) => {
    try {
        const { team } = (req.body && Object.keys(req.body).length > 0) ? req.body : req.query;
        if(!team){
            return res.status(400).json({message : "Veuillez fournir un ID d'équipe."});
        }
        const updatedPlayer = await PlayersModel.findByIdAndUpdate(
            req.params.id,
            { $set: { team: team } },
            { returnDocument: 'after', runValidators: true }   
        );
        if(!updatedPlayer){
            return res.status(404).json({message : "Ce joueur n'existe pas !"});
        }
        res.status(200).json(updatedPlayer);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

// Les controllers Delete

module.exports.deletePlayer = async(req,res) => {
try {
        const playerId = req.params.id;
        
        const deletedPlayer = await PlayersModel.findByIdAndDelete(playerId);

        if (!deletedPlayer) {
            return res.status(404).json({ message: "Ce joueur n'existe pas." });
        }

        if (deletedPlayer.team) {
            await TeamsModel.updateOne(
                { 
                    _id: deletedPlayer.team, 
                    captain: deletedPlayer._id 
                }, 
                { $unset: { captain: "" } } 
            );
        }

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
            { $set: updateData },     
            { returnDocument: 'after', runValidators: true } 
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