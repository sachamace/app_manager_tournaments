import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Import de tes vrais services API
import { fetchMyTournaments } from '../services/tournaments';
import { fetchAllTeams } from '../services/teams';
import { fetchAllMatches } from '../services/matches';

import '../assets/css/index.css';

export default function Home() {
    const { user } = useContext(AuthContext);

    // -- ÉTATS DYNAMIQUES --
    const [stats, setStats] = useState({
        activeTournaments: 0,
        totalTeams: 0,
        matchesPlayed: 0
    });
    const [recentTournaments, setRecentTournaments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // -- CHARGEMENT DES DONNÉES DEPUIS L'API --
    useEffect(() => {
        const loadDashboardData = async () => {
            if (!user || !user._id) return;
            
            setIsLoading(true);
            try {
                // 1. Récupération en parallèle des données pour plus de rapidité
                const [myTourneys, allTeams, allMatches] = await Promise.all([
                    fetchMyTournaments(user._id),
                    fetchAllTeams(),
                    fetchAllMatches()
                ]);

                // 2. Calcul des Statistiques (KPIs)
                const activeCount = myTourneys.filter(t => t.statut === 'en_cours').length;
                const finishedMatchesCount = allMatches.filter(m => m.statut === 'fini').length;

                setStats({
                    activeTournaments: activeCount,
                    totalTeams: allTeams.length || 0,
                    matchesPlayed: finishedMatchesCount
                });

                // 3. Récupération des tournois récents (On prend les 3 derniers)
                // Si tu as une date de création, tu pourrais faire un .sort() avant le .slice()
                const recent = myTourneys.slice(-3).reverse(); 
                setRecentTournaments(recent);

            } catch (err) {
                console.error("Erreur lors du chargement du dashboard :", err);
                setError("Impossible de charger vos données pour le moment.");
            } finally {
                setIsLoading(false);
            }
        };

        loadDashboardData();
    }, [user]);


    // -- RENDU PENDANT LE CHARGEMENT --
    if (isLoading) {
        return <div style={{ padding: 'var(--spacing-lg)' }}>Chargement de votre tableau de bord...</div>;
    }

    return (
        <div style={{ padding: 'var(--spacing-lg)' }}>
            
            {/* -- ALERTE EN CAS D'ERREUR -- */}
            {error && (
                <div className="alert alert-error">
                    {error}
                </div>
            )}

            {/* -- EN-TÊTE / BIENVENUE -- */}
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <h1 style={{ fontFamily: 'var(--font-heading)', margin: 0, fontSize: '2rem' }}>
                    Bonjour, {user?.pseudo || 'Organisateur'} 👋
                </h1>
                <p className="text-label" style={{ marginTop: '8px', fontSize: '15px' }}>
                    Voici un résumé de votre activité et de vos tournois.
                </p>
            </div>

            {/* -- CARTES DE STATISTIQUES (KPIs) -- */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: 'var(--spacing-md)',
                marginBottom: 'var(--spacing-lg)'
            }}>
                <div className="card" style={{ marginBottom: 0, borderLeft: '4px solid var(--color-primary)' }}>
                    <div className="text-label">Vos tournois en cours</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-text-main)', marginTop: '8px' }}>
                        {stats.activeTournaments}
                    </div>
                </div>
                
                <div className="card" style={{ marginBottom: 0, borderLeft: '4px solid var(--color-success)' }}>
                    <div className="text-label">Total équipes inscrites</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-text-main)', marginTop: '8px' }}>
                        {stats.totalTeams}
                    </div>
                </div>

                <div className="card" style={{ marginBottom: 0, borderLeft: '4px solid var(--color-accent)' }}>
                    <div className="text-label">Matchs globaux terminés</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-text-main)', marginTop: '8px' }}>
                        {stats.matchesPlayed}
                    </div>
                </div>
            </div>

            {/* -- SECTION PRINCIPALE (2 Colonnes) -- */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '2fr 1fr', 
                gap: 'var(--spacing-lg)',
                alignItems: 'start'
            }}>
                
                {/* COLONNE GAUCHE : Tournois Récents */}
                <div className="card" style={{ marginBottom: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Vos tournois récents</h2>
                        <Link to="/tournaments" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
                            Voir tout →
                        </Link>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                        {recentTournaments.length > 0 ? (
                            recentTournaments.map(tournament => (
                                <Link 
                                    to={`/tournament/${tournament._id}`} 
                                    key={tournament._id} 
                                    className="card-interactive"
                                    style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center',
                                        padding: 'var(--spacing-md)',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: 'var(--radius-sm)',
                                        textDecoration: 'none',
                                        color: 'inherit',
                                        backgroundColor: 'var(--color-background)'
                                    }}
                                >
                                    <div>
                                        <div className="text-body" style={{ fontWeight: 600 }}>{tournament.name}</div>
                                        <div className="text-label" style={{ marginTop: '4px' }}>
                                            {tournament.game} • {tournament.date || 'Date non définie'}
                                        </div>
                                    </div>
                                    <span className={`badge ${
                                        tournament.statut === 'en_cours' ? 'badge-success' : 
                                        tournament.statut === 'en_attente' ? 'badge-accent' : ''
                                    }`} style={{
                                        ...(tournament.statut === 'fini' && { backgroundColor: 'var(--color-border)', color: 'var(--color-text-muted)' })
                                    }}>
                                        {tournament.statut === 'en_attente' ? 'En attente' : tournament.statut === 'en_cours' ? 'En cours' : 'Terminé'}
                                    </span>
                                </Link>
                            ))
                        ) : (
                            <p className="text-label" style={{ textAlign: 'center', padding: '1rem 0' }}>
                                Vous n'avez pas encore de tournoi.
                            </p>
                        )}
                    </div>
                </div>

                {/* COLONNE DROITE : Actions Rapides */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                    
                    <div className="card" style={{ marginBottom: 0 }}>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Actions rapides</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <Link to="/tournament/create" className="btn btn-primary" >
                                + Créer un tournoi
                            </Link>
                        </div>
                    </div>

                    <div className="card" style={{ marginBottom: 0, backgroundColor: 'rgba(37, 99, 235, 0.05)', borderColor: 'rgba(37, 99, 235, 0.1)' }}>
                        <h3 style={{ fontSize: '1rem', color: 'var(--color-primary)', marginBottom: '8px' }}>💡 Conseil du jour</h3>
                        <p className="text-label" style={{ margin: 0, lineHeight: 1.5 }}>
                            Assurez-vous que toutes les équipes soient inscrites avant de démarrer un tournoi pour générer un arbre de match équilibré.
                        </p>
                    </div>

                </div>

            </div>
        </div>
    );
}