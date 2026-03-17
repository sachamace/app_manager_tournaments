import { useState, useEffect } from 'react';
import { getTeamsRegister, getTournamentById } from '../services/tournaments';
import { deleteTeam } from '../services/teams';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../assets/css/index.css';
export default function TournamentDetail() {

    const { id } = useParams(); 


    const [tournament, setTournament] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [message, setMessage] = useState({ type: '', content: '' });

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

    useEffect(() => {
        const loadTournament = async () => {
            const data = await getTournamentById(id); 
            setTournament(data);
        };
        
        const loadTeams = async () => {
            const teams = await getTeamsRegister(id);
            setParticipants(teams);
        };
        loadTournament();
        loadTeams();
    }, [id]); 


    if (!tournament || !participants) {
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
                <button className="btn-yes">Commencer le tournoi</button>
                <button className="btn-danger">Supprimer le tournoi</button>
            </div>
        </div>

        {message.content && (
            <div className={`message ${message.type === 'error' ? 'message-error' : 'message-success'}`} style={{ marginTop: '20px' }}>
                {message.content}
            </div>
        )}

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
                                    <button className="btn-danger" style={{ fontSize: '0.9rem', padding: '8px 12px' }} onClick={() => handleRemoveTeam(participant._id)} >
                                        Supprimer l'équipe
                                    </button>
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
    </div>
  );
}