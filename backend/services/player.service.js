const PlayersModel = require('../models/players.model');
const TeamsModel = require('../models/teams.model');

// --- SERVICES GET ---

const getPlayers = async () => {
    return await PlayersModel.find();
};

const getPlayerById = async (id) => {
    const player = await PlayersModel.findById(id);
    if (!player) {
        throw { status: 404, message: "Joueur non trouvé" };
    }
    return player;
};

// --- SERVICES POST ---

const createPlayer = async (data) => {
    return await PlayersModel.create({
        pseudo: data.pseudo,
        team: data.team
    });
};

// --- SERVICES PATCH ---

const updatePseudo = async (id, pseudo) => {
    if (!pseudo) {
        throw { status: 400, message: "Veuillez fournir un pseudo." };
    }
    
    const updatedPlayer = await PlayersModel.findByIdAndUpdate(
        id,
        { $set: { pseudo: pseudo } },
        { returnDocument: 'after', runValidators: true }   
    );
    
    if (!updatedPlayer) {
        throw { status: 404, message: "Ce joueur n'existe pas !" };
    }
    
    return updatedPlayer;
};

const updateTeam = async (id, team) => {
    if (!team) {
        throw { status: 400, message: "Veuillez fournir un ID d'équipe." };
    }
    
    const updatedPlayer = await PlayersModel.findByIdAndUpdate(
        id,
        { $set: { team: team } },
        { returnDocument: 'after', runValidators: true }   
    );
    
    if (!updatedPlayer) {
        throw { status: 404, message: "Ce joueur n'existe pas !" };
    }
    
    return updatedPlayer;
};

// --- SERVICES DELETE ---

const deletePlayer = async (id) => {
    const deletedPlayer = await PlayersModel.findByIdAndDelete(id);

    if (!deletedPlayer) {
        throw { status: 404, message: "Ce joueur n'existe pas." };
    }

    // Si le joueur appartenait à une équipe, on vérifie s'il était capitaine
    if (deletedPlayer.team) {
        await TeamsModel.updateOne(
            { 
                _id: deletedPlayer.team, 
                captain: deletedPlayer._id 
            }, 
            { $unset: { captain: "" } } 
        );
    }

    return deletedPlayer;
};

// --- SERVICES PUT ---

const updatePlayer = async (id, data) => {
    const { pseudo, team } = data;
    const updateData = {};

    if (pseudo) updateData.pseudo = pseudo;
    if (team) updateData.team = team;

    if (Object.keys(updateData).length === 0) {
        throw { status: 400, message: "Aucune donnée à modifier." };
    }

    const updatedPlayer = await PlayersModel.findByIdAndUpdate(
        id,       
        { $set: updateData },     
        { returnDocument: 'after', runValidators: true } 
    );

    if (!updatedPlayer) {
        throw { status: 404, message: "Ce joueur n'existe pas." };
    }

    return updatedPlayer;
};

module.exports = {
    getPlayers,
    getPlayerById,
    createPlayer,
    updatePseudo,
    updateTeam,
    deletePlayer,
    updatePlayer
};