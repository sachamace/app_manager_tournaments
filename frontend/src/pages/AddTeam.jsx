import { useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

import { createTeam } from '../services/teams';
import { createPlayer, updatePlayer } from '../services/players';
import '../assets/css/index.css';
export default function AddTeam() {
    const {id : tournamentId} = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [nom, setNom] = useState('');
    const [acronyme, setAcronyme] = useState('');
    const [logo, setLogo] = useState('');
    const [captain, setCaptain] = useState('');
    const [players, setPlayers] = useState([]);
    const [playerName, setPlayerName] = useState('');
    const [message, setMessage] = useState({ type: '', content: '' });

    const handleAddPlayer = () => {
        const trimmedName = playerName.trim();
        if (trimmedName !== '' && !players.includes(trimmedName)) {
            setPlayers([...players, trimmedName]);
            setPlayerName('');
        }
    };

    const handleRemovePlayer = (playerToRemove) => {
        setPlayers(players.filter(player => player !== playerToRemove));
        if (captain === playerToRemove) {
            setCaptain('');
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', content: '' });
        
        if (!nom || !acronyme || players.length === 0 || !captain) {
            setMessage({ type: 'error', content: 'Veuillez remplir tous les champs obligatoires.' });
            return;
        }

        try {
            // 1. On crée d'abord les joueurs en base de données pour générer leurs IDs
            const createdPlayers = await Promise.all(
                players.map(pseudo => createPlayer({ pseudo }))
            );
            
            const playerIds = createdPlayers.map(p => p._id);
            const captainId = createdPlayers.find(p => p.pseudo === captain)?._id;

            const teamsData = {
                tournament: tournamentId,
                nom,
                acronyme,
                logo,
                captain: captainId,
                players: playerIds
            };
            
            const newTeam = await createTeam(teamsData);

            // 3. Maintenant que l'équipe existe, on met à jour les joueurs avec son ID
            await Promise.all(
                createdPlayers.map(player => updatePlayer(player._id, player.pseudo, newTeam._id))
            );

            setMessage({ type: 'success', content: 'Team créé avec succès !' });
            setTimeout(() => {
                navigate(`/tournaments/${tournamentId}`);
            }, 1500);

        } catch (error) {
            setMessage({ type: 'error', content: error.message || 'Une erreur est survenue lors de la création de la team.' });
        }
    };

    return (
        <div className="page-container">
            <div className="auth-card" style={{ maxWidth: '600px', margin: 'auto' }}>
                <h2>Créer une nouvelle team</h2>

                {message.content && (
                    <div className={`message ${message.type === 'error' ? 'message-error' : 'message-success'}`} style={{ marginBottom: '20px' }}>
                        {message.content}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="nom">Nom de l'équipe</label>
                        <input
                            type="text"
                            id="nom"
                            className="form-input"
                            value={nom}
                            onChange={(e) => setNom(e.target.value)}
                            placeholder="Karmine Corp"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="acronyme">Acronyme</label>
                        <input
                            type="text"
                            id="acronyme"
                            className="form-input"
                            value={acronyme}
                            onChange={(e) => setAcronyme(e.target.value)}
                            placeholder="KC"
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="logo">Logo de l'équipe - Optionnel</label>
                        <input
                            type="file"
                            id="logo"
                            className="form-input"
                            accept="image/*" 
                            onChange={(e) => setLogo(e.target.files[0])} 
                        />
                    </div>

                    
                    <div className="form-group">
                        <label htmlFor="players">Ajout d'un joueur </label>
                        <div style={{ display: 'flex' }}>
                            <input
                                id="players"
                                className="form-input"
                                value = {playerName}
                                onChange={(e) => setPlayerName(e.target.value)} 
                                placeholder="Caliste"
                            />
                            <button type="button" onClick={handleAddPlayer} className="btn-yes" style={{ marginLeft: '10px' }}>+</button>
                        </div>
                    </div>
                    {players.length > 0 && (
                        <div className="form-group">
                            <label>Joueurs de l'équipe</label>
                            <ul className="list-group">
                                {players.map((player, index) => (
                                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                        {player}
                                        <button type="button" onClick={() => handleRemovePlayer(player)} className="btn-danger btn-sm">-</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {players.length > 0 && (
                        <div className="form-group">
                            <label htmlFor="captain">Capitaine de l'équipe</label>
                            <select
                                id="captain"
                                className="form-input"
                                value={captain}
                                onChange={(e) => setCaptain(e.target.value)}
                                required
                            >
                                <option value="">Sélectionnez un capitaine</option>
                                {players.map((player, index) => (
                                    <option key={index} value={player}>{player}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <button type="submit" className="btn-yes" style={{ marginTop: '20px' }}>
                        Soumettre l'équipe
                    </button>
                </form>
            </div>
        </div>
    );
}