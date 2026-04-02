const MatchesModel = require('../models/matches.model');
const TournamentsModel = require('../models/tournaments.model');
const AppError = require('../utils/appError.js');

const getMatchesInTournamentsLogic = async (idTournament) => {
    const tournament = await TournamentsModel.findById(idTournament);
    
    if (!tournament) {
        throw new AppError("Tournoi introuvable !", 404);
    }

    const matches = await MatchesModel.find({ tournament: idTournament })
        .populate('teams') 
        .populate('winner')
        .sort({ round: 1, matchNumber: 1 });

    return matches;
};

const getMatchLogic = async (matchId) => {
    const match = await MatchesModel.findById(matchId);
    
    if (!match) {
        throw new AppError("Match introuvable !", 404); 
    }
    
    return match;
};

const updateMatchScoreLogic = async (matchId, scores) => {

    if (!scores || !Array.isArray(scores) || scores.length !== 2) {
        throw new AppError("Format des scores invalide ! Deux scores sont requis.", 400);
    }

    const match = await MatchesModel.findById(matchId);
    if (!match) {
        throw new AppError("Match introuvable !", 404);
    }

    const team1_Id = scores[0].team;
    const team2_Id = scores[1].team;
    const points1 = Number(scores[0].points);
    const points2 = Number(scores[1].points);

    if (isNaN(points1) || isNaN(points2)) {
        throw new AppError("Les points doivent être des nombres valides.", 400);
    }

    const matchTeamsStr = match.teams.map(id => id.toString());
    
    if (!matchTeamsStr.includes(team1_Id) || !matchTeamsStr.includes(team2_Id)) {
        throw new AppError("Les équipes ne correspondent pas à celles de ce match !", 400);
    }

    let winner = null;
    let loser = null;

    if (points1 > points2) {
        winner = team1_Id;
        loser = team2_Id;
    } else if (points2 > points1) {
        winner = team2_Id;
        loser = team1_Id;
    } else { 
        throw new AppError("Les matchs nuls ne sont pas autorisés pour le moment.", 400);
    }

    match.score = scores;
    match.winner = winner;
    match.loser = loser;

    const updatedMatch = await match.save();
    
    return updatedMatch;
}

module.exports = {
    getMatchesInTournamentsLogic,
    getMatchLogic,
    updateMatchScoreLogic
};