const MatchesModel = require('../models/matches.model');
const TournamentsModel = require('../models/tournaments.model');
const { deleteTeamLogic } = require('../services/team.service'); // Attention au chemin selon la structure de ton projet

// --- FONCTION UTILITAIRE ---
const shuffleArray = (array) => {
    const shuffled = [...array]; 
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; 
    }
    return shuffled;
};

// --- SERVICES ---

const getTournaments = async () => {
    return await TournamentsModel.find();
};

const getTournamentByAccount = async (accountId) => {
    return await TournamentsModel.find({ account: accountId });
};

const getTournamentById = async (id) => {
    return await TournamentsModel.findById(id);
};

const getBracket = async (id) => {
    const tournament = await TournamentsModel.findById(id);
    if (!tournament) throw { status: 404, message: "Tournoi non trouvé" };
    return tournament.tree_type;
};

const getTeamsRegister = async (id) => {
    const tournament = await TournamentsModel.findById(id).populate({
        path: 'list_teams',
        populate: {
            path: 'players'
        }
    });
    if (!tournament) throw { status: 404, message: "Tournoi non trouvé" };
    return tournament.list_teams;
};

const getRanking = async (id) => {
    const tournament = await TournamentsModel.findById(id);
    if (!tournament) throw { status: 404, message: "Tournoi non trouvé" };
    return tournament.classement;
};

const addTournament = async (data) => {
    return await TournamentsModel.create(data);
};

const addTeamsAtTournament = async (id, elementIdToAdd) => {
    const updateTournament = await TournamentsModel.findByIdAndUpdate(
        id,
        { $addToSet: { list_teams: elementIdToAdd } },
        { returnDocument: 'after', runValidators: true }
    );
    
    if (!updateTournament) {
        throw { status: 404, message: "Le tournoi est introuvable." };
    }
    return updateTournament;
};

const startTournament = async (tournamentId) => {
    const tournament = await TournamentsModel.findById(tournamentId);

    if (!tournament) {
        throw { status: 404, message: "Tournoi introuvable." };
    }

    if (tournament.statut === "en_cours" || tournament.statut === "fini") {
        throw { status: 400, message: "Le tournoi a déjà été lancé ou est terminé." };
    }

    if (!tournament.list_teams || tournament.list_teams.length <= 1) {
        throw { status: 400, message: "Impossible de lancer un tournoi sans équipes ou avec une seule équipe." };
    }

    const randomTeams = shuffleArray(tournament.list_teams);
    const typeArbre = tournament.tree_type;
    let totalMatchesCreated = 0;
    let createdMatchesResult = [];

    switch (typeArbre) {
        case "elimination":
            const matchesToCreate = [];
            let matchIndex = 1; 
            for (let i = 0; i < randomTeams.length; i += 2) {
                const teamA = randomTeams[i];
                const teamB = randomTeams[i + 1]; 
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
            createdMatchesResult = await MatchesModel.insertMany(matchesToCreate);
            totalMatchesCreated = createdMatchesResult.length;
            break;

        case "championnat":
            const championnatMatches = [];
            let champMatchIndex = 1;
            for (let i = 0; i < randomTeams.length; i++) {
                for (let j = i + 1; j < randomTeams.length; j++) {
                    const teamA = randomTeams[i];
                    const teamB = randomTeams[j];
                    championnatMatches.push({
                        tournament: tournamentId,
                        teams: [teamA, teamB],
                        round: 1,
                        matchNumber: champMatchIndex
                    });
                    champMatchIndex++;
                }
            }
            createdMatchesResult = await MatchesModel.insertMany(championnatMatches);
            totalMatchesCreated = createdMatchesResult.length;
            break;

        case "suisse":
            const swissMatches = [];
            let swissMatchIndex = 1;
            for (let i = 0; i < randomTeams.length; i += 2) {
                const teamA = randomTeams[i];
                const teamB = randomTeams[i + 1];
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
            createdMatchesResult = await MatchesModel.insertMany(swissMatches);
            totalMatchesCreated = createdMatchesResult.length;
            break;

        default:
            throw { status: 400, message: "Type d'arbre non reconnu : " + typeArbre };
    }

    await TournamentsModel.findByIdAndUpdate(tournamentId, {
        $set: { statut: "en_cours" }
    });

    return {
        message: `Tournoi au format ${typeArbre} généré et démarré avec succès !`,
        statut: "en_cours",
        totalMatchesCreated: totalMatchesCreated,
        matches: createdMatchesResult 
    };
};

const generateNextRound = async (tournamentId) => {
    const allMatches = await MatchesModel.find({ tournament: tournamentId })
                                       .sort({ round: -1, matchNumber: 1 });

    if (!allMatches || allMatches.length === 0) {
        throw { status: 404, message: "Aucun match trouvé pour ce tournoi. L'avez-vous démarré ?" };
    }

    const currentRoundNumber = allMatches[0].round;
    const currentRoundMatches = allMatches.filter(m => m.round === currentRoundNumber);

    const unfinishedMatches = currentRoundMatches.filter(m => !m.winner);
    if (unfinishedMatches.length > 0) {
        throw { status: 400, message: `Impossible de générer le tour suivant : il reste ${unfinishedMatches.length} match(s) non terminé(s) au round ${currentRoundNumber}.` };
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
    if (!tournament) {
        throw { status: 404, message: "Tournoi introuvable." };
    }

    const deletedMatches = await MatchesModel.deleteMany({ tournament: idTournament });
    tournament.statut = 'en_attente';
    await tournament.save();

    return { deletedCount: deletedMatches.deletedCount, tournament };
};

const deleteTournament = async (tournamentId) => {
    const deleteTournament = await TournamentsModel.findByIdAndDelete(tournamentId);
    if (!deleteTournament) {
        throw { status: 404, message: "Ce tournoi est introuvable." };
    }

    const deletedMatches = await MatchesModel.deleteMany({ tournament: tournamentId });
    return { matchesDeleted: deletedMatches.deletedCount };
};

const deleteAllTeamInTournament = async (tournamentId) => {
    const tournament = await TournamentsModel.findById(tournamentId);
    if (!tournament) {
        throw { status: 404, message: "Tournoi introuvable." };
    }

    if (!tournament.list_teams || tournament.list_teams.length === 0) {
        throw { status: 400, message: "Il n'y a aucune équipe à supprimer dans ce tournoi." };
    }

    const deletePromises = tournament.list_teams.map(teamId => deleteTeamLogic(teamId));
    await Promise.all(deletePromises);
    
    return true; // Succès
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