import { useState, useEffect, useMemo } from 'react';
import { deleteTournament, getTeamsRegister, getTournamentById, startTournament, generateNextRound } from '../services/tournaments';
import { deleteTeam } from '../services/teams';
import { getMatchesInTournaments } from '../services/matches';
import { useParams } from 'react-router-dom';
import { Link , useNavigate } from 'react-router-dom';
import ButtonPrimary from '../components/ui/Button_Primary';
import '../assets/css/index.css';
import ButtonYes from '../components/ui/Button_Yes';
import ButtonDanger from "../components/ui/Button_Danger";
import Bracket from '../components/tournaments/Bracket';
export default function TournamentDetail() {

    const { id } = useParams(); 

    const navigate = useNavigate(); 
    const [tournament, setTournament] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [message, setMessage] = useState({ type: '', content: '' });
    const [matches , setMatches] = useState([]);
    const [isRoundFinished, setIsRoundFinished] = useState(false);
    const [isTournamentFinished, setIsTournamentFinished] = useState(false);
    const handleRemoveTeam = async (teamIdToRemove) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette équipe ? Cette action est irréversible et supprimera aussi tous ses joueurs.")) {
            return;
        }
        try {
            await deleteTeam(teamIdToRemove);
            setParticipants(currentParticipants =>
                currentParticipants.filter(participant => participant._id !== teamIdToRemove)
            );
            setMessage({ type: 'success', content: 'Équipe supprimée avec succès.' });
        } catch (error) {
            setMessage({ type: 'error', content: error.message || "Erreur lors de la suppression de l'équipe." });
        }
    };
    const handleRemoveTournament = async () => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce tournoi ? Cette action est irréversible et supprimera le tournoi.")) {
            return;
        }
        try {



            await deleteTournament(id);
            // Le message ne sera pas visible car la redirection est immédiate,
            // mais on peut le laisser si vous implémentez un système de notifications globales (toasts).
            setMessage({ type: 'success', content: 'Tournoi supprimé avec succès.' });
            navigate('/tournaments');
        } catch (error) {
            setMessage({ type: 'error', content: error.message || "Erreur lors de la suppression du tournoi." });
        }
    };

    const handleStartTournament = async() => {
        if(!window.confirm("Êtes-vous sûr de vouloir commencer ce tournoi ? Cette action générera les matchs du premier tour.")){
            return;
        }
        try {
            await startTournament(id);
            setMessage({ type: 'success', content: 'Le tournoi a bien démarré !' });
            // On recharge les données pour afficher le bracket
            const updatedTournament = await getTournamentById(id);
            setTournament(updatedTournament);
            const matchesData = await getMatchesInTournaments(id);
            setMatches(matchesData);
        } catch (error) {
            setMessage({ type: 'error', content: error.message || "Erreur lors du démarrage du tournoi." });
        }
    };
    const checkRoundStatus = (currentMatches) => {
        if (!currentMatches || currentMatches.length === 0) {
            setIsRoundFinished(false);
            setIsTournamentFinished(false);
            return;
        }
    
        // On trouve le numéro du round le plus élevé
        const maxRound = Math.max(...currentMatches.map(m => m.round));
        // On ne garde que les matchs de ce round
        const lastRoundMatches = currentMatches.filter(m => m.round === maxRound);
    
        if (lastRoundMatches.length === 0) return;
    
        // On vérifie si tous les matchs de ce round sont terminés (ont un gagnant)
        const allMatchesInRoundFinished = lastRoundMatches.every(m => m.winner);
    
        // Le tournoi est-il terminé ? (Un seul match dans le dernier round, et il est fini)
        const isFinal = lastRoundMatches.length === 1 && allMatchesInRoundFinished;
        
        setIsTournamentFinished(isFinal);
        // On affiche le bouton pour passer à l'étape suivante (nouveau round ou fin) dès que tous les matchs du round actuel sont joués.
        setIsRoundFinished(allMatchesInRoundFinished);
    };

    const handleScoreUpdate = async () => {
        try {
            const matchesData = await getMatchesInTournaments(id);
            setMatches(matchesData);
            checkRoundStatus(matchesData); // On vérifie le statut après la mise à jour
        } catch (error) {
            setMessage({ type: 'error', content: "Erreur lors du rafraîchissement des matchs." });
        }
    };

    const handleGenerateNextRound = async () => {
        if (!window.confirm("Êtes-vous sûr de vouloir générer le tour suivant ?")) {
            return;
        }
        try {
            const result = await generateNextRound(id);
            setMessage({ type: 'success', content: result.message });
            // Si le tournoi est terminé, on met à jour le statut du tournoi
            if (result.tournament && result.tournament.statut === 'fini') {
                setTournament(result.tournament);
            }
            // On rafraîchit la liste des matchs pour afficher le nouveau round
            await handleScoreUpdate();
        } catch (error) {
            setMessage({ type: 'error', content: error.message || "Erreur lors de la génération du tour suivant." });
        }
    };

    useEffect(() => {
        const loadTournamentAndData = async () => {
            const tournamentData = await getTournamentById(id); 
            setTournament(tournamentData);

            if (tournamentData?.statut === 'en attente') {
                setIsRoundFinished(false);
                setIsTournamentFinished(false);
                const teams = await getTeamsRegister(id);
                setParticipants(teams);
            } else if (tournamentData?.statut === 'en_cours' || tournamentData?.statut === 'fini') {
                const matchesData = await getMatchesInTournaments(id);
                setMatches(matchesData);
                if (tournamentData.statut === 'en_cours') {
                    checkRoundStatus(matchesData);
                } else {
                    setIsTournamentFinished(true);
                    setIsRoundFinished(false);
                }
            }
        };
        loadTournamentAndData();
    }, [id]); 

    const winner = useMemo(() => {
        if (tournament?.statut !== 'fini' || !matches || matches.length === 0) {
            return null;
        }
        const maxRound = Math.max(...matches.map(m => m.round));
        const finalMatch = matches.find(m => m.round === maxRound);
        return finalMatch?.winner;
    }, [tournament, matches]);


    if (!tournament) {
        return <div className="page-container"><p>⏳ Chargement des détails...</p></div>;
    }
  return (
    <div className="page-container">
      
        <div className="detail-header-card">
            <div>
                <h1 style={{margin: 0, color: 'var(--accent-color)'}}>{tournament.title}</h1>
                <p style={{color: 'var(--text-muted)'}}>Jeu : {tournament.games}</p>
                <p style={{color: 'var(--text-muted)'}}>Cashprize : {tournament.cashprize}</p>
                <p style={{color: 'var(--text-muted)'}}>Format : {tournament.tree_type}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {tournament.statut === 'en attente' && (
                    <ButtonYes onClick={handleStartTournament}>Commencer le tournoi</ButtonYes>
                )}
                {isRoundFinished && tournament.statut === 'en_cours' && (
                    <ButtonYes onClick={handleGenerateNextRound}>
                        {isTournamentFinished ? '🏆 Terminer le tournoi' : 'Générer le tour suivant'}
                    </ButtonYes>
                )}
                <ButtonDanger onClick={handleRemoveTournament}>Suprimer le tournoi</ButtonDanger>
            </div>
        </div>

        {message.content && (
            <div className={`message ${message.type === 'error' ? 'message-error' : 'message-success'}`} style={{ marginTop: '20px' }}>
                {message.content}
            </div>
        )}
        {tournament.statut === "en attente" ? (
            // Afficher l'ajout d'équipe 
            <div className="detail-main-card">
            {participants.length === 0 ? (
                <p>Aucun participant pour le moment.</p>
            ) : (
                <>
                    <h1 style={{margin: 0, color: 'var(--accent-color)'}}>Liste des Teams</h1>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {participants.map((participant) => (
                            <div key={participant._id} className="team-card">
                                <div className="team-info">
                                    <h3 style={{ margin: '0 0 10px 0', color: 'var(--accent-color)' }}>{participant.nom} [{participant.acronyme}]</h3>
                                    <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                                        {participant.players && participant.players.map(player => (
                                            <li key={player._id} style={{ padding: '8px 0', borderBottom: '1px solid var(--border-color)', color: 'var(--text-main)' }}>
                                                <strong>{player.pseudo}</strong> {participant.captain === player._id ? '👑' : ''}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="team-actions">
                                    <Link to={`/tournaments/${id}/edit-team/${participant._id}`} className="btn-primary" style={{ textDecoration: 'none', textAlign: 'center', fontSize: '0.9rem', padding: '8px 12px' }}>
                                        Modifier l'équipe
                                    </Link>
                                    <ButtonDanger type="submit" onClick={() => handleRemoveTeam(participant._id)}>
                                        Supprimer l'équipe
                                    </ButtonDanger>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
                )}
                <Link to={`/tournaments/${id}/add-team`} className="btn-yes" style={{ textDecoration: 'none' , alignSelf: 'flex-start' }}>
                + Ajouter une équipe
                </Link>
            </div>

        ) : (
            <>
                {tournament.statut === "fini" && (
                    <div className="message message-success" style={{ marginBottom: '20px' }}>
                        🏆 Tournoi terminé - Vainqueur : {winner?.nom}
                    </div>
                )}
                <Bracket matches={matches} onScoreUpdated={handleScoreUpdate} />
            </>
        )}
    </div>
  );
}