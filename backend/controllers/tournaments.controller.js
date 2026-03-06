
const TournamentsModel = require('../models/tournaments.model');


// Les controllers GET

module.exports.getTournaments = async(req,res) =>{
    const tournaments = await TournamentsModel.find();
    res.status(200).json(tournaments);
};

module.exports.getTournament = async(req,res) =>{
    const tournament = await TournamentsModel.findById(req.params.id);
    if (!tournament) {
        return res.status(404).json({ message: "Tournoi non trouvé" });
    }
    res.status(200).json(tournament);
};

module.exports.getBracket = async(req,res) => {
    const tournament = await TournamentsModel.findById(req.params.id);
    if (!tournament) {
        return res.status(404).json({ message: "Tournoi non trouvé" });
    }
    res.status(200).json(tournament.tree_type);
};

module.exports.getTeamsRegister = async(req,res) => {
    const tournament = await TournamentsModel.findById(req.params.id);
    if (!tournament) {
        return res.status(404).json({ message: "Tournoi non trouvé" });
    }
    res.status(200).json(tournament.list_teams);
};

module.exports.getRanking = async(req,res) => {
    const tournament = await TournamentsModel.findById(req.params.id);
    if (!tournament) {
        return res.status(404).json({ message: "Tournoi non trouvé" });
    }
    res.status(200).json(tournament.classement);
};

// Les controllers POST 

module.exports.addTournament = async(req,res) => {
    const {games, tree_type, cashprize, list_teams,account,classement} = (req.body && Object.keys(req.body).length > 0) ? req.body : req.query;
    const tournament = await TournamentsModel.create({
        games,
        tree_type,
        cashprize,
        list_teams,
        account,
        classement
    });
    res.status(200).json(tournament);
};

module.exports.addTeamsAtTournament = async(req,res) => {
    try {
        const userId = req.params.id
        const elementIdToAdd = req.body
        const updateTournament = await TournamentsModel.finByIdAndUpdate(
            userId,
            {
                $addToSet: {list_teams: elementIdToAdd}
            },
            {
                new: true,
                runValidators: true
            }
        );
        
        if(!updateTournament){
            return res.status(404).json({ message: "Le tournoi est introuvable." });
        }

        return res.status(200).json({
            message: "Teams ajouté avec succès !",
            data: updatedDocument
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
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

