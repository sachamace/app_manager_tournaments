const MatchesModel = require('../models/matches.model');



const updateMatchScoreLogic = async (matchId,scores) => {
    if (!scores || !Array.isArray(scores) || scores.length !== 2) {
        throw new Error("Format des scores invalide. Deux scores sont requis.");
    }
    const match = await MatchesModel.findById(matchId);
    if (!match) {
        return null;
    }
    const team1_Id = scores[0].team;
    const team2_Id = scores[1].team;
    const points1 = Number(scores[0].points);
    const points2 = Number(scores[1].points);
    const matchTeamsStr = match.teams.map(id => id.toString());
    if (!matchTeamsStr.includes(team1_Id) || !matchTeamsStr.includes(team2_Id)) {
        throw new Error("Les équipes fournies ne correspondent pas à celles de ce match.");
    }

    let winner = null;
    let loser = null;

    if (points1 > points2) {
        winner = team1_Id;
        loser = team2_Id;
    } else if (points2 > points1) {
        winner = team2_Id;
        loser = team1_Id;
    } 
    else { // ca va changer quand je vais mettre en place le mode championnat en place.
        throw new Error("Les matchs nuls ne sont pas autorisés.");
    }


    match.score = scores;
    match.winner = winner;
    match.loser = loser;


    const updatedMatch = await match.save();
    
    return  updatedMatch;
}





module.exports = { updateMatchScoreLogic};





