const TeamsModel = require('../models/teams.model');
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

const updateTeamLogic = async (teamId, updateData) => {
    if (!updateData || Object.keys(updateData).length === 0) {
        throw new AppError("Veuillez fournir les informations à mettre à jour", 400);
    }
    
    const updatedTeam = await TeamsModel.findByIdAndUpdate(
        teamId,
        { $set: updateData }, 
        { 
            new: true,           
            runValidators: true  
        }
    );


    if (!updatedTeam) {
        throw new AppError("Cette équipe est introuvable et n'a pas pu être mise à jour.", 404);
    }

    return updatedTeam;
};

module.exports = { 
    getTeamsLogic,
    getTeamLogic,
    getHistoricalMatchesLogic,
    deleteTeamLogic,
    createTeamLogic,
    updateTeamLogic
};