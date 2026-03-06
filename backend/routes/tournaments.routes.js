const express = require('express');
const { getTournaments, getTournament, getBracket, getTeamsRegister, getRanking } = require('../controllers/tournaments.controller');

const router = express.Router(); // Création d'un router qui va agir pour tout les tournaments

// GET
router.get("/",getTournaments);
router.get("/:id",getTournament);
router.get("/:id/bracket",getBracket);
router.get("/:id/participants",getTeamsRegister);
router.get("/:id/standings",getRanking);
// POST

// PUT



module.exports = router 