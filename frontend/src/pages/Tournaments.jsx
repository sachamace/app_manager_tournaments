
import { useState, useEffect, useContext } from 'react';
import { fetchMyTournaments } from '../services/tournaments';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import TournamentCard from '../components/tournaments/TournamentCard';
import '../assets/css/index.css';

export default function Tournaments() {
  const { user } = useContext(AuthContext);
  const [tournaments, setTournaments] = useState([]);

  useEffect(() => {
    const loadTournaments = async () => {
      if (user && user._id) {
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
      <PageHeader
        title="Mes Tournois"
        buttonText="+ Créer un tournoi"
        buttonTo="/tournaments/create"
      />
      {tournaments.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>Vous n'avez pas encore créé de tournoi.</p>
      ) : (
        <div className="tournaments-grid">
          {tournaments.map((tournament) => (
            <TournamentCard key={tournament._id} tournament={tournament} />
          ))}
        </div>
      )}
    </div>
  );
}