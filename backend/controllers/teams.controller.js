const TeamsModel = require('../models/teams.model');


// Les controllers GET 

module.exports.getTeams = async(req,res) =>{
    const teams = await TeamsModel.find();
    res.status(200).json(teams);
};

module.exports.getTeam = async(req,res) =>{
    const team = await TeamsModel.findById(req.params.id);
    if (!team) {
        return res.status(404).json({ message: "Tournoi non trouvé" });
    }
    res.status(200).json(team);
};

module.exports.getHistoricalMatches = async(req,res)=>{
    const team = await TeamsModel.findById(req.params.id);
    if (!team) {
        return res.status(404).json({ message: "Matches non trouvés" });
    }
    res.status(200).json(team.matches); 
};

module.exports.getCaptainTeam = async(req,res)=>{
    const team = await TeamsModel.findById(req.params.id);
    if (!team) {
        return res.status(404).json({ message: "Captaine non trouvé" });
    }
    res.status(200).json(team.captain); 
};

module.exports.getPlayerInTeam = async(req,res)=>{
    const team = await TeamsModel.findById(req.params.id);
    if (!team) {
        return res.status(404).json({ message: "Joueurs non trouvés" });
    }
    res.status(200).json(team.players); 
};


// Les controllers Set 

module.exports.createTeam = async(req,res) => {
    try {
        const {tournament, nom, acronyme, logo,captain,players,matches} = (req.body && Object.keys(req.body).length > 0) ? req.body : req.query;
        const team = await TeamsModel.create({
            tournament,
            nom,
            acronyme,
            logo,
            captain,
            players,
            matches
        });
        res.status(200).json(team);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

module.exports.addPlayerInTeam = async(req,res) => {
    try {
        const userId = req.params.id
        const elementIdToAdd = req.body
        const updateTeam = await TeamsModel.finByIdAndUpdate(
            userId,
            {
                $addToSet: {players: elementIdToAdd}
            },
            {
                new: true,
                runValidators: true
            }
        );
        
        if(!updateTeam){
            return res.status(404).json({ message: "La team est introuvable." });
        }

        return res.status(200).json({
            message: "Player ajouté dans la team avec succès !",
            data: updatedDocument
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

module.exports.addCaptainInTeam = async(req,res) => {
    try {
        const userId = req.params.id
        const elementIdToAdd = req.body
        const updateTeam = await TeamsModel.finByIdAndUpdate(
            userId,
            {
                $addToSet: {captain: elementIdToAdd}
            },
            {
                new: true,
                runValidators: true
            }
        );
        const existingCaptain = await TeamsModel.findOne({
            _id: userId, 
            captain: { $exists: true, $ne: null, $ne: "" }
        });
        if (existingCaptain) {
            return res.status(400).json({ 
                message: "Il existe déjà un capitaine dans votre équipe." 
            });
        }
        if(!updateTeam){
            return res.status(404).json({ message: "La team est introuvable." });
        }

        return res.status(200).json({
            message: "Un capitaine est ajouté dans la team avec succès !",
            data: updatedDocument
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};
