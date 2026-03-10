// frontend/src/services/tournaments.js
import { API_URL } from './api';

export const fetchAllAuth = async () => {
    try {
        const response = await fetch(`${API_URL}/auth`);
        const data = await response.json();
        return data; // Retourne le tableau de vos tournois
    } catch (error) {
        console.error("Erreur lors de la récupération des tournois:", error);
        return [];
    }
};