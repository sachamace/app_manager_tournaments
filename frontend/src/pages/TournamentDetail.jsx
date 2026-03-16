import { useState, useEffect } from 'react';
import { getTeamsRegister, getTournamentById } from '../services/tournaments';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../assets/css/index.css';
export default function TournamentDetail() {
    // 2. On extrait l'ID qui est dans l'URL ! (il s'appelle 'id' car on a mis ':id' dans App.jsx)
    const { id } = useParams(); 

    // 3. Attention : On initialise à "null", pas à "[]", car on récupère UN SEUL objet, pas une liste.
    const [tournament, setTournament] = useState(null);
    const [participants, setParticipants] = useState([]);
    useEffect(() => {
        const loadTournament = async () => {
            // 4. On donne l'ID à notre service ("facteur") !
            const data = await getTournamentById(id); 
            setTournament(data);
        };
        
        const loadTeams = async () => {
            const teams = await getTeamsRegister(id);
            setParticipants(teams);
        };
        loadTournament();
        loadTeams();
    }, [id]); // On met "id" ici pour dire à React de recharger si l'ID dans l'URL change

    // Si les données ne sont pas encore arrivées
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
                                    <button className="btn-danger" style={{ fontSize: '0.9rem', padding: '8px 12px' }}>
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