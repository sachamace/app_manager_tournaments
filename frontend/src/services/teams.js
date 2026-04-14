
import { API_URL ,getAuthHeaders} from './api';


// GET 
export const fetchAllTeams = async () => {
    try {
        const response = await fetch(`${API_URL}/teams`);
        const data = await response.json();
        return data; 
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
            headers: getAuthHeaders(),

            body: JSON.stringify(teamsData),
        });

        const data = await response.json();
        return data; 
        
    } catch (error) {
        console.error("Erreur lors de la création de la team:", error);
        throw error; 
    }
};
 

// PATCH
export const updateTeam = async (id, teamData) => {
    try {
        const response = await fetch(`${API_URL}/teams/${id}`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify(teamData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erreur lors de la mise à jour de l'équipe.");
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'équipe:", error);
        throw error;
    }
};

// Delete
export const deleteTeam = async (id) => {
    try {
        const response = await fetch(`${API_URL}/teams/${id}`,{
            method: 'DELETE', 
            headers: getAuthHeaders(),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erreur lors de la suppression de l'équipe.");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Erreur lors de la suppression de l'équipe:", error);
        throw error;
    }
}
