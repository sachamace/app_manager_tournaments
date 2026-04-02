const express = require('express');
const router = express.Router(); // Création d'un router qui va agir pour tout les tournaments
const { getTournaments, getTournament, getBracket, getTeamsRegister, getRanking, addTournament, addTeamsAtTournament, startTournament, cancelTournament ,generateNextRound,unsubscribeTeam, deleteTournament, getTournamentByAccount} = require('../controllers/tournaments.controller');


// On importe le middleware
const { checkAuth } = require('../middleware/auth.middleware'); 
// GET
router.get("/",getTournaments);
router.get("/:id",getTournament);
router.get("/account/:accountId", getTournamentByAccount);
router.get("/:id/bracket",getBracket);
router.get("/:id/participants",getTeamsRegister);
router.get("/:id/standings",getRanking);
// POST
router.post("/",checkAuth,addTournament);
router.post("/:id/participants",checkAuth,addTeamsAtTournament);
router.post("/:id/start",checkAuth,startTournament);
router.post("/:id/reset",checkAuth,cancelTournament);
router.post('/:id/next-round', checkAuth,generateNextRound);
// PUT

// PATCH 

// DELETE 
router.delete("/:id", checkAuth, deleteTournament);

module.exports = router 