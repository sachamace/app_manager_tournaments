
import React from 'react';
import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import Button from '../ui/Button_Primary';
import '../../assets/css/index.css';

const TournamentCard = ({ tournament }) => {
  return (
    <div className="tournament-card">
      <div className="tournament-header">
        <h3>{tournament.title}</h3>
        <Badge status={tournament.statut}>
          {tournament.statut}
        </Badge>
      </div>
      <div className="tournament-info">
        <p><strong>Jeu :</strong> {tournament.games}</p>
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
  );
};

export default TournamentCard;
