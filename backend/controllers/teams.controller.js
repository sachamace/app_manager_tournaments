const asyncHandler = require('express-async-handler');
const { 
    getTeamsLogic,
    getTeamLogic,
    getHistoricalMatchesLogic,
    getCaptainTeamLogic,
    getPlayerInTeamLogic,
    addPlayerInTeamLogic,
    deleteTeamLogic, 
    createTeamLogic, 
    addCaptainInTeamLogic
} = require('../services/team.service');

// Les controllers GET 

module.exports.getTeams = asyncHandler(async (req, res) => {
    const teams = await getTeamsLogic();
    res.status(200).json(teams);
});

module.exports.getTeam = asyncHandler(async (req, res) => {
    const team = await getTeamLogic(req.params.id);
    if (!team) {
        return res.status(404).json({ message: "Équipe non trouvée" });
    }
    res.status(200).json(team);
});

module.exports.getHistoricalMatches = asyncHandler(async (req, res) => {
    const matches = await getHistoricalMatchesLogic(req.params.id);
    if (!matches) {
        return res.status(404).json({ message: "Équipe ou matches non trouvés" });
    }
    res.status(200).json(matches); 
});

module.exports.getCaptainTeam = asyncHandler(async (req, res) => {
    const captain = await getCaptainTeamLogic(req.params.id);
    if (!captain) {
        return res.status(404).json({ message: "Équipe ou capitaine non trouvé" });
    }
    res.status(200).json(captain); 
});

module.exports.getPlayerInTeam = asyncHandler(async (req, res) => {
    const players = await getPlayerInTeamLogic(req.params.id);
    if (!players) {
        return res.status(404).json({ message: "Équipe ou joueurs non trouvés" });
    }
    res.status(200).json(players); 
});


// Les controllers Set 

module.exports.createTeam = asyncHandler(async(req,res) => {
    const teamData = (req.body && Object.keys(req.body).length > 0) ? req.body : req.query;
    
    const team = await createTeamLogic(teamData);

    res.status(201).json(team);
});

module.exports.addPlayerInTeam = asyncHandler(async (req, res) => {
    const teamId = req.params.id;
    const elementIdToAdd = req.body;
    const updatedTeam = await addPlayerInTeamLogic(teamId, elementIdToAdd);

    if (!updatedTeam) {
        return res.status(404).json({ message: "La team est introuvable." });
    }

    return res.status(200).json({
        message: "Joueur ajouté dans la team avec succès !",
        data: updatedTeam 
    });

});

module.exports.addCaptainInTeam = asyncHandler(async(req,res) => {
    const userId = req.params.id
    const elementIdToAdd = req.body

    const updatedTeam = await addCaptainInTeamLogic(userId,elementIdToAdd);

    return res.status(200).json({
        message: "Un capitaine est ajouté dans la team avec succès !",
        data: updatedTeam 
    });
});


// Patch 
module.exports.updateTeam = asyncHandler(async (req, res) => {
    const teamId = req.params.id;
    const updateData = (req.body && Object.keys(req.body).length > 0) ? req.body : req.query;

    const updatedTeam = await updateTeamLogic(teamId, updateData);

    if (!updatedTeam) {
        return res.status(404).json({ message: "Équipe non trouvée." });
    }

    return res.status(200).json(updatedTeam);
});

// DELETE 

module.exports.deleteTeam = asyncHandler(async (req,res) => {
    const teamId = req.params.id;

    // On appelle notre service neutre
    const result = await deleteTeamLogic(teamId);
    
    if (!result) {
        return res.status(404).json({ message: "Cette team est introuvable." });
    }
    
    return res.status(200).json({ 
        message: "L'équipe a été supprimée avec succès.",
        playersDelete: result.deletedPlayersCount
    });
});