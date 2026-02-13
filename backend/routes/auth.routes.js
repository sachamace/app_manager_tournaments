const express = require('express');
const { getAuths, getAuth, setAuth, connectAuth, changePassword } = require('../controllers/auth.controller');

const router = express.Router(); // Création d'un router qui va agir pour tout les auths


// GET
router.get("/",getAuths);
router.get("/:id",getAuth);

// POST
router.post("/register",setAuth);
router.post("/login",connectAuth);

// PATCH
router.patch("/:id",changePassword);

// Autre controllers qui arrive ! 
// ...



module.exports = router 