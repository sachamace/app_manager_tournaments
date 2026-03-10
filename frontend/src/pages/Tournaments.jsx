// frontend/src/pages/Tournaments.jsx
import { useState, useEffect } from 'react';
import { fetchAllTournaments } from '../services/tournaments';

export default function Tournaments() {
    // 1. On crée une variable d'état 'tournaments' (vide au départ)
    const [tournaments, setTournaments] = useState([]);

    // 2. Ce code s'exécute une seule fois au chargement du composant
    useEffect(() => {
        const loadTournaments = async () => {
            const data = await fetchAllTournaments();
            setTournaments(data); // On sauvegarde les données reçues dans l'état
        };
        
        loadTournaments();
    }, []); // Le tableau vide [] signifie "exécute ceci uniquement au montage de la page"

    // 3. On affiche le HTML (JSX)
    return (
        <div>
            <h1>Liste de mes Tournois</h1>
            
            {/* Si on n'a pas encore de données, on affiche un message */}
            {tournaments.length === 0 ? (
                <p>Chargement des tournois...</p>
            ) : (
                // Sinon, on boucle sur notre tableau pour afficher chaque tournoi
                <ul>
                    {tournaments.map((tournament) => (
                        <li key={tournament._id} style={{ border: '1px solid gray', margin: '10px', padding: '10px' }}>
                            <h3>Jeu : {tournament.games}</h3>
                            <p>Format : {tournament.tree_type}</p>
                            <p>Statut : {tournament.statut}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}