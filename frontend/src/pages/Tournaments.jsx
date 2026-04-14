import { useState, useEffect, useContext } from 'react';
import { fetchMyTournaments } from "../services/tournaments";
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../assets/css/index.css';

export default function Tournaments(){
    const { user } = useContext(AuthContext);
    const [tournaments, setTournaments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadTournaments = async () => {
            if (!user || !user._id) {
                setIsLoading(false);
                return;
            }
            
            try {
                const myTourneys = await fetchMyTournaments(user._id);
                setTournaments(myTourneys);
            } catch (err) {
                setError("Impossible de charger vos tournois.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        loadTournaments();
    }, [user]);

    if (!user) {
        return (
            <div className="page-container" style={{ textAlign: 'center', padding: 'var(--spacing-lg)' }}>
                <h1 style={{ fontFamily: 'var(--font-heading)' }}>Mes Tournois</h1>
                <p className="text-label">
                    Vous devez être connecté pour voir cette page.
                </p>
                <Link to="/login" className="btn btn-primary" style={{ textDecoration: 'none', marginTop: '20px', display: 'inline-block' }}>
                    Se connecter
                </Link>
            </div>
        );
    }

    if (isLoading) {
        return <div style={{ padding: 'var(--spacing-lg)' }}>Chargement de vos tournois...</div>;
    }

    return (
        <div style={{ padding: 'var(--spacing-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                <h1 style={{ fontFamily: 'var(--font-heading)', margin: 0 }}>Mes tournois</h1>
                <Link to="/tournament/create" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                    + Créer un tournoi
                </Link>
            </div>

            {error && (
                <div className="alert alert-error">
                    {error}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--spacing-md)' }}>
                {tournaments.length > 0 ? (
                    tournaments.map(tournament => (
                        <Link 
                            to={`/tournament/${tournament._id}`} 
                            key={tournament._id} 
                            className="card-interactive"
                            style={{ 
                                display: 'flex', 
                                flexDirection: 'column',
                                gap: '8px',
                                padding: 'var(--spacing-md)',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-sm)',
                                textDecoration: 'none',
                                color: 'inherit',
                                backgroundColor: 'var(--color-background)'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div className="text-body" style={{ fontWeight: 600, fontSize: '1.1rem' }}>{tournament.name || tournament.title}</div>
                                <span className={`badge ${
                                    tournament.statut === 'en_cours' ? 'badge-success' : 
                                    tournament.statut === 'en_attente' ? 'badge-accent' : ''
                                }`} style={{
                                    ...(tournament.statut === 'fini' && { backgroundColor: 'var(--color-border)', color: 'var(--color-text-muted)' })
                                }}>
                                    {tournament.statut === 'en_attente' ? 'En attente' : tournament.statut === 'en_cours' ? 'En cours' : 'Terminé'}
                                </span>
                            </div>
                            <div className="text-label">
                                {tournament.game || tournament.games} • {tournament.date || 'Date non définie'}
                            </div>
                        </Link>
                    ))
                ) : (
                    <p className="text-label" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem 0' }}>
                        Vous n'avez pas encore de tournoi.
                    </p>
                )}
            </div>
        </div>
    );
}