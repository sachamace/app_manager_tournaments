const express = require('express');
const { getTeam, getTeams , getHistoricalMatches, getPlayerInTeam, getCaptainTeam, createTeam, addPlayerInTeam, addCaptainInTeam } = require('../controllers/teams.controller');


const router = express.Router();

// GET
router.get("/",getTeams);
router.get("/:id",getTeam);
router.get("/:id/matches",getHistoricalMatches);
router.get("/:id/players",getPlayerInTeam);
router.get("/:id/captain",getCaptainTeam);

// POST 
router.post("/",createTeam);
router.post("/:id/players",addPlayerInTeam);
router.post("/:id/captain",addCaptainInTeam);

// PATCH


// DELETE

// PUT

module.exports = router 