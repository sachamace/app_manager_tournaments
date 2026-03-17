
import { API_URL } from './api';


// GET 
export const fetchAllTournaments = async () => {
    try {
        const response = await fetch(`${API_URL}/tournaments`);
        const data = await response.json();
        return data; 
    } catch (error) {
        console.error("Erreur lors de la récupération des tournois:", error);
        return [];
    }
};


export const fetchMyTournaments = async (accountId) => {
    const response = await fetch(`${API_URL}/tournaments/account/${accountId}`);
    const data = await response.json();
    return data;
};

export const getTournamentById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/tournaments/${id}`);
        
        if (!response.ok) {
            throw new Error("Tournoi introuvable");
        }
        
        const data = await response.json();
        return data; 
    } catch (error) {
        console.error("Erreur lors de la récupération du tournoi:", error);
        return null;
    }
};

export const getBracket = async (id) => {
    try {
        const response = await fetch(`${API_URL}/tournaments/${id}/bracket`);
        
        if (!response.ok) {
            throw new Error("Tournoi introuvable");
        }
        
        const data = await response.json();
        return data; 
    } catch (error) {
        console.error("Erreur lors de la récupération du tournoi:", error);
        return null;
    }
};

export const getTeamsRegister = async (id) => {
    try {

        const response = await fetch(`${API_URL}/tournaments/${id}/participants`);
        
        if (!response.ok) {
            throw new Error("Tournoi introuvable");
        }
        
        const data = await response.json();
        return data;  
    } catch (error) {
        console.error("Erreur lors de la récupération du tournoi:", error);
        return null;
    }
};
export const getRanking = async (id) => {
    try {

        const response = await fetch(`${API_URL}/tournaments/${id}/standings`);
        
        if (!response.ok) {
            throw new Error("Tournoi introuvable");
        }
        
        const data = await response.json();
        return data; 
    } catch (error) {
        console.error("Erreur lors de la récupération du tournoi:", error);
        return null;
    }
};

// POST 
export const addTournament = async (tournamentData) => {
    try {

        const response = await fetch(`${API_URL}/tournaments`, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json', 
            },

            body: JSON.stringify(tournamentData),
        });

        const data = await response.json();
        return data; 
        
    } catch (error) {
        console.error("Erreur lors de la création du tournoi:", error);
        throw error; 
    }
};

export const addTeamsAtTournament = async (tournamentid,teamID) => {
    try {

        const response = await fetch(`${API_URL}/tournaments/${tournamentid}/participants`, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json', 
            },

            body: JSON.stringify(teamID),
        });


        const data = await response.json();
        return data; 
        
    } catch (error) {
        console.error("Erreur lors de la création du tournoi:", error);
        throw error; 
    }
};

export const startTournament = async (id) => {
    try {

        const response = await fetch(`${API_URL}/tournaments/${id}/start`, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json', 
            },

            body: JSON.stringify(id),
        });


        const data = await response.json();
        return data; 
        
    } catch (error) {
        console.error("Erreur lors de la création du tournoi:", error);
        throw error; 
    }
};

export const cancelTournament = async (id) => {
    try {

        const response = await fetch(`${API_URL}/tournaments/${id}/reset`, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json', 
            },

            body: JSON.stringify(id),
        });


        const data = await response.json();
        return data; 
        
    } catch (error) {
        console.error("Erreur lors de la création du tournoi:", error);
        throw error; 
    }
};

export const nextRoundMatchesToCreate = async (id) => {
    try {

        const response = await fetch(`${API_URL}/tournaments/${id}/next-round`, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json', 
            },

            body: JSON.stringify(id),
        });


        const data = await response.json();
        return data; 
        
    } catch (error) {
        console.error("Erreur lors de la création du tournoi:", error);
        throw error; 
    }
};


// DELETE 

export const deleteTournament = async (id) => {
    try {
        const response = await fetch(`${API_URL}/tournaments/${id}`, {
            method: 'DELETE', 
        });
        
        const data = await response.json();
        return data; 
    } catch (error) {
        console.error("Erreur lors de la suppression du tournoi:", error);
        throw error;
    }
};
