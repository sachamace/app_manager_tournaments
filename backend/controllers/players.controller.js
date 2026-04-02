const playerService = require('../services/players.service'); // Adapte le chemin si nécessaire

// --- Controllers GET ---

module.exports.getPlayers = async (req, res) => {
    try {
        const players = await playerService.getPlayers();
        res.status(200).json(players);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

module.exports.getPlayer = async (req, res) => {
    try {
        const player = await playerService.getPlayerById(req.params.id);
        res.status(200).json(player);
    } catch (error) {
        if (error.status) return res.status(error.status).json({ message: error.message });
        console.error(error);
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

// --- Controllers POST ---

module.exports.createPlayer = async (req, res) => {
    try {
        const data = (req.body && Object.keys(req.body).length > 0) ? req.body : req.query;
        const player = await playerService.createPlayer(data);
        res.status(200).json(player);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

// --- Controllers PATCH ---

module.exports.updatePseudo = async (req, res) => {
    try {
        const data = (req.body && Object.keys(req.body).length > 0) ? req.body : req.query;
        const updatedPlayer = await playerService.updatePseudo(req.params.id, data.pseudo);
        res.status(200).json(updatedPlayer);
    } catch (error) {
        if (error.status) return res.status(error.status).json({ message: error.message });
        console.error(error);
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

module.exports.updateTeam = async (req, res) => {
    try {
        const data = (req.body && Object.keys(req.body).length > 0) ? req.body : req.query;
        const updatedPlayer = await playerService.updateTeam(req.params.id, data.team);
        res.status(200).json(updatedPlayer);
    } catch (error) {
        if (error.status) return res.status(error.status).json({ message: error.message });
        console.error(error);
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

// --- Controllers DELETE ---

module.exports.deletePlayer = async (req, res) => {
    try {
        const deletedPlayer = await playerService.deletePlayer(req.params.id);
        return res.status(200).json({ 
            message: "Joueur supprimé avec succès.",
            player: deletedPlayer
        });
    } catch (error) {
        if (error.status) return res.status(error.status).json({ message: error.message });
        console.error(error);
        return res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

// --- Controllers PUT ---

module.exports.updatePlayer = async (req, res) => {
    try {
        const updatedPlayer = await playerService.updatePlayer(req.params.id, req.body);
        return res.status(200).json({
            message: "Joueur mis à jour avec succès !",
            player: updatedPlayer
        });
    } catch (error) {
        if (error.status) return res.status(error.status).json({ message: error.message });
        console.error(error);
        return res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};