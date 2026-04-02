const TeamsModel = require('../models/teams.model');
const PlayersModel = require('../models/players.model');
const TournamentsModel = require('../models/tournaments.model');
const AppError = require('../utils/appError.js'); 

const getTeamsLogic = async () => {
    return await TeamsModel.find();
};

const getTeamLogic = async (teamId) => {
    const team = await TeamsModel.findById(teamId).populate('players');
    if (!team) {
        throw new AppError("Équipe introuvable", 404);
    }
    return team;
};

const getHistoricalMatchesLogic = async (teamId) => {
    const team = await TeamsModel.findById(teamId).populate('matches');
    if (!team) {
        throw new AppError("Équipe introuvable", 404);
    }
    return team.matches;
};

const getCaptainTeamLogic = async (teamId) => {
    const team = await TeamsModel.findById(teamId).populate('captain');
    if (!team) {
        throw new AppError("Équipe introuvable", 404);
    }
    return team.captain;
};

const getPlayerInTeamLogic = async (teamId) => {
    const team = await TeamsModel.findById(teamId).populate('players');
    if (!team) {
        throw new AppError("Équipe introuvable", 404);
    }
    return team.players;
};

const deleteTeamLogic = async (teamId) => {

    const deleteTeam = await TeamsModel.findByIdAndDelete(teamId);
    
    if (!deleteTeam) {
        throw new AppError("Équipe introuvable, impossible de la supprimer", 404);
    }
    

    const deletedPlayers = await PlayersModel.deleteMany({ team: teamId });


    if (deleteTeam.tournament) {
        await TournamentsModel.findByIdAndUpdate(deleteTeam.tournament, {
            $pull: { list_teams: teamId }
        });
    }

    return { 
        team: deleteTeam, 
        deletedPlayersCount: deletedPlayers.deletedCount 
    };
};

const createTeamLogic = async (teamData) => {
    if (!teamData || Object.keys(teamData).length === 0) {
        throw new AppError("Veuillez fournir les informations de l'équipe", 400);
    }

    const newTeam = await TeamsModel.create(teamData);

    if (newTeam.tournament) {
        await TournamentsModel.findByIdAndUpdate(newTeam.tournament, { 
            $addToSet: { list_teams: newTeam._id } 
        });
    }   

    return newTeam;
};

const addPlayerInTeamLogic = async (teamId, elementIdToAdd) => {
    if (!elementIdToAdd) {
        throw new AppError("Veuillez fournir un ID de joueur à ajouter", 400);
    }

    const updatedTeam = await TeamsModel.findByIdAndUpdate(
        teamId,
        { $addToSet: { players: elementIdToAdd } },
        { new: true, runValidators: true }
    );

    if (!updatedTeam) {
        throw new AppError("Équipe introuvable", 404);
    }

    return updatedTeam;
};

const addCaptainInTeamLogic = async (teamId, playerId) => {
    if (!playerId) {
        throw new AppError("Veuillez fournir l'ID du futur capitaine", 400);
    }

    const team = await TeamsModel.findById(teamId);

    if (!team) {
        throw new AppError("Équipe introuvable", 404);
    }


    if (team.captain && team.captain.toString().length > 0) {
        throw new AppError("Il y a déjà un capitaine dans cette équipe", 400);
    }

    const updatedTeam = await TeamsModel.findByIdAndUpdate(
        teamId,
        { $set: { captain: playerId } },
        { returnDocument: 'after', runValidators: true }
    );

    return updatedTeam;
};

module.exports = { 
    getTeamsLogic,
    getTeamLogic,
    getHistoricalMatchesLogic,
    getCaptainTeamLogic,
    getPlayerInTeamLogic,
    addPlayerInTeamLogic,
    deleteTeamLogic,
    createTeamLogic,
    addCaptainInTeamLogic
};