const express = require('express');
const { getTeam, getTeams , getHistoricalMatches, getPlayerInTeam, getCaptainTeam, createTeam, addPlayerInTeam, addCaptainInTeam, updateTeam, deleteTeam } = require('../controllers/teams.controller');


const router = express.Router();

// GET
router.get("/",getTeams);
router.get("/:id",getTeam);
router.get("/matches/:id",getHistoricalMatches);
router.get("/players/:id",getPlayerInTeam);
router.get("/captain/:id",getCaptainTeam);

// POST 
router.post("/",checkAuth,createTeam);
router.post("/players/id",checkAuth,addPlayerInTeam);
router.post("/captain/:id",checkAuth,addCaptainInTeam);

// PATCH
router.patch("/:id",checkAuth, updateTeam);

// DELETE
router.delete("/:id",checkAuth,deleteTeam)
// PUT

module.exports = router 