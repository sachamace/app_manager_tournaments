const express = require('express');
const{ getMatchesInTournaments, getMatch, updateMatchScore } = require('../controllers/matches.controller');

const router = express.Router(); 

// GET 
router.get("/tournaments/:id",getMatchesInTournaments)
router.get("/:id",getMatch);
// POST


// PATCH
router.patch("/:id",checkAuth,updateMatchScore);

// DELETE


// PUT


module.exports = router 