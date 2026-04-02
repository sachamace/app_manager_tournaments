const express = require('express');
const{ getPlayers,getPlayer,createPlayer,updatePseudo,updateTeam,deletePlayer,updatePlayer} = require('../controllers/players.controller');

const router = express.Router(); 

// GET 
router.get("/",getPlayers);
router.get("/:id",getPlayer);
// POST
router.post("/",checkAuth,createPlayer);
// PATCH
router.patch("/pseudo/:id",checkAuth,updatePseudo);
router.patch("/team/:id",checkAuth,updateTeam);
// DELETE
router.delete("/:id",checkAuth,deletePlayer);
// PUT
router.put("/:id",checkAuth,updatePlayer);

module.exports = router 