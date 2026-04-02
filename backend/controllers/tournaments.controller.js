const tournamentService = require('../services/tournament.service');

// --- Contrôleurs GET ---

module.exports.getTournaments = async (req, res) => {
    try {
        const tournaments = await tournamentService.getTournaments();
        res.status(200).json(tournaments);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

module.exports.getTournamentByAccount = async (req, res) => {
    try {
        const tournaments = await tournamentService.getTournamentByAccount(req.params.accountId);
        res.status(200).json(tournaments);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

module.exports.getTournament = async (req, res) => {
    try {
        const tournament = await tournamentService.getTournamentById(req.params.id);
        if (!tournament) {
            return res.status(404).json({ message: "Tournoi non trouvé" });
        }
        res.status(200).json(tournament);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

module.exports.getBracket = async (req, res) => {
    try {
        const treeType = await tournamentService.getBracket(req.params.id);
        res.status(200).json(treeType);
    } catch (error) {
        if (error.status) return res.status(error.status).json({ message: error.message });
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

module.exports.getTeamsRegister = async (req, res) => {
    try {
        const listTeams = await tournamentService.getTeamsRegister(req.params.id);
        res.status(200).json(listTeams);
    } catch (error) {
        if (error.status) return res.status(error.status).json({ message: error.message });
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

module.exports.getRanking = async (req, res) => {
    try {
        const ranking = await tournamentService.getRanking(req.params.id);
        res.status(200).json(ranking);
    } catch (error) {
        if (error.status) return res.status(error.status).json({ message: error.message });
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

// --- Contrôleurs POST ---

module.exports.addTournament = async (req, res) => {
    try {
        const data = (req.body && Object.keys(req.body).length > 0) ? req.body : req.query;
        const tournament = await tournamentService.addTournament(data);
        res.status(200).json(tournament);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

module.exports.addTeamsAtTournament = async (req, res) => {
    try {
        const updateTournament = await tournamentService.addTeamsAtTournament(req.params.id, req.body);
        return res.status(200).json({
            message: "Teams ajouté dans le tournoi avec succès !",
            data: updateTournament
        });
    } catch (error) {
        if (error.status) return res.status(error.status).json({ message: error.message });
        return res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

module.exports.startTournament = async (req, res) => {
    try {
        const result = await tournamentService.startTournament(req.params.id);
        return res.status(200).json(result);
    } catch (error) {
        if (error.status) return res.status(error.status).json({ message: error.message });
        return res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

module.exports.generateNextRound = async (req, res) => {
    try {
        const result = await tournamentService.generateNextRound(req.params.id);
        return res.status(200).json(result);
    } catch (error) {
        if (error.status) return res.status(error.status).json({ message: error.message });
        return res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

module.exports.cancelTournament = async (req, res) => {
    try {
        const result = await tournamentService.cancelTournament(req.params.id);
        return res.status(200).json({
            message: "Le tournoi a été réinitialisé avec succès. Tous les matchs ont été supprimés.",
            deletedCount: result.deletedCount,
            tournament: result.tournament
        });
    } catch (error) {
        if (error.status) return res.status(error.status).json({ message: error.message });
        return res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

// --- Contrôleurs PATCH ---

module.exports.changeStatutTournament = async (req, res) => {
    // Logique à implémenter
};

// --- Contrôleurs DELETE ---

module.exports.deleteTournament = async (req, res) => {
    try {
        const result = await tournamentService.deleteTournament(req.params.id);
        return res.status(200).json({ 
            message: "Le tournoi a été supprimé avec succès.",
            matchesDeleted: result.matchesDeleted
        });
    } catch (error) {
        if (error.status) return res.status(error.status).json({ message: error.message });
        return res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

module.exports.deleteAllTeamInTournament = async (req, res) => {
    try {
        await tournamentService.deleteAllTeamInTournament(req.params.id);
        return res.status(200).json({ 
            message: "Toutes les équipes du tournoi ont été supprimées avec succès (ainsi que leurs joueurs)." 
        });
    } catch (error) {
        if (error.status) return res.status(error.status).json({ message: error.message });
        return res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};