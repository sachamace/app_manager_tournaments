const express = require('express');
const { getTeam, getTeams , getHistoricalMatches, getPlayerInTeam, getCaptainTeam, createTeam, addPlayerInTeam, addCaptainInTeam, updateTeam, deleteTeam } = require('../controllers/teams.controller');


const router = express.Router();
// On importe le middleware
const { checkAuth } = require('../middleware/auth.middleware'); 
// GET
router.get("/",getTeams);
router.get("/:id",getTeam);
router.get("/matches/:id",getHistoricalMatches);

// POST 
router.post("/",checkAuth,createTeam);

// PATCH
router.patch("/:id",checkAuth, updateTeam);

// DELETE
router.delete("/:id",checkAuth,deleteTeam)
// PUT

module.exports = router 