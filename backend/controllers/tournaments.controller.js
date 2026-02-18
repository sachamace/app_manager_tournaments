
const TournamentsModel = require('../models/tournaments.model');


// Les controllers GET

module.exports.getTournaments = async(req,res) =>{
    const tournaments = await TournamentsModel.find();
    res.status(200).json(tournaments);
};

module.exports.getTournament = async(req,res) =>{
    const tournament = await TournamentsModel.findById(req.params.id);
    res.status(200).json(tournament);
};

module.exports.getBracket = async(req,res) => {
    
};

module.exports.getTeamsRegister = async(req,res) => {

};

module.exports.getRanking = async(req,res) => {

};

// Les controllers POST 

module.exports.addTournament = async(req,res) => {

};

module.exports.addTeamsAtTournament = async(req,res) => {

};

module.exports.startTournament = async(req,res) => {

};

module.exports.cancelTournament = async (req,res) => {
    
};

// Les controllers Patch

module.exports.changeStatutTournament = async(req,res) =>{

};

// Les controllers Delete 
module.exports.deleteTournament = async(req,res) =>{

};

module.exports.unsubscribeTeam = async(req,res) =>{

};

module.exports.deleteAllMatchsTournament = async(req,res)=>{

};

// Les controlers PUT

module.exports.replaceAll = async(req,res) =>{

};

module.exports.validateListFinaleTournament = async(req,res) =>{

};

