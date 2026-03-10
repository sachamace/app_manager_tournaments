// frontend/src/services/teams.js
import { API_URL } from './api';


// GET 
export const fetchAllTeams = async () => {
    try {
        const response = await fetch(`${API_URL}/teams`);
        const data = await response.json();
        return data; // Retourne le tableau de vos tournois
    } catch (error) {
        console.error("Erreur lors de la récupération des tournois:", error);
        return [];
    }
};

export const getTeam = async (id) => {
    try {
        const response = await fetch(`${API_URL}/teams/${id}`);
        
        if (!response.ok) {
            throw new Error("Team introuvable");
        }
        
        const data = await response.json();
        return data; 
    } catch (error) {
        console.error("Erreur lors de la récupération de la team:", error);
        return null;
    }
};

export const getHistoricalMatches = async (id) => {
    try {
        const response = await fetch(`${API_URL}/teams/matches/${id}`);
        
        if (!response.ok) {
            throw new Error("Historique introuvable");
        }
        
        const data = await response.json();
        return data; 
    } catch (error) {
        console.error("Erreur lors de la récupération de l'historique:", error);
        return null;
    }
};

export const getPlayerInTeam = async (id) => {
    try {
        const response = await fetch(`${API_URL}/teams/players/${id}`);
        
        if (!response.ok) {
            throw new Error("Player introuvable");
        }
        
        const data = await response.json();
        return data; 
    } catch (error) {
        console.error("Erreur lors de la récupération du joueur:", error);
        return null;
    }
};

export const getCaptainTeam = async (id) => {
    try {
        const response = await fetch(`${API_URL}/teams/captain/${id}`);
        
        if (!response.ok) {
            throw new Error("Captain introuvable");
        }
        
        const data = await response.json();
        return data; 
    } catch (error) {
        console.error("Erreur lors de la récupération du capitaine:", error);
        return null;
    }
};

// POST 

export const createTeam = async (teamsData) => {
    try {

        const response = await fetch(`${API_URL}/teams`, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json', 
            },

            body: JSON.stringify(teamsData),
        });

        const data = await response.json();
        return data; 
        
    } catch (error) {
        console.error("Erreur lors de la création de la team:", error);
        throw error; 
    }
};

export const addPlayerInTeam = async (id) => {
    try {

        const response = await fetch(`${API_URL}/teams/players/${id}`, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json', 
            },

            body: JSON.stringify(id),
        });

        const data = await response.json();
        return data; 
        
    } catch (error) {
        console.error("Erreur lors de la création de la team:", error);
        throw error; 
    }
};

export const addCaptainInTeam = async (id) => {
    try {

        const response = await fetch(`${API_URL}/teams/captain/${id}`, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json', 
            },

            body: JSON.stringify(id),
        });

        const data = await response.json();
        return data; 
        
    } catch (error) {
        console.error("Erreur lors de la création de la team:", error);
        throw error; 
    }
};