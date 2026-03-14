// frontend/src/components/Header.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../assets/css/index.css';
export default function Header() {
    // On appelle notre mémoire globale !
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate(); // Permet de rediriger l'utilisateur après une action

    const handleLogout = () => {
        logout(); // On vide le Context et le LocalStorage
        navigate('/login'); // On renvoie l'utilisateur vers la page de connexion
    };

    return (
        <header className="main-header">
            <div className="header-container">
                {/* 1. Le Logo / Titre (qui ramène à l'accueil) */}
                <Link to="/tournaments" className="header-logo">
                    🏆 TournoiManager
                </Link>
                

                {/* 3. La zone Utilisateur (Dynamique !) */}
                <div className="header-auth">
                    {user ? (
                        // SI CONNECTÉ : On affiche son pseudo et le bouton déconnexion
                        <>
                            <span style={{ color: 'var(--text-muted)' }}>Salut, <strong>{user.pseudo}</strong></span>
                            <button 
                                onClick={handleLogout} 
                                className="btn-danger" 
                                style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                            >
                                Déconnexion
                            </button>
                        </>
                    ) : (
                        // SI NON CONNECTÉ : On affiche le bouton pour se connecter
                        <Link 
                            to="/login" 
                            className="btn-primary" 
                            style={{ padding: '8px 16px', fontSize: '0.9rem', textDecoration: 'none' }}
                        >
                            Se connecter
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}