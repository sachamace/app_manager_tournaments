import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { addTournament } from '../services/tournaments';
import '../assets/css/index.css';

export default function CreateTournament() {

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
        <div style={{ padding: 'var(--spacing-lg)', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
            
            {/* --- EN-TÊTE --- */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                <div>
                    <h1 style={{ fontFamily: 'var(--font-heading)', margin: 0 }}>Créer un Tournoi</h1>
                    <p className="text-label" style={{ marginTop: '4px' }}>
                        Configurez les paramètres de votre nouvel événement.
                    </p>
                </div>
                {/* 💡 Utilisation de la nouvelle classe .btn-secondary */}
                <Link to="/tournaments" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
                    Retour aux tournois
                </Link>
            </div>

            {/* 💡 Utilisation des nouvelles classes .alert .alert-error / .alert-success */}
            {message.content && (
                <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'}`}>
                    {message.content}
                </div>
            )}

            {/* --- CARTE DU FORMULAIRE --- */}
            <div className="card">
                <form>
                    {/* Grille adaptative (1 colonne sur mobile, 2 colonnes sur PC) */}
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '1fr 1fr', 
                        gap: 'var(--spacing-lg)' 
                    }}>
                        
                        {/* --- LIGNE 1 --- */}
                        <div className="input-group">
                            <label className="text-label" htmlFor="name">Nom du tournoi *</label>
                            <input 
                                type="text" 
                                id="name"
                                name="name"
                                className="input-field" 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Ex: Tournoi d'Été 2026" 
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label className="text-label" htmlFor="game">Jeu / Sport *</label>
                            <input 
                                type="text" 
                                id="game"
                                name="game"
                                className="input-field" 
                                value={games}
                                onChange={(e) => setGames(e.target.value)}
                                placeholder="Ex: Football, League of Legends..." 
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label className="text-label" htmlFor="cashprize">Cash Prize (Optionnel) </label>
                            <input
                                type="text"
                                id="cashprize"
                                className="form-input"
                                value={cashprize}
                                onChange={(e) => setCashprize(e.target.value)}
                                placeholder="Ex: 1000€, Lots, etc."
                            />
                        </div>
                        {/* --- LIGNE 2 --- */}
                        {/* <div className="input-group">
                            <label className="text-label" htmlFor="maxTeams">Nombre d'équipes max *</label>
                            <input 
                                type="number" 
                                id="maxTeams"
                                name="maxTeams"
                                className="input-field" 
                                placeholder="Ex: 16"
                                min="2"
                                required
                            />
                        </div> */}

                        <div className="input-group">
                            <label className="text-label" htmlFor="format">Format du tournoi *</label>
                            <select 
                                id="format"
                                name="format"
                                className="input-field"
                                value={tree_type}
                                onChange={(e) => setTreeType(e.target.value)}
                                defaultValue=""
                                required
                            >
                                <option value="" disabled>Sélectionnez un format</option>
                                <option value="single_elimination">Élimination directe</option>
                                <option value="double_elimination">Double élimination</option>
                                <option value="championship">Championnat (Poules)</option>
                            </select>
                        </div>
                    </div>

                    {/* --- CHAMP LARGE (Description) --- */}
                    {/* <div className="input-group" style={{ marginTop: 'var(--spacing-md)' }}>
                        <label className="text-label" htmlFor="description">Description et Règles</label>
                        <textarea 
                            id="description"
                            name="description"
                            className="input-field" 
                            placeholder="Détaillez le règlement, les récompenses, ou toute information utile pour les participants..."
                            rows="5"
                            style={{ resize: 'vertical' }}
                        ></textarea>
                    </div> */}

                    {/* --- ZONE DES BOUTONS DE VALIDATION --- */}
                    <div style={{ 
                        marginTop: 'var(--spacing-lg)', 
                        paddingTop: 'var(--spacing-md)',
                        borderTop: '1px solid var(--color-border)',
                        display: 'flex', 
                        justifyContent: 'flex-end', 
                        gap: 'var(--spacing-md)' 
                    }}>
                        <button type="submit" className="btn btn-primary">
                            Créer le tournoi
                        </button>
                    </div>

                </form>
            </div>

        </div>
    );
}