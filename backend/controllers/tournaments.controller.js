const tournamentService = require('../services/tournament.service');
const asyncHandler = require('express-async-handler');
// --- Contrôleurs GET ---

module.exports.getTournaments = asyncHandler(async (req, res) => {
    const tournaments = await tournamentService.getTournaments();
    res.status(200).json(tournaments);
});

module.exports.getTournamentByAccount = asyncHandler(async (req, res) => {
    const tournaments = await tournamentService.getTournamentByAccount(req.params.accountId);
    res.status(200).json(tournaments);
});

module.exports.getTournament = asyncHandler(async (req, res) => {
        const tournament = await tournamentService.getTournamentById(req.params.id);
        if (!tournament) {
            return res.status(404).json({ message: "Tournoi non trouvé" });
        }
        res.status(200).json(tournament);
});

module.exports.getBracket = asyncHandler(async (req, res) => {
    const treeType = await tournamentService.getBracket(req.params.id);
    res.status(200).json(treeType);
});

module.exports.getTeamsRegister = asyncHandler(async (req, res) => {
    const listTeams = await tournamentService.getTeamsRegister(req.params.id);
    res.status(200).json(listTeams);
});

module.exports.getRanking = asyncHandler(async (req, res) => {
    const ranking = await tournamentService.getRanking(req.params.id);
    res.status(200).json(ranking);
});

// --- Contrôleurs POST ---

module.exports.addTournament = asyncHandler(async (req, res) => {
    const data = { 
        ...req.body, 
        account: req.user.id 
    };
    const tournament = await tournamentService.addTournament(data);
    res.status(201).json(tournament);
});

module.exports.addTeamsAtTournament = asyncHandler(async (req, res) => {
    const updateTournament = await tournamentService.addTeamsAtTournament(req.params.id, req.body);
    return res.status(201).json({
        message: "Teams ajouté dans le tournoi avec succès !",
        data: updateTournament
    });
});

module.exports.startTournament = asyncHandler(async (req, res) => {
    const result = await tournamentService.startTournament(req.params.id);
    return res.status(201).json(result);
});

module.exports.generateNextRound = asyncHandler(async (req, res) => {
    const result = await tournamentService.generateNextRound(req.params.id);
    return res.status(201).json(result);
});

module.exports.cancelTournament = asyncHandler(async (req, res) => {
    const result = await tournamentService.cancelTournament(req.params.id);
    return res.status(200).json({
        message: "Le tournoi a été réinitialisé avec succès. Tous les matchs ont été supprimés.",
        deletedCount: result.deletedCount,
        tournament: result.tournament
    });
});

// --- Contrôleurs PATCH ---

module.exports.changeStatutTournament = async (req, res) => {
    // Logique à implémenter
};

// --- Contrôleurs DELETE ---

module.exports.deleteTournament = asyncHandler(async (req, res) => {
    const result = await tournamentService.deleteTournament(req.params.id);
    return res.status(200).json({ 
        message: "Le tournoi a été supprimé avec succès.",
        matchesDeleted: result.matchesDeleted
    });
});

module.exports.deleteAllTeamInTournament = asyncHandler(async (req, res) => {
    await tournamentService.deleteAllTeamInTournament(req.params.id);
    return res.status(200).json({ 
        message: "Toutes les équipes du tournoi ont été supprimées avec succès (ainsi que leurs joueurs)." 
    });
});