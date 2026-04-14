import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { deleteTournament, getTeamsRegister, getTournamentById, startTournament, generateNextRound } from '../services/tournaments';
import { deleteTeam } from '../services/teams';
import { getMatchesInTournaments } from '../services/matches';
import '../assets/css/index.css';

export default function Tournament() {
    const { id } = useParams(); 
    const navigate = useNavigate(); 
    
    // -- ÉTATS --
    const [tournament, setTournament] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [matches, setMatches] = useState([]);
    const [message, setMessage] = useState({ type: '', content: '' });
    const [isRoundFinished, setIsRoundFinished] = useState(false);
    const [isTournamentFinished, setIsTournamentFinished] = useState(false);

    // -- CHARGEMENT DES DONNÉES --
    useEffect(() => {
        const loadTournamentAndData = async () => {
            try {
                const tournamentData = await getTournamentById(id); 
                setTournament(tournamentData);

                if (tournamentData?.statut === 'en_attente') {
                    setIsRoundFinished(false);
                    setIsTournamentFinished(false);
                    const teams = await getTeamsRegister(id);
                    setParticipants(teams || []);
                } else if (tournamentData?.statut === 'en_cours' || tournamentData?.statut === 'fini') {
                    const matchesData = await getMatchesInTournaments(id);
                    setMatches(matchesData || []);
                    
                    if (tournamentData.statut === 'en_cours') {
                        checkRoundStatus(matchesData);
                    } else {
                        setIsTournamentFinished(true);
                        setIsRoundFinished(false);
                    }
                }
            } catch (error) {
                setMessage({ type: 'error', content: "Erreur lors du chargement du tournoi." });
            }
        };
        loadTournamentAndData();
    }, [id]); 

    // Vérifie si tous les matchs du tour actuel sont terminés
    const checkRoundStatus = (matchesData) => {
        if (!matchesData || matchesData.length === 0) return;
        const currentRound = Math.max(...matchesData.map(m => m.round));
        const currentRoundMatches = matchesData.filter(m => m.round === currentRound);
        const allFinished = currentRoundMatches.every(m => m.statut === 'fini');
        setIsRoundFinished(allFinished);
    };

    // Calcul du vainqueur
    const winner = useMemo(() => {
        if (tournament?.statut !== 'fini' || !matches || matches.length === 0) return null;
        const maxRound = Math.max(...matches.map(m => m.round));
        const finalMatch = matches.find(m => m.round === maxRound);
        return finalMatch?.winner;
    }, [tournament, matches]);

    // -- ACTIONS D'ADMINISTRATION --
    const handleRemoveTeam = async (teamIdToRemove) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette équipe ? Cette action est irréversible.")) return;
        try {
            await deleteTeam(teamIdToRemove);
            setParticipants(current => current.filter(p => p._id !== teamIdToRemove));
            setMessage({ type: 'success', content: 'Équipe supprimée.' });
        } catch (error) {
            setMessage({ type: 'error', content: "Erreur lors de la suppression de l'équipe." });
        }
    };

    const handleDeleteTournament = async () => {
        if (!window.confirm("Voulez-vous vraiment supprimer ce tournoi ?")) return;
        try {
            await deleteTournament(id);
            navigate('/tournaments');
        } catch (error) {
            setMessage({ type: 'error', content: "Erreur lors de la suppression du tournoi." });
        }
    };

    const handleStartTournament = async () => {
        try {
            await startTournament(id);
            window.location.reload(); // Recharge pour afficher les matchs
        } catch (error) {
            setMessage({ type: 'error', content: error.message || "Erreur lors du lancement." });
        }
    };

    const handleNextRound = async () => {
        try {
            await generateNextRound(id);
            window.location.reload();
        } catch (error) {
            setMessage({ type: 'error', content: error.message || "Erreur lors de la génération." });
        }
    };

    // -- REGROUPEMENT DES MATCHS PAR TOUR (ROUND) --
    const matchesByRound = matches.reduce((acc, match) => {
        if (!acc[match.round]) acc[match.round] = [];
        acc[match.round].push(match);
        return acc;
    }, {});


    // -- RENDU --
    if (!tournament) {
        return <div style={{ padding: 'var(--spacing-lg)' }}>Chargement des détails...</div>;
    }

    return (
        <div style={{ padding: 'var(--spacing-lg)' }}>
            
            {/* -- ALERTE GLOBALE -- */}
            {message.content && (
                <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'}`}>
                    {message.content}
                </div>
            )}

            {/* -- EN-TÊTE DU TOURNOI -- */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-lg)', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <h1 style={{ margin: 0, fontFamily: 'var(--font-heading)' }}>{tournament.name}</h1>
                        <span className={`badge ${
                            tournament.statut === 'en_cours' ? 'badge-success' : 
                            tournament.statut === 'en_attente' ? 'badge-accent' : ''
                        }`}>
                            {tournament.statut === 'en_attente' ? 'En attente' : tournament.statut === 'en_cours' ? 'En cours' : 'Terminé'}
                        </span>
                    </div>
                    <p className="text-label" style={{ fontSize: '14px' }}>
                        {tournament.game} • {tournament.maxTeams} équipes max
                    </p>
                </div>
                
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Link to="/tournaments" className="btn btn-secondary">Retour</Link>
                    {tournament.statut === 'en_attente' && (
                        <button onClick={handleStartTournament} className="btn btn-primary">
                            Démarrer le tournoi
                        </button>
                    )}
                    <button onClick={handleDeleteTournament} className="btn" style={{ backgroundColor: 'var(--color-error)', color: 'white' }}>
                        Supprimer
                    </button>
                </div>
            </div>


            {/* =========================================================
                AFFICHAGE CONDITIONNEL : EN ATTENTE vs EN COURS/FINI
            ========================================================= */}

            {tournament.statut === 'en_attente' ? (
                
                /* --- ÉTAT 1 : EN ATTENTE (Inscription des équipes) --- */
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 'var(--spacing-lg)' }}>
                    
                    {/* Colonne Gauche : Infos */}
                    <div className="card" style={{ height: 'fit-content' }}>
                        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Détails de l'événement</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div>
                                <span className="text-label">Format</span>
                                <div className="text-body" style={{ fontWeight: 500 }}>{tournament.format || 'Non spécifié'}</div>
                            </div>
                            <div>
                                <span className="text-label">Date de début</span>
                                <div className="text-body" style={{ fontWeight: 500 }}>{tournament.date || 'À définir'}</div>
                            </div>
                            {tournament.description && (
                                <div>
                                    <span className="text-label">Description</span>
                                    <div className="text-body">{tournament.description}</div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Colonne Droite : Équipes */}
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>
                                Équipes inscrites ({participants.length}/{tournament.maxTeams})
                            </h2>
                            <Link to={`/tournament/${id}/add-team`} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '13px' }}>
                                + Ajouter
                            </Link>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {participants.length > 0 ? (
                                participants.map(team => (
                                    <div key={team._id} style={{ 
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                                        padding: '12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' 
                                    }}>
                                        <span className="text-body" style={{ fontWeight: 500 }}>{team.name}</span>
                                        <button 
                                            onClick={() => handleRemoveTeam(team._id)}
                                            style={{ background: 'none', border: 'none', color: 'var(--color-error)', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}
                                        >
                                            Retirer
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-label" style={{ textAlign: 'center', padding: '2rem 0' }}>Aucune équipe inscrite pour le moment.</p>
                            )}
                        </div>
                    </div>

                </div>

            ) : (

                /* --- ÉTAT 2 : EN COURS ou FINI (Brackets & Matchs) --- */
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Arbre des matchs</h2>
                        
                        {/* Bouton pour générer le tour suivant si tous les matchs du tour en cours sont finis */}
                        {isRoundFinished && !isTournamentFinished && (
                            <button onClick={handleNextRound} className="btn btn-primary">
                                Générer le tour suivant
                            </button>
                        )}
                    </div>

                    {/* Si le tournoi est fini, on affiche le grand gagnant */}
                    {isTournamentFinished && (
                        <div className="alert alert-success" style={{ textAlign: 'center', fontSize: '1.1rem', padding: '1.5rem', marginBottom: '2rem' }}>
                            🏆 <strong>Vainqueur du tournoi :</strong> {winner || 'Équipe Inconnue'}
                        </div>
                    )}

                    {/* Affichage des matchs groupés par tour (Round 1, Round 2...) */}
                    {Object.keys(matchesByRound).map(round => (
                        <div key={round} style={{ marginBottom: '2rem' }}>
                            <h3 className="text-label" style={{ marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
                                TOUR {round}
                            </h3>
                            
                            {/* Grille des matchs pour ce tour */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--spacing-md)' }}>
                                {matchesByRound[round].map(match => (
                                    <div key={match._id} className="card-interactive" style={{ 
                                        border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', 
                                        padding: 'var(--spacing-md)', backgroundColor: 'var(--color-background)' 
                                    }}>
                                        {/* Équipe 1 */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontWeight: match.winner === match.team1?._id ? 600 : 400, color: match.winner === match.team1?._id ? 'var(--color-primary)' : 'inherit' }}>
                                            <span>{match.team1?.name || 'TBD'}</span>
                                            <span>{match.score1 ?? '-'}</span>
                                        </div>
                                        
                                        {/* Séparateur */}
                                        <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '8px 0' }} />
                                        
                                        {/* Équipe 2 */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: match.winner === match.team2?._id ? 600 : 400, color: match.winner === match.team2?._id ? 'var(--color-primary)' : 'inherit' }}>
                                            <span>{match.team2?.name || 'TBD'}</span>
                                            <span>{match.score2 ?? '-'}</span>
                                        </div>

                                        {/* Actions du match (ex: Modifier le score) */}
                                        <div style={{ marginTop: '12px', textAlign: 'right' }}>
                                            {match.statut === 'fini' ? (
                                                <span className="badge badge-success">Terminé</span>
                                            ) : (
                                                <Link to={`/matches/${match._id}`} style={{ fontSize: '12px', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 500 }}>
                                                    Saisir le score
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {matches.length === 0 && (
                        <p className="text-label" style={{ textAlign: 'center' }}>Aucun match n'a encore été généré.</p>
                    )}
                </div>
            )}
        </div>
    );
}