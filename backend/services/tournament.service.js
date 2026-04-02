const MatchesModel = require('../models/matches.model');
const TournamentsModel = require('../models/tournaments.model');
const AppError = require('../utils/appError');
const { deleteTeamLogic } = require('../services/team.service'); 

// --- FONCTIONS UTILITAIRES ---

const shuffleArray = (array) => {
    const shuffled = [...array]; 
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; 
    }
    return shuffled;
};



const generateEliminationMatches = (teams, tournamentId) => {
    const matchesToCreate = [];
    let matchIndex = 1; 
    for (let i = 0; i < teams.length; i += 2) {
        const teamA = teams[i];
        const teamB = teams[i + 1]; 
        const newMatch = { tournament: tournamentId, round: 1, matchNumber: matchIndex };
        if (teamB) {
            newMatch.teams = [teamA, teamB];
        } else {
            newMatch.teams = [teamA];
            newMatch.winner = teamA;
        }
        matchesToCreate.push(newMatch);
        matchIndex++;
    }
    return matchesToCreate;
};

const generateChampionnatMatches = (teams, tournamentId) => {
    const championnatMatches = [];
    let champMatchIndex = 1;
    for (let i = 0; i < teams.length; i++) {
        for (let j = i + 1; j < teams.length; j++) {
            championnatMatches.push({
                tournament: tournamentId,
                teams: [teams[i], teams[j]],
                round: 1,
                matchNumber: champMatchIndex
            });
            champMatchIndex++;
        }
    }
    return championnatMatches;
};

const generateSuisseMatches = (teams, tournamentId) => {
    const swissMatches = [];
    let swissMatchIndex = 1;
    for (let i = 0; i < teams.length; i += 2) {
        const teamA = teams[i];
        const teamB = teams[i + 1];
        const newMatch = { tournament: tournamentId, round: 1, matchNumber: swissMatchIndex };
        if (teamB) {
            newMatch.teams = [teamA, teamB];
        } else {
            newMatch.teams = [teamA];
            newMatch.winner = teamA; 
        }
        swissMatches.push(newMatch);
        swissMatchIndex++;
    }
    return swissMatches;
};


// --- SERVICES ---

const getTournaments = async () => {
    return await TournamentsModel.find();
};

const getTournamentByAccount = async (accountId) => {
    return await TournamentsModel.find({ account: accountId });
};

const getTournamentById = async (id) => {
    const tournament = await TournamentsModel.findById(id);
    if (!tournament) throw new AppError("Tournoi introuvable", 404); 
    return tournament;
};

const getBracket = async (id) => {
    const tournament = await TournamentsModel.findById(id);
    if (!tournament) throw new AppError("Tournoi introuvable", 404);
    return tournament.tree_type;
};

const getTeamsRegister = async (id) => {
    const tournament = await TournamentsModel.findById(id).populate({
        path: 'list_teams', populate: { path: 'players' }
    });
    if (!tournament) throw new AppError("Tournoi introuvable", 404);
    return tournament.list_teams;
};

const getRanking = async (id) => {
    const tournament = await TournamentsModel.findById(id);
    if (!tournament) throw new AppError("Tournoi introuvable", 404);
    return tournament.classement;
};

const addTournament = async (data) => {
    if (!data || Object.keys(data).length === 0) {
        throw new AppError("Veuillez fournir les données du tournoi", 400); 
    }
    return await TournamentsModel.create(data);
};

const addTeamsAtTournament = async (id, elementIdToAdd) => {
    const updateTournament = await TournamentsModel.findByIdAndUpdate(
        id,
        { $addToSet: { list_teams: elementIdToAdd } },
        { returnDocument: 'after', runValidators: true }
    );
    
    if (!updateTournament) throw new AppError("Tournoi introuvable", 404);
    
    return updateTournament;
};


