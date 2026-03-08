const express = require('express');
const{ getPlayers,getPlayer,createPlayer,updatePseudo,updateTeam,deletePlayer,updatePlayer} = require('../controllers/players.controller');

const router = express.Router(); 

// GET 
router.get("/",getPlayers);
router.get("/:id",getPlayer);
// POST
router.post("/",createPlayer);
// PATCH
router.patch("/pseudo/:id",updatePseudo);
router.patch("/team/:id",updateTeam);
// DELETE
router.delete("/:id",deletePlayer);
// PUT
router.put("/:id",updatePlayer);

module.exports = router 