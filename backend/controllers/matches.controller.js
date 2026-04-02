const {updateMatchScoreLogic,getMatchesInTournamentsLogic,getMatchLogic} = require('../services/match.service');
const asyncHandler = require('express-async-handler');
// Les controllers GET
module.exports.getMatchesInTournaments = asyncHandler(async (req, res) => {
    const idTournament = req.params.id;
    const matches = await getMatchesInTournamentsLogic(idTournament);
    res.status(200).json(matches);

});

module.exports.getMatch = asyncHandler(async (req, res) => {

    const match = await getMatchLogic(req.params.id);
    res.status(200).json(match);

});

// Les controllers Patch 

exports.updateScore = asyncHandler(async (req, res) => {
    const matchId = req.params.id;
    const scores = req.body; 

    const matchUpdated = await updateMatchScoreLogic(matchId, scores);

    return res.status(200).json(matchUpdated);
})
