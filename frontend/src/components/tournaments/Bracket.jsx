import React from 'react';
import '../../assets/css/index.css';

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

export default function Bracket({ matches }) {
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
                        <div key={match._id} className="match-card">
                            <div className="match-info">Match #{match.matchNumber}</div>
                            <div className="match-teams">
                                <div className={`match-team ${match.winner?._id === match.teams[0]?._id ? 'winner' : ''}`}><span>{match.teams[0]?.nom || 'À déterminer'}</span></div>
                                <div className={`match-team ${match.teams.length > 1 ? (match.winner?._id === match.teams[1]?._id ? 'winner' : '') : ''}`}><span>{match.teams[1]?.nom || (match.teams.length === 1 ? '(BYE)' : 'À déterminer')}</span></div>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}
