const MatchesModel = require('../models/matches.model');
const TournamentsModel = require('../models/tournaments.model');

// Les fonctions utilisés 
const shuffleArray = (array) => {
    // On crée une copie du tableau pour ne pas casser la donnée d'origine
    const shuffled = [...array]; 
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        // On échange la position de deux éléments
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; 
    }
    return shuffled;
};

// Les controllers GET

module.exports.getTournaments = async(req,res) =>{
    const tournaments = await TournamentsModel.find();
    res.status(200).json(tournaments);
};
module.exports.getTournamentByAccount  = async(req,res) =>{
    const accountId = req.params.accountId;
    const tournaments = await TournamentsModel.find({account: accountId});
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
        const updateTournament = await TournamentsModel.findByIdAndUpdate(
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
            message: "Teams ajouté dans le tournoi avec succès !",
            data: updateTournament
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};
// Permet de start le tournoi en fonction de son type.
module.exports.startTournament = async (req, res) => {
    try {
        const tournamentId = req.params.id;

        const tournament = await TournamentsModel.findById(tournamentId);

        if (!tournament) {
            return res.status(404).json({ message: "Tournoi introuvable." });
        }

        
        if (tournament.statut === "en_cours" || tournament.statut === "fini") {
            return res.status(400).json({ message: "Le tournoi a déjà été lancé ou est terminé." });
        }

        // 1. On vérifie s'il y a des équipes inscrites
        if (!tournament.list_teams || tournament.list_teams.length === 0) {
            return res.status(400).json({ message: "Impossible de lancer un tournoi sans équipes." });
        }

        // 2. On mélange aléatoirement les équipes
        const randomTeams = shuffleArray(tournament.list_teams);

        // 3. On récupère le type d'arbre
        const typeArbre = tournament.tree_type;

        let totalMatchesCreated = 0;
        let createdMatchesResult = [];

        // Trois types différents 
        switch (typeArbre) {
            case "elimination": // Simple elimination 
                const matchesToCreate = [];
                let matchIndex = 1; 
                for (let i = 0; i < randomTeams.length; i += 2) {
                    const teamA = randomTeams[i];
                    const teamB = randomTeams[i + 1]; 

                    const newMatch = {
                        tournament: tournamentId,
                        round: 1,                 
                        matchNumber: matchIndex   
                    };

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
                break; // On utilise break au lieu de return pour pouvoir mettre à jour le statut ensuite

            case "championnat": // Type championnat , ligue etc... 
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

            case "suisse": // Round - Suisse. 
                const swissMatches = [];
                let swissMatchIndex = 1;
                for (let i = 0; i < randomTeams.length; i += 2) {
                    const teamA = randomTeams[i];
                    const teamB = randomTeams[i + 1];

                    const newMatch = {
                        tournament: tournamentId,
                        round: 1, 
                        matchNumber: swissMatchIndex
                    };

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
                return res.status(400).json({ message: "Type d'arbre non reconnu : " + typeArbre });
        }

        // --- NOUVEAU : 2. Mise à jour du statut en base de données ---
        // On effectue cette mise à jour SEULEMENT si la création des matchs a réussi (pas de catch)
        await TournamentsModel.findByIdAndUpdate(tournamentId, {
            $set: { statut: "en_cours" } // Assure-toi que cette string correspond à ce que tu attends
        });

        // 4. On renvoie la réponse de succès
        return res.status(200).json({
            message: `Tournoi au format ${typeArbre} généré et démarré avec succès !`,
            statut: "en_cours",
            totalMatchesCreated: totalMatchesCreated,
            matches: createdMatchesResult 
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

// Permet de générer le prochian round 
module.exports.generateNextRound = async (req, res) => {
    try {
        const tournamentId = req.params.id;

        // On récupère TOUS les matchs du tournoi.
        const allMatches = await MatchesModel.find({ tournament: tournamentId })
                                           .sort({ round: -1, matchNumber: 1 });

        if (!allMatches || allMatches.length === 0) {
            return res.status(404).json({ message: "Aucun match trouvé pour ce tournoi. L'avez-vous démarré ?" });
        }

        // On isole les matchs du round ACTUEL 
        const currentRoundNumber = allMatches[0].round;
        const currentRoundMatches = allMatches.filter(m => m.round === currentRoundNumber);

        // VÉRIFICATION : Est-ce que tous les matchs de ce round sont terminés ?
        const unfinishedMatches = currentRoundMatches.filter(m => !m.winner);
        if (unfinishedMatches.length > 0) {
            return res.status(400).json({ 
                message: `Impossible de générer le tour suivant : il reste ${unfinishedMatches.length} match(s) non terminé(s) au round ${currentRoundNumber}.` 
            });
        }

        // On récupère les gagnants dans l'ordre de leurs matchs
        const winners = currentRoundMatches.map(m => m.winner);

        // VÉRIFICATION : Est-ce la fin du tournoi ?
        if (winners.length === 1) {
            return res.status(200).json({ 
                message: "Le tournoi est terminé !", 
                champion: winners[0] 
            });
        }

        // On génère les matchs du tour suivant
        const nextRoundMatchesToCreate = [];
        let matchIndex = 1;

        for (let i = 0; i < winners.length; i += 2) {
            const teamA = winners[i];
            const teamB = winners[i + 1];

            const newMatch = {
                tournament: tournamentId,
                round: currentRoundNumber + 1, 
                matchNumber: matchIndex
            };

            if (teamB) {
                
                newMatch.teams = [teamA, teamB];
            } else {
                
                newMatch.teams = [teamA];
                newMatch.winner = teamA; 
            }

            nextRoundMatchesToCreate.push(newMatch);
            matchIndex++;
        }

        // On sauvegarde le nouveau tour en base de données
        const createdMatches = await MatchesModel.insertMany(nextRoundMatchesToCreate);

        return res.status(200).json({
            message: `Round ${currentRoundNumber + 1} généré avec succès !`,
            matches: createdMatches
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

module.exports.cancelTournament = async (req,res) => {
    const idTournament = req.params.id;
    const cancelTournament = await MatchesModel.findById(idTournament);

    if(!cancelTournament){
        return res.status(500).json({ message: "Tournoi introuvable."});
    }

    const deletedMatches = await MatchesModel.deleteMany({ tournament: idTournament });

    return res.status(200).json({
        message: "Le tournoi a été réinitialisé avec succès. Tous les matchs ont été supprimés.",
        deletedCount: deletedMatches.deletedCount 
    });
};

// Les controllers Patch 

module.exports.changeStatutTournament = async (req,res) => {

};



// Les controllers Delete 
module.exports.deleteTournament = async(req,res) =>{
    try {

        // 1. Initialisation des variables
        const tournamentId = req.params.id;
        
        const deleteTournament = await TournamentsModel.findByIdAndDelete(tournamentId);

        if (!deleteTournament) {
            return res.status(404).json({ message: "Ce tournoi est introuvable ." });
        }

        // 2. LE NETTOYAGE : On supprime TOUS les matchs liés à ce tournoi
        const deletedMatches = await MatchesModel.deleteMany({ tournament: tournamentId });

        // 3. On n'oublie pas de renvoyer une réponse de succès !
        return res.status(200).json({ 
            message: "Le tournoi a été supprimé avec succès.",
            matchesDeleted: deletedMatches.deletedCount
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

module.exports.unsubscribeTeam = async(req,res) =>{
    try {

        const teamId = req.params.teamId;
        const idTournament = req.params.id;
        const tournament = await TournamentsModel.findById(idTournament);

        if (!tournament) {
            return res.status(404).json({ message: "Tournoi introuvable." });
        }
        if(!tournament.statut !== "en_preparation"){
            return res.status(500).json({message:"Ne peut pas enlever de team car le tournoi a déja commencé."})
        }
        if (!tournament.list_teams.includes(teamId)) {
            return res.status(400).json({ message: "Cette équipe n'est pas inscrite à ce tournoi." });
        }
      
        const updatedTournament = await TournamentsModel.findByIdAndUpdate(
            idTournament,
            { $pull: { list_teams: teamId } }, // $pull cherche l'ID dans le tableau et l'enlève
            { new: true } // Renvoie le document mis à jour
        );

        return res.status(200).json({ 
            message: "L'équipe a été désinscrite avec succès.",
            tournament: updatedTournament
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur serveur", error: error.message });       
    }
};

// Les controlers PUT

// module.exports.replaceAll = async(req,res) =>{
//     try {
        
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: "Erreur serveur", error: error.message });    
//     }
// };

// module.exports.validateListFinaleTournament = async(req,res) =>{
//     try {
        
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: "Erreur serveur", error: error.message });         
//     }
// };

