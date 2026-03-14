const express = require('express');
const { getTournaments, getTournament, getBracket, getTeamsRegister, getRanking, addTournament, addTeamsAtTournament, startTournament, cancelTournament ,generateNextRound,unsubscribeTeam, deleteTournament, getTournamentByAccount} = require('../controllers/tournaments.controller');

const router = express.Router(); // Création d'un router qui va agir pour tout les tournaments

// GET
router.get("/",getTournaments);
router.get("/:id",getTournament);
router.get("/account/:accountId", getTournamentsByAccount);
router.get("/:id/bracket",getBracket);
router.get("/:id/participants",getTeamsRegister);
router.get("/:id/standings",getRanking);
// POST
router.post("/",addTournament);
router.post("/:id/participants",addTeamsAtTournament);
router.post("/:id/start",startTournament);
router.post("/:id/reset",cancelTournament);
router.post('/:id/next-round', generateNextRound);
// PUT

// PATCH 

// DELETE 
router.delete('/:id/teams/:teamId', unsubscribeTeam);
router.delete('/:id',deleteTournament);

module.exports = router 