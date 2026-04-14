import { Outlet ,Link, useNavigate } from 'react-router-dom';
import { useContext ,useState, useEffect} from 'react';
import { AuthContext } from '../context/AuthContext';
import '../assets/css/index.css';

export default function Header() {
    const {user} = useContext(AuthContext);
    // Système du white/dark mode

    const [isLightMode, setIsLightMode] = useState(() => {
        return localStorage.getItem('theme') === 'light';
    });
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem('theme') === 'dark';
    });

    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add('dark-mode'); 
            localStorage.setItem('theme', 'dark');    
        } else {
            document.body.classList.remove('dark-mode'); 
            localStorage.setItem('theme', 'light');        
        }
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode); 
    };

    return (
        <div className="app-layout">
        
        {/* --- SIDEBAR (Barre de gauche) --- */}
        <aside className="sidebar">
            <div style={{ fontWeight: 'bold', fontSize: '20px', marginBottom: '2rem' }}>
                TournoisManager
            </div>
            
            {/* Navigation */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px', flexGrow: 1 }}>
                <Link to="/" className="btn btn-primary">Accueil</Link>
                {user?(
                    <>
                        <Link to="/tournaments" className="btn btn-primary">Mes Tournois</Link>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="btn btn-primary">Se connecter</Link>
                    </>
                )}
            </nav>

            {user ? (
                <Link to="/tournament/create" className="btn btn-primary">Créer un tournoi</Link>
            ):(
                <>
                    <Link to="/login" className="btn btn-primary">Se connecter</Link>
                </>
            )}

        </aside>

        {/* --- BLOC DE DROITE --- */}
        <div className="main-wrapper">
            
            {/* TOP HEADER (En-tête) */}
            {}
            <header className="top-header">
            <button 
                onClick={toggleTheme} 
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', marginRight: '15px' }}
                title={isDarkMode ? "Passer en mode clair" : "Passer en mode sombre"}
            >
                {isDarkMode ? '☀️' : '🌙'}
            </button>
            {user ? (
                // Coté connecté 
                <>
                    <div className="user-profile">
                        <Link to="/account" className='btn btn-primary'>Mon Profil</Link>
                    </div>
                </>
            ):(
                // Coté non connecté
                <>
                    <div>
                        <Link to="/login" className='btn btn-primary'>Se connecter</Link>
                        <Link to="/register" className='btn btn-primary'>S'inscrire</Link>
                    </div>

                </>
            )}

            </header>

            {/* CONTENU DE LA PAGE */}
            <main className="page-content">
            <Outlet /> {/* <-- C'est ici que React-Router va afficher la bonne page */}
            </main>
            
        </div>
        </div>
    );
}
