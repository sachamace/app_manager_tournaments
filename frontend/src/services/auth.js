
import { API_URL } from './api';

// GET
export const fetchAllAuth = async () => {
    try {
        const response = await fetch(`${API_URL}/auth`);
        const data = await response.json();
        return data; 
    } catch (error) {
        console.error("Erreur lors de la récupération des tournois:", error);
        return [];
    }
};

export const fetchOneAuth = async (id) => {
    try {
        const response = await fetch(`${API_URL}/auth/${id}`);
        
        if (!response.ok) {
            throw new Error("L'utilisateur est introuvable");
        }
        
        const data = await response.json();
        return data; 
    } catch (error) {
        console.error("Erreur lors de la récupération des auths:", error);
        return null;
    }
};

// POST
export const setAuth = async (pseudo,email,birthday,mdp) => {
    try {

        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json', 
            },

            body: JSON.stringify(pseudo,email,birthday,mdp),
        });

        const data = await response.json();
        return data; 
        
    } catch (error) {
        console.error("Erreur lors de la création d'un compte:", error);
        throw error; 
    }
};


export const connectAuth = async (login,mdp) => {
    try {

        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json', 
            },

            body: JSON.stringify(login,mdp),
        });

        const data = await response.json();
        return data; 
        
    } catch (error) {
        console.error("Erreur lors de la connexion du compte:", error);
        throw error; 
    }
};
// PATCH
export const changePassword = async (id,newMdp) => {
    try {
        // 1. On met l'ID dans l'URL
        const response = await fetch(`${API_URL}/players/pseudo/${id}`, {
            method: 'PATCH', // 2. On indique qu'on veut MODIFIER
            headers: {
                'Content-Type': 'application/json',
            },
            // 3. On envoie les nouvelles données dans le body
            body: JSON.stringify({ mdp: newMdp }), 
        });

        const data = await response.json();
        return data; 
        
    } catch (error) {
        console.error("Erreur lors de la mise à jour du mot de pase:", error);
        throw error;
    }
};

// PUT


// DELETE