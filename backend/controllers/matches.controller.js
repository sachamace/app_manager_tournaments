const MatchesModel = require('../models/matches.model');
const TournamentsModel = require('../models/tournaments.model');


// Les controllers GET
module.exports.getMatchesInTournaments = async (req, res) => {
    try {
        const idTournament = req.params.id;
        // On ajoute .populate('matches') juste après le findById
        const tournament = await TournamentsModel.findById(idTournament);

        if (!tournament) {
            return res.status(404).json({ message: "Tournoi non trouvé" });
        }

        const matches = await MatchesModel.find({ tournament: idTournament });

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


// Les controllers Post 



// Les controllers Patch 

module.exports.updateMatchScore = async (req, res) => {
    try {
        const matchId = req.params.id;
        const { scores } = req.body;

        // 1. Vérification du format envoyé par le Front-end
        if (!scores || !Array.isArray(scores) || scores.length !== 2) {
            return res.status(400).json({ message: "Le format est invalide ou il manque des scores." });
        }

        // 2. On récupère le match actuel en base de données
        const match = await MatchesModel.findById(matchId);
        if (!match) {
            return res.status(404).json({ message: "Match introuvable." });
        }

        // 3. On extrait les ID et les points envoyés dans le Body
        const team1_Id = scores[0].team;
        const team2_Id = scores[1].team;
        const points1 = Number(scores[0].points);
        const points2 = Number(scores[1].points);

        // 4. SÉCURITÉ : Vérifier que les équipes envoyées jouent bien ce match
        const matchTeamsStr = match.teams.map(id => id.toString());

        if (!matchTeamsStr.includes(team1_Id) || !matchTeamsStr.includes(team2_Id)) {
            return res.status(400).json({ 
                message: "Alerte : Au moins l'une des équipes envoyées ne fait pas partie de ce match !" 
            });
        }

        // 5. ALGORITHME : Déterminer le gagnant et le perdant
        let winner = null;
        let loser = null;

        if (points1 > points2) {
            winner = team1_Id;
            loser = team2_Id;
        } else if (points2 > points1) {
            winner = team2_Id;
            loser = team1_Id;
        } 

        // 6. On met à jour l'objet "match" qu'on a récupéré
        match.score = scores;
        match.winner = winner;
        match.loser = loser;

        // 7. On sauvegarde les modifications en base de données
        const updatedMatch = await match.save();

        return res.status(200).json({
            message: "Le score a été enregistré et le résultat calculé avec succès !",
            match: updatedMatch
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

