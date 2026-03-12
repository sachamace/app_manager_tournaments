import { createContext, useState, useEffect } from 'react';

// 1. Création du contexte
export const AuthContext = createContext();

// 2. Création du composant Provider (le "fournisseur" de données)
export const AuthProvider = ({ children }) => {
    // On stocke l'utilisateur ici (null = non connecté au départ)
    const [user, setUser] = useState(null);

    // Au chargement du site, on vérifie si l'utilisateur était déjà connecté avant 
    // (en regardant dans le localStorage du navigateur)
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Fonction pour se connecter
    const login = (userData) => {
        setUser(userData);
        // On sauvegarde dans le navigateur pour ne pas le perdre au rafraîchissement
        localStorage.setItem('user', JSON.stringify(userData)); 
    };

    // Fonction pour se déconnecter
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    // On rend ces données et fonctions disponibles pour tout le reste de l'application
    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};