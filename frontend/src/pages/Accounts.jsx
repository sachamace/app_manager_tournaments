import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { fetchOneAuth, updateAuth, changePassword } from '../services/auth';
import { Link } from 'react-router-dom';
import '../assets/css/index.css';

export default function Account() {
    
    const { user, logout } = useContext(AuthContext);

    // -- ÉTATS --
    const [tournamentData, setTournamentData] = useState([]);
    const [message, setMessage] = useState({ type: '', content: '' });
    const [userData, setUserData] = useState(null);
    
    // Champs du profil
    const [formData, setFormData] = useState({ pseudo: '', birthday: '' });
    
    // États pour le mot de passe
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [isEditing, setIsEditing] = useState(false); 

    // -- CHARGEMENT DES DONNÉES --
    useEffect(() => {
        const loadUserData = async () => {
            if (user && user._id) {
                try {
                    const data = await fetchOneAuth(user._id);
                    setUserData(data);
                    setFormData({
                        pseudo: data.pseudo || '',
                    });
                } catch (error) {
                    setMessage({ type: 'error', content: "Erreur lors de la récupération des données du compte." });
                }
            }
        };
        
        loadUserData();
    }, [user]);

    // -- GESTIONNAIRES D'ÉVÉNEMENTS --
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage({ type: '', content: '' });

        try {
            const updatedUser = await updateAuth(user._id, formData);
            setUserData(updatedUser);
            setIsEditing(false);
            setMessage({ type: 'success', content: 'Profil mis à jour avec succès !' });
        } catch (error) {
            setMessage({ type: 'error', content: error.message || "Erreur lors de la mise à jour du profil." });
        }
    };
    
    const handleChangePassword = async (e) => {
        e.preventDefault();
        setMessage({ type: '', content: '' });

        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', content: 'Les mots de passe ne correspondent pas.' });
            return;
        }
        if (newPassword.length < 6) {
            setMessage({ type: 'error', content: 'Le mot de passe doit contenir au moins 6 caractères.' });
            return;
        }

        try {
            await changePassword(user._id, newPassword);
            setNewPassword('');
            setConfirmPassword('');
            setMessage({ type: 'success', content: 'Mot de passe modifié avec succès !' });
        } catch (error) {
            setMessage({ type: 'error', content: error.message || 'Erreur lors du changement de mot de passe.' });
        }
    };

    // -- RENDUS CONDITIONNELS --
    if (!user) {
        return (
            <div className="page-container" style={{ textAlign: 'center', padding: 'var(--spacing-lg)' }}>
                <h1 style={{ fontFamily: 'var(--font-heading)' }}>Mon Compte</h1>
                <p className="text-label">
                    Vous devez être connecté pour voir cette page.
                </p>
                <Link to="/login" className="btn btn-primary" style={{ textDecoration: 'none', marginTop: '20px' }}>
                    Se connecter
                </Link>
            </div>
        );
    }

    if (!userData || !tournamentData) {
        return <div style={{ padding: 'var(--spacing-lg)', fontFamily: 'var(--font-body)' }}>Chargement des données...</div>;
    }

    // -- RENDU PRINCIPAL --
    return (
        <div style={{ padding: 'var(--spacing-lg)' }}>
            <h1 style={{ marginBottom: 'var(--spacing-lg)', fontFamily: 'var(--font-heading)' }}>Paramètres du compte</h1>

            {message.content && (
                <div style={{
                    padding: 'var(--spacing-md)',
                    marginBottom: 'var(--spacing-md)',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: message.type === 'error' ? '#FEF2F2' : '#ECFDF5',
                    color: message.type === 'error' ? '#DC2626' : '#059669',
                    border: `1px solid ${message.type === 'error' ? '#FCA5A5' : '#6EE7B7'}`
                }}>
                    {message.content}
                </div>
            )}

            {/* Grille FIXE */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: 'var(--spacing-lg)' 
            }}>

                {/* --- COLONNE GAUCHE --- */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                    
                    <div className="card" style={{ marginBottom: 0 }}>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Informations Personnelles</h2>
                        <form onSubmit={handleUpdate}>
                            <div className="input-group">
                                <label className="text-label">Pseudo</label>
                                <input 
                                    type="text" 
                                    name="pseudo" 
                                    className="input-field" 
                                    value={formData.pseudo} 
                                    onChange={handleInputChange} 
                                    required
                                />
                            </div>

                            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                                <button type="submit" className="btn btn-primary">
                                    Enregistrer le profil
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="card" style={{ marginBottom: 0 }}>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Sécurité</h2>
                        <form onSubmit={handleChangePassword}>
                            <div className="input-group">
                                <label className="text-label">Nouveau Mot de passe</label>
                                <input 
                                    type="password" 
                                    className="input-field" 
                                    placeholder="••••••••" 
                                    value={newPassword} 
                                    onChange={(e) => setNewPassword(e.target.value)} 
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label className="text-label">Confirmer le Mot de passe</label>
                                <input 
                                    type="password" 
                                    className="input-field" 
                                    placeholder="••••••••" 
                                    value={confirmPassword} 
                                    onChange={(e) => setConfirmPassword(e.target.value)} 
                                    required
                                />
                            </div>

                            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                                <button type="submit" className="btn btn-primary" style={{ backgroundColor: 'var(--color-text-main)' }}>
                                    Modifier le mot de passe
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* --- COLONNE DROITE --- */}
                <div className="card" style={{ marginBottom: 0, height: 'fit-content' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Tournois que je suis</h2>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                        {tournamentData && tournamentData.length > 0 ? (
                            tournamentData.map((tournament, index) => (
                                <div 
                                    key={tournament._id || index} 
                                    style={{ 
                                        padding: 'var(--spacing-md)', 
                                        border: '1px solid var(--color-border)', 
                                        borderRadius: 'var(--radius-sm)', 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center',
                                        backgroundColor: 'var(--color-background)',
                                        transition: 'border-color 0.2s ease',
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
                                >
                                    <div>
                                        <div className="text-body" style={{ fontWeight: 600 }}>{tournament.name || "Nom du tournoi"}</div>
                                        <div className="text-label" style={{ marginTop: '2px' }}>{tournament.date || "Date à définir"}</div>
                                    </div>
                                    
                                    <span className="badge badge-accent">
                                        {tournament.status || "En cours"}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                                <p className="text-label">Vous ne suivez aucun tournoi pour le moment.</p>
                                <Link to="/tournaments" className="btn btn-primary" style={{ marginTop: '1rem', textDecoration: 'none' }}>
                                    Découvrir des tournois
                                </Link>
                            </div>
                        )}
                    </div>

                </div>
                <div >
                        <Link to="/" className="btn btn-secondary" style={{ textDecoration: 'none' }}onClick={logout}>
                            Déconnexion
                        </Link>
                    </div>
            </div>
        </div>
    );
}