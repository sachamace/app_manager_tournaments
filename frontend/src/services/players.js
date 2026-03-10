// frontend/src/services/tournaments.js
import { API_URL } from './api';

// GET 
export const fetchAllPlayers = async () => {
    try {
        const response = await fetch(`${API_URL}/players`);
        const data = await response.json();
        return data; // Retourne le tableau de vos tournois
    } catch (error) {
        console.error("Erreur lors de la récupération des tournois:", error);
        return [];
    }
};

export const getPlayer = async (id) => {
    try {
        const response = await fetch(`${API_URL}/players/${id}`);
        
        if (!response.ok) {
            throw new Error("Joueur introuvable");
        }
        
        const data = await response.json();
        return data; 
    } catch (error) {
        console.error("Erreur lors de la récupération du joueur:", error);
        return null;
    }
};

// POST 

export const createPlayer = async (playerData) => {
    try {

        const response = await fetch(`${API_URL}/players`, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json', 
            },

            body: JSON.stringify(playerData),
        });

        const data = await response.json();
        return data; 
        
    } catch (error) {
        console.error("Erreur lors de la création du joueur:", error);
        throw error; 
    }
};

// PATCH

