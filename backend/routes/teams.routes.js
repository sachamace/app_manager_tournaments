const express = require('express');
const { getTeam, getTeams , getHistoricalMatches, getPlayerInTeam, getCaptainTeam, createTeam, addPlayerInTeam, addCaptainInTeam, updateTeam } = require('../controllers/teams.controller');


const router = express.Router();

// GET
router.get("/",getTeams);
router.get("/:id",getTeam);
router.get("/matches/:id",getHistoricalMatches);
router.get("/players/:id",getPlayerInTeam);
router.get("/captain/:id",getCaptainTeam);

// POST 
router.post("/",createTeam);
router.post("/players/id",addPlayerInTeam);
router.post("/captain/:id",addCaptainInTeam);

// PATCH
router.patch("/:id", updateTeam);

// DELETE

// PUT

module.exports = router 