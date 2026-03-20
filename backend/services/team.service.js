const TeamsModel = require('../models/teams.model');
const PlayersModel = require('../models/players.model');
const TournamentsModel = require('../models/tournaments.model');

const deleteTeamLogic = async (teamId) => {
    // 1. Supprimer la team
    const deleteTeam = await TeamsModel.findByIdAndDelete(teamId);
    
    if (!deleteTeam) {
        return null; // On retourne null si la team n'existe pas
    }
    
    // 2. Supprimer les joueurs associés
    const deletedPlayers = await PlayersModel.deleteMany({ team: teamId });

    // 3. Retirer la team du tournoi
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

const createTeamLogic = async (teamData) =>{
    const newTeam = await TeamsModel.create(teamData);

    if(newTeam.tournament){
        await TournamentsModel.findByIdAndUpdate(newTeam.tournament, { 
            $addToSet: { list_teams: newTeam._id } 
        });
    }   

    return newTeam;
};

const addCaptainInTeamLogic = async (teamId,playerId) => {
    const team = await TeamsModel.findById(teamId);

    if (!team) {
        return null; // On retourne null si la team n'existe pas
    }

    if (team.captain && team.captain.length > 0) {
        return null; // Il existe déjà un capitaine dans votre équipe // retourne null
    }

    const updatedTeam = await TeamsModel.findByIdAndUpdate(
        teamId,
        { $addToSet: { captain: playerId } },
        { returnDocument: 'after', runValidators: true }
    );


    return updatedTeam;
};

module.exports = { deleteTeamLogic , createTeamLogic , addCaptainInTeamLogic};