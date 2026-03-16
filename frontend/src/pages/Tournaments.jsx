
import { useState, useEffect, useContext } from 'react';
import { fetchMyTournaments } from '../services/tournaments'; // 1. On importe la nouvelle fonction
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import '../assets/css/index.css';
export default function Tournaments() {

    const {user} = useContext(AuthContext);

    const [tournaments, setTournaments] = useState([]);

    // Ce qui va se appaser lors du chargement de la page 
    useEffect(() => {
        const loadTournaments = async () => {
            if (user && user._id) { 
                // On passe son ID à notre service
                const data = await fetchMyTournaments(user._id); 
                setTournaments(data);
            }
        };
        
        loadTournaments();
    }, [user]); 

    if (!user) {
        return (
            <div className="page-container" style={{ textAlign: 'center' }}>
                <h1 className="tournament-header">Mes Tournois</h1>
                <p style={{ color: 'var(--text-muted)' }}>
                    Vous devez être connecté pour voir vos tournois.
                </p>
                <Link to="/login" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block', marginTop: '20px' }}>
                    Se connecter
                </Link>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 className="tournament-header">Mes Tournois</h1>
                {/* Un futur bouton pour créer un tournoi ! */}
                <button className="btn-primary" style={{ width: 'auto' }}>+ Créer un tournoi</button>
            </div>
            
            {tournaments.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>Vous n'avez pas encore créé de tournoi.</p>
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