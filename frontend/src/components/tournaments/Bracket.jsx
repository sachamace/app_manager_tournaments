import React, { useState } from 'react';
import { updateMatchScore } from '../../services/matches';
import '../../assets/css/index.css';

const MatchCard = ({ match, onScoreUpdated }) => {
    // On initialise les scores depuis les données du match, sinon on laisse vide.
    const initialScore1 = match.score?.find(s => s.team === match.teams[0]?._id)?.points ?? '';
    const initialScore2 = match.score?.find(s => s.team === match.teams[1]?._id)?.points ?? '';

    const [score1, setScore1] = useState(initialScore1);
    const [score2, setScore2] = useState(initialScore2);
    const [message, setMessage] = useState({ type: '', content: '' });

    // Un match est éditable s'il a deux équipes et pas encore de gagnant.
    const isEditable = match.teams.length === 2 && !match.winner;

    const handleSaveScore = async () => {
        if (score1 === '' || score2 === '') {
            setMessage({ type: 'error', content: 'Les deux scores sont requis.' });
            return;
        }

        // On prépare les données à envoyer à l'API
        const scoresPayload = [
            { team: match.teams[0]._id, points: Number(score1) },
            { team: match.teams[1]._id, points: Number(score2) }
        ];

        try {
            await updateMatchScore(match._id, scoresPayload);
            setMessage({ type: 'success', content: 'Score mis à jour !' });
            // On notifie le parent pour rafraîchir les données de tout l'arbre
            if (onScoreUpdated) {
                onScoreUpdated();
            }
        } catch (error) {
            setMessage({ type: 'error', content: error.message || 'Erreur lors de la mise à jour.' });
        }
    };

    // Fonction pour déterminer la classe CSS (gagnant/perdant)
    const getTeamClassName = (team) => {
        if (!team) return 'match-team'; // Cas d'une équipe non encore déterminée
        if (!match.winner && !match.loser) return 'match-team'; // Match non joué
        if (match.winner?._id === team._id) return 'match-team winner'; // Gagnant
        if (match.loser === team._id) return 'match-team loser'; // Perdant
        return 'match-team';
    };

    return (
        <div className="match-card">
            <div className="match-info">Match #{match.matchNumber}</div>
            <div className="match-teams">
                {/* Équipe 1 */}
                <div className={getTeamClassName(match.teams[0])}>
                    <span>{match.teams[0]?.nom || 'À déterminer'}</span>
                    {isEditable ? (
                        <input type="number" className="score-input" value={score1} onChange={(e) => setScore1(e.target.value)} placeholder="-" min="0" />
                    ) : (
                        <span className="score-display">{score1}</span>
                    )}
                </div>
                {/* Équipe 2 (si elle existe) */}
                {match.teams.length > 1 ? (
                    <div className={getTeamClassName(match.teams[1])}>
                        <span>{match.teams[1]?.nom || 'À déterminer'}</span>
                        {isEditable ? (
                            <input type="number" className="score-input" value={score2} onChange={(e) => setScore2(e.target.value)} placeholder="-" min="0" />
                        ) : (
                            <span className="score-display">{score2}</span>
                        )}
                    </div>
                ) : <div className="match-team"><span>(BYE)</span></div>}
            </div>
            {isEditable && <div className="match-actions"><button onClick={handleSaveScore} className="btn-primary btn-sm">Valider</button></div>}
            {message.content && <p className={`message-small ${message.type === 'error' ? 'message-error' : 'message-success'}`}>{message.content}</p>}
        </div>
    );
};

// Helper pour regrouper les matchs par round
const groupMatchesByRound = (matches) => {
    if (!matches) return {};
    return matches.reduce((acc, match) => {
        const roundKey = `Round ${match.round}`;
        if (!acc[roundKey]) {
            acc[roundKey] = [];
        }
        acc[roundKey].push(match);
        return acc;
    }, {});
};

export default function Bracket({ matches, onScoreUpdated }) {
    const groupedMatches = groupMatchesByRound(matches);

    if (!matches || matches.length === 0) {
        return (
            <div className="detail-main-card">
                <p>Aucun match n'a encore été généré pour ce tournoi.</p>
            </div>
        );
    }

    return (
        <div className="bracket-container">
            {Object.entries(groupedMatches).map(([round, roundMatches]) => (
                <div key={round} className="round">
                    <h2 className="round-title">{round}</h2>
                    {roundMatches.map(match => (
                        <MatchCard key={match._id} match={match} onScoreUpdated={onScoreUpdated} />
                    ))}
                </div>
            ))}
        </div>
    );
}
