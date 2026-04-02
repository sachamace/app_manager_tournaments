export const API_URL = "http://localhost:5000";

export const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    
    // On prépare les headers de base
    const headers = {
        'Content-Type': 'application/json',
    };

    // Si l'utilisateur est connecté (token présent), on l'ajoute !
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
};