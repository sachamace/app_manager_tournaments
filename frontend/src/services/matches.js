// frontend/src/services/tournaments.js
import { API_URL } from './api';
// GET
export const fetchAllMatches = async () => {
    try {
        const response = await fetch(`${API_URL}/matches`);
        const data = await response.json();
        return data; // Retourne le tableau de vos tournois
    } catch (error) {
        console.error("Erreur lors de la récupération des tournois:", error);
        return [];
    }
};

// POST 


// PATCH 
export const updateMatchScore = async (matchId, newScores) => {
    try {
        // 1. On met l'ID dans l'URL
        const response = await fetch(`${API_URL}/matches/${matchId}`, {
            method: 'PATCH', // 2. On indique qu'on veut MODIFIER
            headers: {
                'Content-Type': 'application/json',
            },
            // 3. On envoie les nouvelles données dans le body
            body: JSON.stringify({ scores: newScores }), 
        });

        const data = await response.json();
        return data; 
        
    } catch (error) {
        console.error("Erreur lors de la mise à jour du score:", error);
        throw error;
    }
};

// PUT 

// DELETE
