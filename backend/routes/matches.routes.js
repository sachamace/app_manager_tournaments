const express = require('express');
const{ getMatchesInTournaments, getMatch, updateScore } = require('../controllers/matches.controller');

const router = express.Router(); 
// On importe le middleware
const { checkAuth } = require('../middleware/auth.middleware'); 
// GET 
router.get("/tournaments/:id",getMatchesInTournaments)
router.get("/:id",getMatch);
// POST


// PATCH
router.patch("/:id",checkAuth,updateScore);

// DELETE


// PUT


module.exports = router 