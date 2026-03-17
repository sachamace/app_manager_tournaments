import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { fetchOneAuth, updateAuth, changePassword } from '../services/auth';
import { Link } from 'react-router-dom';
import '../assets/css/index.css';

export default function Account() {
    const { user, logout } = useContext(AuthContext);

    const [userData, setUserData] = useState(null);
    const [formData, setFormData] = useState({ pseudo: '', birthday: '' });
    const [isEditing, setIsEditing] = useState(false);
    
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [message, setMessage] = useState({ type: '', content: '' });

    useEffect(() => {
        const loadUserData = async () => {
            if (user && user._id) {
                try {
                    const data = await fetchOneAuth(user._id);
                    setUserData(data);
                    setFormData({
                        pseudo: data.pseudo,
                        birthday: data.birthday ? new Date(data.birthday).toISOString().split('T')[0] : ''
                    });
                } catch (error) {
                    setMessage({ type: 'error', content: "Erreur lors de la récupération des données du compte." });
                }
            }
        };
        
        loadUserData();
    }, [user]);

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


    if (!user) {
        return (
            <div className="page-container" style={{ textAlign: 'center' }}>
                <h1 className="page-title">Mon Compte</h1>
                <p style={{ color: 'var(--text-muted)' }}>
                    Vous devez être connecté pour voir cette page.
                </p>
                <Link to="/login" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block', marginTop: '20px' }}>
                    Se connecter
                </Link>
            </div>
        );
    }

    if (!userData) {
        return <div className="page-container">Chargement...</div>;
    }

    return (
        <div className="page-container account-container">
            <h1 className="page-title">Mon Compte</h1>

            {message.content && (
                <div className={`message ${message.type === 'error' ? 'message-error' : 'message-success'}`}>
                    {message.content}
                </div>
            )}

            <div className="account-card">
                <h2>Informations du profil</h2>
                {!isEditing ? (
                    <>
                        <p><strong>Pseudo :</strong> {userData.pseudo}</p>
                        <p><strong>Email :</strong> {userData.mail}</p>
                        <p><strong>Date de naissance :</strong> {userData.birthday ? new Date(userData.birthday).toLocaleDateString() : 'Non renseignée'}</p>
                        <button onClick={() => setIsEditing(true)} className="btn-primary" style={{ marginTop: '20px' }}>Modifier le profil</button>
                    </>
                ) : (
                    <form onSubmit={handleUpdate}>
                        <div className="form-group">
                            <label htmlFor="pseudo">Pseudo</label>
                            <input type="text" id="pseudo" name="pseudo" className="form-input" value={formData.pseudo} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="mail">Email</label>
                            <input type="email" id="mail" name="mail" className="form-input" value={userData.mail} disabled />
                            <small>L'email ne peut pas être modifié.</small>
                        </div>
                        <div className="form-group">
                            <label htmlFor="birthday">Date de naissance</label>
                            <input type="date" id="birthday" name="birthday" className="form-input" value={formData.birthday} onChange={handleInputChange} />
                        </div>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                            <button type="submit" className="btn-primary">Enregistrer</button>
                            <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary">Annuler</button>
                        </div>
                    </form>
                )}
            </div>

            <div className="account-card">
                <h2>Changer le mot de passe</h2>
                <form onSubmit={handleChangePassword}>
                    <div className="form-group">
                        <label htmlFor="newPassword">Nouveau mot de passe</label>
                        <input type="password" id="newPassword" className="form-input" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                        <input type="password" id="confirmPassword" className="form-input" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn-primary" style={{ marginTop: '20px' }}>Changer le mot de passe</button>
                </form>
            </div>
            
            <div className="account-card" style={{ borderColor: 'var(--danger)' }}>
                <h2>Zone de danger</h2>
                <p>La déconnexion mettra fin à votre session actuelle.</p>
                <button onClick={logout} className="btn-danger" style={{ marginTop: '10px' }}>
                    Déconnexion
                </button>
            </div>
        </div>
    );
}

