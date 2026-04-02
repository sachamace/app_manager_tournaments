const MatchesModel = require('../models/matches.model');
const TournamentsModel = require('../models/tournaments.model');

const {updateMatchScoreLogic} = require('../services/match.service');

// Les controllers GET
module.exports.getMatchesInTournaments = async (req, res) => {
    try {
        const idTournament = req.params.id;
        // On ajoute .populate('matches') juste après le findById
        const tournament = await TournamentsModel.findById(idTournament);

        if (!tournament) {
            return res.status(404).json({ message: "Tournoi non trouvé" });
        }

        const matches = await MatchesModel.find({ tournament: idTournament })
            .populate('teams') 
            .populate('winner')
            .sort({ round: 1, matchNumber: 1 });

        res.status(200).json(matches);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

module.exports.getMatch = async(req,res) => {
    const match = await MatchesModel.findById(req.params.id);
    if (!match) {
        return res.status(404).json({ message: "Match non trouvé" });
    }
    res.status(200).json(match);
};

// Les controllers Patch 

exports.updateScore = async (req, res) => {
    try {
        const matchId = req.params.id;
        const scores = req.body; 

        const matchUpdated = await updateMatchScoreLogic(matchId, scores);

        if (!matchUpdated) {
            return res.status(404).json({ message: "Match introuvable." });
        }

        return res.status(200).json(matchUpdated);

    } catch (error) {
        return res.status(400).json({ error: error.message }); 
    }
}
