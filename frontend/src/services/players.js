
import { API_URL ,getAuthHeaders} from './api';

// GET 
export const fetchAllPlayers = async () => {
    try {
        const response = await fetch(`${API_URL}/players`);
        const data = await response.json();
        return data; 
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
            headers: getAuthHeaders(),

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

export const updatePseudo = async (id,newPseudo) => {
    try {
        // 1. On met l'ID dans l'URL
        const response = await fetch(`${API_URL}/players/pseudo/${id}`, {
            method: 'PATCH', // 2. On indique qu'on veut MODIFIER
            headers: getAuthHeaders(),
            // 3. On envoie les nouvelles données dans le body
            body: JSON.stringify({ pseudo: newPseudo }), 
        });

        const data = await response.json();
        return data; 
        
    } catch (error) {
        console.error("Erreur lors de la mise à jour du joueur:", error);
        throw error;
    }
};

export const updateTeam = async (id,newTeam) => {
    try {
        // 1. On met l'ID dans l'URL
        const response = await fetch(`${API_URL}/players/teams/${id}`, {
            method: 'PATCH', // 2. On indique qu'on veut MODIFIER
            headers: getAuthHeaders(),
            // 3. On envoie les nouvelles données dans le body
            body: JSON.stringify({ team: newTeam }), 
        });

        const data = await response.json();
        return data; 
        
    } catch (error) {
        console.error("Erreur lors de la mise à jour du joueur:", error);
        throw error;
    }
};

// DELETE 

export const deletePlayer = async (id) => {
    try {
        const response = await fetch(`${API_URL}/players/${id}`, {
            method: 'DELETE', 
            headers: getAuthHeaders(),
        });
        
        const data = await response.json();
        return data; 
    } catch (error) {
        console.error("Erreur lors de la suppression du joueur:", error);
        throw error;
    }
};


// PUT 
export const updatePlayer = async (id, newPseudo, newTeam) => {
    try {
        // 1. On met l'ID dans l'URL
        const response = await fetch(`${API_URL}/players/${id}`, {
            method: 'PUT', // 2. On indique qu'on veut MODIFIER
            headers: {
                'Content-Type': 'application/json',
            },
            // 3. On envoie les nouvelles données dans le body
            body: JSON.stringify({pseudo: newPseudo, team: newTeam }), 
        });

        const data = await response.json();
        return data; 
        
    } catch (error) {
        console.error("Erreur lors de la mise à jour du joueur:", error);
        throw error;
    }
};

