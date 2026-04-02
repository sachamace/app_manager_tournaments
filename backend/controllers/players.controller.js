const playerService = require('../services/players.service'); // Adapte le chemin si nécessaire
const asyncHandler = require('express-async-handler');
// --- Controllers GET ---

module.exports.getPlayers = asyncHandler(async (req, res) => {
    const players = await playerService.getPlayers();
    res.status(200).json(players);
});

module.exports.getPlayer = asyncHandler(async (req, res) => {
    const player = await playerService.getPlayerById(req.params.id);
    res.status(200).json(player);
});

// --- Controllers POST ---

module.exports.createPlayer = asyncHandler(async (req, res) => {
    const player = await playerService.createPlayer(req.body);
    res.status(201).json(player); 
});

// --- Controllers PATCH ---

module.exports.updatePseudo = asyncHandler(async (req, res) => {
    const data = (req.body && Object.keys(req.body).length > 0) ? req.body : req.query;
    const updatedPlayer = await playerService.updatePseudo(req.params.id, data.pseudo);
    res.status(200).json(updatedPlayer);
});

module.exports.updateTeam = asyncHandler(async (req, res) => {
    const data = (req.body && Object.keys(req.body).length > 0) ? req.body : req.query;
    const updatedPlayer = await playerService.updateTeam(req.params.id, data.team);
    res.status(200).json(updatedPlayer);
});

// --- Controllers DELETE ---

module.exports.deletePlayer = asyncHandler(async (req, res) => {
    const deletedPlayer = await playerService.deletePlayer(req.params.id);
    res.status(200).json({ message: "Joueur supprimé avec succès", player: deletedPlayer });
});

// --- Controllers PUT ---

module.exports.updatePlayer = asyncHandler(async (req, res) => {
    const updatedPlayer = await playerService.updatePlayer(req.params.id, req.body);
    return res.status(200).json({
        message: "Joueur mis à jour avec succès !",
        player: updatedPlayer
    });
});