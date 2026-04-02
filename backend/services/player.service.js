const PlayersModel = require('../models/players.model');
const TeamsModel = require('../models/teams.model');
const AppError = require('../utils/appError.js');

// --- SERVICES GET ---

const getPlayers = async () => {
    return await PlayersModel.find();
};

const getPlayerById = async (id) => {
    const player = await PlayersModel.findById(id);
    if (!player) {
        throw new AppError("Joueur Introuvable", 404);
    }
    return player;
};

// --- SERVICES POST ---

const createPlayer = async (data) => {
    // 400 = Mauvaise requête (champ manquant)
    if (!data.pseudo) {
        throw new AppError("Veuillez fournir un pseudo pour le joueur.", 400);
    }

    return await PlayersModel.create({
        pseudo: data.pseudo,
        team: data.team || null // Assure-toi que team soit null si non fourni
    });
};

// --- SERVICES PATCH ---

const updatePseudo = async (id, pseudo) => {
    if (!pseudo) {
        throw new AppError("Veuillez fournir un pseudo.", 400);
    }
    
    const updatedPlayer = await PlayersModel.findByIdAndUpdate(
        id,
        { $set: { pseudo: pseudo } },
        { returnDocument: 'after', runValidators: true }   
    );
    
    if (!updatedPlayer) {
        throw new AppError("Ce joueur n'existe pas !", 404);
    }
    
    return updatedPlayer;
};

const updateTeam = async (id, team) => {
    if (!team) {
        throw new AppError("Veuillez fournir un ID d'équipe.", 400);
    }
    
    const updatedPlayer = await PlayersModel.findByIdAndUpdate(
        id,
        { $set: { team: team } },
        { returnDocument: 'after', runValidators: true }   
    );
    
    if (!updatedPlayer) {
        throw new AppError("Ce joueur n'existe pas !", 404);
    }
    
    return updatedPlayer;
};

// --- SERVICES DELETE ---

const deletePlayer = async (id) => {
    const deletedPlayer = await PlayersModel.findByIdAndDelete(id);

    if (!deletedPlayer) {
        throw new AppError("Ce joueur n'existe pas.", 404);
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
        throw new AppError("Aucune donnée à modifier.", 400);
    }

    const updatedPlayer = await PlayersModel.findByIdAndUpdate(
        id,       
        { $set: updateData },     
        { returnDocument: 'after', runValidators: true } 
    );

    if (!updatedPlayer) {
        throw new AppError("Ce joueur n'existe pas.", 404);
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