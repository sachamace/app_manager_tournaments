
import { useState, useEffect } from 'react';
import { fetchAllTournaments } from '../services/tournaments';
import { Link } from 'react-router-dom';
import '../assets/css/index.css';
export default function Tournaments() {
    const [tournaments, setTournaments] = useState([]);

    // Ce qui va se appaser lors du chargement de la page 
    useEffect(() => {
        const loadTournaments = async () => {
            const data = await fetchAllTournaments();
            setTournaments(data); 
        };
        
        loadTournaments();
    }, []); 

    
    return (
    <div className="page-container">
            <h1 className="page-title">Liste de mes Tournois</h1>
            
            {tournaments.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>⏳ Chargement des tournois...</p>
            ) : (
                <div className="tournaments-grid">
                    
                    {tournaments.map((tournament) => (
                        <div key={tournament._id} className="tournament-card">
                            
                            <div className="tournament-header">
                                <h3>{tournament.games}</h3>
                                
                                <span className={`badge ${tournament.statut === 'en_cours' ? 'active' : 'pending'}`}>
                                    {tournament.statut}
                                </span>
                            </div>
                            
                            <div className="tournament-info">
                                <p><strong>Format :</strong> {tournament.tree_type}</p>
                                
                                {tournament.cashprize && (
                                    <p><strong>Cashprize :</strong> {tournament.cashprize}</p>
                                )}
                            </div>
                            <Link 
                                to={`/tournaments/${tournament._id}`} 
                                className="btn-primary" 
                                style={{ display: 'block', textAlign: 'center', marginTop: '15px', textDecoration: 'none', boxSizing: 'border-box' }}
                            >
                                Voir les détails
                            </Link>
                            
                        </div>
                    ))}
                    
                </div>
            )}
        </div>
  );
}