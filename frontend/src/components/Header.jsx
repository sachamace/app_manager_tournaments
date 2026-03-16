
import { Link, useNavigate } from 'react-router-dom';
import { useContext ,useState, useEffect} from 'react';
import { AuthContext } from '../context/AuthContext';
import '../assets/css/index.css';

export default function Header() {

    // On appelle notre mémoire globale !
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate(); 

    const [isLightMode, setIsLightMode] = useState(() => {
        return localStorage.getItem('theme') === 'light';
    });

    useEffect(() => {
        if (isLightMode) {
            document.body.classList.add('light-mode'); 
            localStorage.setItem('theme', 'light');    
        } else {
            document.body.classList.remove('light-mode'); 
            localStorage.setItem('theme', 'dark');        
        }
    }, [isLightMode]);

    const toggleTheme = () => {
        setIsLightMode(!isLightMode); 
    };

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

                    <button 
                        onClick={toggleTheme} 
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                            marginRight: '15px',
                        }}
                        title={isLightMode ? "Passer en mode sombre" : "Passer en mode clair"}
                    >
                        {isLightMode ? '🌙' : '☀️'}
                    </button>

                    {user ? (
                        // SI CONNECTÉ : On affiche son pseudo et le bouton déconnexion
                        <>
                            <Link to="/account" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
                                <span >Salut, <strong>{user.pseudo}</strong></span>
                            </Link>
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
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <Link 
                                to="/login" 
                                className="btn-primary" 
                                style={{ padding: '8px 16px', fontSize: '0.9rem', textDecoration: 'none', textAlign : 'center' ,  }}
                            >
                                Se connecter
                            </Link>

                            <Link 
                                to="/register" 
                                className="btn-primary" 
                                style={{ padding: '8px 16px', fontSize: '0.9rem', textDecoration: 'none' , textAlign : 'center'}}
                            >
                                Création de compte
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}