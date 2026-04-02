
import { API_URL ,getAuthHeaders} from './api';

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
export const setAuth = async (pseudo,mail,mdp,birthday) => {
    try {

        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json', 
            },

            body: JSON.stringify({ pseudo, mail, mdp ,birthday}),
        });

        const data = await response.json();
        return data; 
        
    } catch (error) {
        console.error("Erreur lors de la création d'un compte:", error);
        throw error; 
    }
};


export const connectAuth = async (mail,mdp) => {
    try {

        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json', 
            },

            body: JSON.stringify( {mail , mdp} ),
        });

        if (!response.ok) {
            throw new Error("Identifiants incorrects");
        }

        const data = await response.json();
        
        if (response.ok && data.token) {
            localStorage.setItem('token', data.token); // On le sauvegarde dans le navigateur
        }

        return data; 
        
    } catch (error) {
        console.error("Erreur lors de la connexion du compte:", error);
        throw error; 
    }
};
// PATCH
export const updateAuth = async (id, data) => {
    try {
        const response = await fetch(`${API_URL}/auth/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message || "Erreur lors de la mise à jour du compte.");
        }
        return result;

    } catch (error) {
        console.error("Erreur lors de la mise à jour du compte:", error);
        throw error;
    }
};

export const changePassword = async (id, newMdp) => {
    try {
        const response = await fetch(`${API_URL}/auth/${id}`, {
            method: 'PATCH', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ mdp: newMdp }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Erreur lors de la mise à jour du mot de passe.");
        }
        return data;

    } catch (error) {
        console.error("Erreur lors de la mise à jour du mot de passe:", error);
        throw error;
    }
};

// PUT


// DELETE



export const logoutUser = () => {
    localStorage.removeItem('token'); // On détruit le token
};