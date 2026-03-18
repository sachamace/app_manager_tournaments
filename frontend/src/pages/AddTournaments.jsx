import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { addTournament } from '../services/tournaments';
import '../assets/css/index.css';
import ButtonPrimary from '../components/ui/Button_Primary';

export default function AddTournaments() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [games, setGames] = useState('');
    const [tree_type, setTreeType] = useState('elimination');
    const [cashprize, setCashprize] = useState('');
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState({ type: '', content: '' });
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', content: '' });
        
        // On vérifie seulement les champs obligatoires. Le cashprize est optionnel.
        if (!title || !games || !tree_type) {
            setMessage({ type: 'error', content: 'Veuillez remplir tous les champs obligatoires.' });
            return;
        }

        try {
            // On prépare un objet avec toutes les données du tournoi
            const tournamentData = {
                title,
                games,
                tree_type,
                cashprize,
                account: user._id // On ajoute l'ID de l'utilisateur connecté
            };
            
            const newTournament = await addTournament(tournamentData);
            setMessage({ type: 'success', content: 'Tournoi créé avec succès !' });
            
            // Rediriger vers la page du nouveau tournoi après un court délai
            setTimeout(() => {
                navigate(`/tournaments/${newTournament._id}`);
            }, 1500);

        } catch (error) {
            setMessage({ type: 'error', content: error.message || 'Une erreur est survenue lors de la création du tournoi.' });
        }
    };

    if (!user) {
        return (
            <div className="page-container" style={{ textAlign: 'center' }}>
                <h1 className="tournament-header">Créer un Tournoi</h1>
                <p style={{ color: 'var(--text-muted)' }}>
                    Vous devez être connecté pour créer un tournoi.
                </p>
                <Link to="/login" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block', marginTop: '20px', width: 'auto' }}>
                    Se connecter
                </Link>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="auth-card" style={{ maxWidth: '600px', margin: 'auto' }}>
                <h2>Créer un nouveau tournoi</h2>

                {message.content && (
                    <div className={`message ${message.type === 'error' ? 'message-error' : 'message-success'}`} style={{ marginBottom: '20px' }}>
                        {message.content}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="cashprize">Titre du tournoi</label>
                        <input
                            type="text"
                            id="title"
                            className="form-input"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Tournoi 1V1 Aram"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="games">Jeu du tournoi</label>
                        <input
                            type="text"
                            id="texte"
                            className="form-input"
                            value={games}
                            onChange={(e) => setGames(e.target.value)}
                            placeholder="League Of Legends"
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="tree_type">Format de l'arbre</label>
                        <select
                            id="tree_type"
                            className="form-input"
                            value={tree_type}
                            onChange={(e) => setTreeType(e.target.value)}
                            required
                        >
                            <option value="elimination">Élimination simple</option>
                            {/* <option value="championnat">Championnat</option>
                            <option value="suisse">Systême Suisse</option> */}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="cashprize">Cashprize (Optionnel)</label>
                        <input
                            type="text"
                            id="cashprize"
                            className="form-input"
                            value={cashprize}
                            onChange={(e) => setCashprize(e.target.value)}
                            placeholder="Ex: 1000€, Lots, etc."
                        />
                    </div>


                    <ButtonPrimary type="submit" >
                        Créer le tournoi
                    </ButtonPrimary>
                </form>
            </div>
        </div>
    );
}