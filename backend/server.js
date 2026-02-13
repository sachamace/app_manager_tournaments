const express = require("express");
const dotenv = require('dotenv').config();
const connectDB = require("./config/db");

const port = 5000

//connexion à la db 
connectDB();

const app = express();


// Middleware qui permet de traiter les donnée de la Request 
app.use(express.json());
app.use(express.urlencoded({extended: false}))

app.use("/tournaments",require("./routes/tournaments.routes")); // J'utilise tournaments
app.use("/teams",require("./routes/teams.routes")); // J'utilise teams
app.use("/auth",require("./routes/auth.routes")); // J'utilise auth
app.use("/matches",require("./routes/matches.routes")); // J'utilise matches
app.use("/players",require("./routes/players.routes")); // J'utilise players

app.listen(port, () => console.log("Le serveur a démarré au N port " + port));