const startTournament = async (tournamentId) => {
    const tournament = await TournamentsModel.findById(tournamentId);

    if (!tournament) throw new AppError("Tournoi introuvable", 404);

    if (tournament.statut === "en_cours" || tournament.statut === "fini") {
        throw new AppError("Le tournoi a déjà été lancé ou est terminé.", 400);
    }

    if (!tournament.list_teams || tournament.list_teams.length <= 1) {
        throw new AppError("Impossible de lancer un tournoi sans équipes ou avec une seule équipe.", 400);
    }

    const randomTeams = shuffleArray(tournament.list_teams);
    const typeArbre = tournament.tree_type;
    let matchesToCreate = [];

    // Le switch ne fait plus que distribuer le travail aux fonctions utilitaires
    switch (typeArbre) {
        case "elimination":
            matchesToCreate = generateEliminationMatches(randomTeams, tournamentId);
            break;
        case "championnat":
            matchesToCreate = generateChampionnatMatches(randomTeams, tournamentId);
            break;
        case "suisse":
            matchesToCreate = generateSuisseMatches(randomTeams, tournamentId);
            break;
        default:
            throw new AppError("Type d'arbre non reconnu : " + typeArbre, 400);
    }

    const createdMatchesResult = await MatchesModel.insertMany(matchesToCreate);

    await TournamentsModel.findByIdAndUpdate(tournamentId, {
        $set: { statut: "en_cours" }
    });

    return {
        message: `Tournoi au format ${typeArbre} généré et démarré avec succès !`,
        statut: "en_cours",
        totalMatchesCreated: createdMatchesResult.length,
        matches: createdMatchesResult 
    };
};

const generateNextRound = async (tournamentId) => {
    const allMatches = await MatchesModel.find({ tournament: tournamentId })
                                       .sort({ round: -1, matchNumber: 1 });

    if (!allMatches || allMatches.length === 0) {
        throw new AppError("Aucun match trouvé pour ce tournoi. L'avez-vous démarré ?", 404);
    }

    const currentRoundNumber = allMatches[0].round;
    const currentRoundMatches = allMatches.filter(m => m.round === currentRoundNumber);

    const unfinishedMatches = currentRoundMatches.filter(m => !m.winner);
    if (unfinishedMatches.length > 0) {
        throw new AppError(`Impossible de générer le tour suivant : il reste ${unfinishedMatches.length} match(s) non terminé(s) au round ${currentRoundNumber}.`, 400); 
    }

    const winners = currentRoundMatches.map(m => m.winner);

    if (winners.length === 1) {
        const finishedTournament = await TournamentsModel.findByIdAndUpdate(
            tournamentId, 
            { $set: { statut: "fini" } },
            { new: true }
        );
        return { 
            isFinished: true,
            message: "Le tournoi est terminé !", 
            champion: winners[0],
            tournament: finishedTournament
        };
    }

    const nextRoundMatchesToCreate = [];
    let matchIndex = 1;

    for (let i = 0; i < winners.length; i += 2) {
        const teamA = winners[i];
        const teamB = winners[i + 1];
        const newMatch = { tournament: tournamentId, round: currentRoundNumber + 1, matchNumber: matchIndex };
        if (teamB) {
            newMatch.teams = [teamA, teamB];
        } else {
            newMatch.teams = [teamA];
            newMatch.winner = teamA; 
        }
        nextRoundMatchesToCreate.push(newMatch);
        matchIndex++;
    }

    const createdMatches = await MatchesModel.insertMany(nextRoundMatchesToCreate);
    return {
        isFinished: false,
        message: `Round ${currentRoundNumber + 1} généré avec succès !`,
        matches: createdMatches
    };
};

const cancelTournament = async (idTournament) => {
    const tournament = await TournamentsModel.findById(idTournament);
    if (!tournament) throw new AppError("Tournoi introuvable.", 404);

    const deletedMatches = await MatchesModel.deleteMany({ tournament: idTournament });
    tournament.statut = 'en_attente';
    await tournament.save();

    return { deletedCount: deletedMatches.deletedCount, tournament };
};

const deleteTournament = async (tournamentId) => {
    const deleteTournament = await TournamentsModel.findByIdAndDelete(tournamentId);
    if (!deleteTournament) throw new AppError("Tournoi introuvable.", 404);

    const deletedMatches = await MatchesModel.deleteMany({ tournament: tournamentId });
    return { matchesDeleted: deletedMatches.deletedCount };
};

const deleteAllTeamInTournament = async (tournamentId) => {
    const tournament = await TournamentsModel.findById(tournamentId);
    if (!tournament) throw new AppError("Tournoi introuvable.", 404);

    if (!tournament.list_teams || tournament.list_teams.length === 0) {
        throw new AppError("Il n'y a aucune équipe à supprimer dans ce tournoi.", 400);
    }

    const deletePromises = tournament.list_teams.map(teamId => deleteTeamLogic(teamId));
    await Promise.all(deletePromises);
    
    return true; 
};

module.exports = {
    getTournaments,
    getTournamentByAccount,
    getTournamentById,
    getBracket,
    getTeamsRegister,
    getRanking,
    addTournament,
    addTeamsAtTournament,
    startTournament,
    generateNextRound,
    cancelTournament,
    deleteTournament,
    deleteAllTeamInTournament
};