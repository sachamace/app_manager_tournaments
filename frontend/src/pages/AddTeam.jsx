import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { createTeam } from '../services/teams';
import { addTeamsAtTournament } from '../services/tournaments';
import '../assets/css/index.css';

export default function AddTeam() {
    const { id } = useParams(); // ID du tournoi
    const navigate = useNavigate();

    const [teamName, setTeamName] = useState('');
    const [message, setMessage] = useState({ type: '', content: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', content: '' });

        if (!teamName.trim()) {
            setMessage({ type: 'error', content: 'Le nom de l\'équipe est requis.' });
            return;
        }

        setIsLoading(true);
        try {
            // 1. Créer la team
            const newTeam = await createTeam({ name: teamName });
            
            // 2. L'ajouter au tournoi
            await addTeamsAtTournament(id, newTeam._id);

            setMessage({ type: 'success', content: 'Équipe ajoutée avec succès !' });
            
            // Redirection vers le tournoi
            setTimeout(() => {
                navigate(`/tournament/${id}`);
            }, 1500);
        } catch (error) {
            setMessage({ type: 'error', content: error.message || "Erreur lors de l'ajout de l'équipe." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ padding: 'var(--spacing-lg)', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                <div>
                    <h1 style={{ fontFamily: 'var(--font-heading)', margin: 0 }}>Ajouter une équipe</h1>
                    <p className="text-label" style={{ marginTop: '4px' }}>
                        Inscrire une nouvelle équipe à ce tournoi.
                    </p>
                </div>
                <Link to={`/tournament/${id}`} className="btn btn-secondary" style={{ textDecoration: 'none' }}>
                    Retour au tournoi
                </Link>
            </div>

            {message.content && (
                <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'}`}>
                    {message.content}
                </div>
            )}

            <div className="card">
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="text-label" htmlFor="teamName">Nom de l'équipe *</label>
                        <input 
                            type="text" 
                            id="teamName"
                            name="teamName"
                            className="input-field" 
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            placeholder="Ex: Les Invincibles" 
                            required
                        />
                    </div>

                    <div className="alert" style={{ backgroundColor: 'rgba(37, 99, 235, 0.05)', borderColor: 'rgba(37, 99, 235, 0.1)', marginTop: 'var(--spacing-md)' }}>
                        <p className="text-label" style={{ margin: 0 }}>
                            💡 L'ajout des joueurs nécessitant leur création au préalable selon la structure de l'API (utilisation d'un Player ID), cela se fera depuis la gestion des équipes.
                        </p>
                    </div>

                    <div style={{ 
                        marginTop: 'var(--spacing-lg)', 
                        paddingTop: 'var(--spacing-md)',
                        borderTop: '1px solid var(--color-border)',
                        display: 'flex', 
                        justifyContent: 'flex-end', 
                        gap: 'var(--spacing-md)' 
                    }}>
                        <button type="submit" className="btn btn-primary" disabled={isLoading}>
                            {isLoading ? 'Ajout en cours...' : 'Ajouter l\'équipe'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}