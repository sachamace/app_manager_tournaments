import { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

import { getTeam, updateTeam } from '../services/teams';
import { createPlayer, updatePlayer, deletePlayer } from '../services/players';
import '../assets/css/index.css';
import ButtonDanger from '../components/ui/Button_Danger';
import ButtonYes from '../components/ui/Button_Yes';
import ButtonPrimary from '../components/ui/Button_Primary';
export default function ModifyTeam() {
    const { id: tournamentId, participant_id: teamId } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [nom, setNom] = useState('');
    const [acronyme, setAcronyme] = useState('');
    const [logo, setLogo] = useState(null);
    const [captain, setCaptain] = useState('');
    const [players, setPlayers] = useState([]);
    const [playerName, setPlayerName] = useState('');
    const [message, setMessage] = useState({ type: '', content: '' });
    const [originalPlayers, setOriginalPlayers] = useState([]);

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
            const originalPseudos = originalPlayers.map(p => p.pseudo);
            const pseudosToAdd = players.filter(p => !originalPseudos.includes(p));
            const playersToRemove = originalPlayers.filter(p => !players.includes(p.pseudo));
            
            const newPlayerObjects = await Promise.all(
                pseudosToAdd.map(pseudo => createPlayer({ pseudo }))
            );
            await Promise.all(
                // On passe l'ID du joueur, pas l'objet entier, pour être plus robuste.
                playersToRemove.map(p => deletePlayer(p._id))
            );

            const remainingOriginalPlayers = originalPlayers.filter(p => players.includes(p.pseudo));
            // On fusionne les deux tableaux en un seul (et non un tableau de tableaux).
            const finalPlayers = [...remainingOriginalPlayers, ...newPlayerObjects];
            const finalPlayerIds = finalPlayers.map(p => p._id);
            const captainId = finalPlayers.find(p => p.pseudo === captain)?._id;

            const teamData = {
                nom,
                acronyme,
                captain: captainId,
                players: finalPlayerIds,
            };

            const updatedTeam = await updateTeam(teamId, teamData);

            await Promise.all(
                newPlayerObjects.map(player => updatePlayer(player._id, player.pseudo, updatedTeam._id))
            );

            setMessage({ type: 'success', content: 'Équipe mise à jour avec succès !' });
            setTimeout(() => {
                navigate(`/tournaments/${tournamentId}`);
            }, 1500);

        } catch (error) {
            setMessage({ type: 'error', content: error.message || "Une erreur est survenue lors de la mise à jour." });
        }
    };

    useEffect(() => {
        const loadTeam = async () => {
            try {
                const data = await getTeam(teamId);
                if (data) {
                    setNom(data.nom);
                    setAcronyme(data.acronyme);
                    if (data.players && Array.isArray(data.players)) {
                        setPlayers(data.players.map(p => p.pseudo));
                        setOriginalPlayers(data.players);
                        const captainPlayer = data.players.find(p => p._id === data.captain);
                        if (captainPlayer) {
                            setCaptain(captainPlayer.pseudo);
                        }
                    }
                }
            } catch (error) {
                setMessage({ type: 'error', content: "Erreur lors du chargement de l'équipe." });
            }
        };
        loadTeam();
    }, [teamId]);

    return (
        <div className="page-container">
            <div className="auth-card" style={{ maxWidth: '600px', margin: 'auto' }}>
                <h2>Modifier l'équipe : {nom}</h2>

                {message.content && (
                    <div className={`message ${message.type === 'error' ? 'message-error' : 'message-success'}`}>
                        {message.content}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="nom">Nom de l'équipe</label>
                        <input type="text" id="nom" name="nom" className="form-input" value={nom} onChange={(e) => setNom(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="acronyme">Acronyme de l'équipe</label>
                        <input type="text" id="acronyme" name="acronyme" className="form-input" value={acronyme} onChange={(e) => setAcronyme(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="logo">Logo de l'équipe (Optionnel)</label>
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
                                value={playerName}
                                onChange={(e) => setPlayerName(e.target.value)}
                                placeholder="Caliste"
                            />
                            <ButtonYes onClick={handleAddPlayer}>
                                +
                            </ButtonYes>
                        </div>
                    </div>
                    {players.length > 0 && (
                        <>
                            <div className="form-group">
                                <label>Joueurs de l'équipe</label>
                                <ul className="list-group">
                                    {players.map((player, index) => (
                                        <li key={index} className="list-group-item">
                                            {player}
                                            <ButtonDanger onClick={() => handleRemovePlayer(player)} className="btn-danger btn-sm">
                                                -
                                            </ButtonDanger>
                                        </li>
                                    ))}
                                </ul>
                            </div>
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
                        </>
                    )}

                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <ButtonPrimary type="submit">
                            Enregistrer
                        </ButtonPrimary>
                        <ButtonDanger onClick={() => navigate(`/tournaments/${tournamentId}`)}>
                            Annuler
                        </ButtonDanger>
                    </div>
                </form>
            </div>
        </div>
    );
} 