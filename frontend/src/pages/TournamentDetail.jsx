import { useState, useEffect } from 'react';
import { getTournamentById } from '../services/tournaments';
import { useParams } from 'react-router-dom';
import '../assets/css/index.css';
export default function TournamentDetail() {
    // 2. On extrait l'ID qui est dans l'URL ! (il s'appelle 'id' car on a mis ':id' dans App.jsx)
    const { id } = useParams(); 

    // 3. Attention : On initialise à "null", pas à "[]", car on récupère UN SEUL objet, pas une liste.
    const [tournament, setTournament] = useState(null);

    useEffect(() => {
        const loadTournament = async () => {
            // 4. On donne l'ID à notre service ("facteur") !
            const data = await getTournamentById(id); 
            setTournament(data);
        };
        
        loadTournament();
    }, [id]); // On met "id" ici pour dire à React de recharger si l'ID dans l'URL change

    // Si les données ne sont pas encore arrivées
    if (!tournament) {
        return <div className="page-container"><p>⏳ Chargement des détails...</p></div>;
    }
  return (
    <div className="page-container">
      
        <div className="detail-header-card">
            <div>
                <h1 style={{margin: 0, color: 'var(--accent-color)'}}>{tournament.games}</h1>
                <p style={{color: 'var(--text-muted)'}}>Format : {tournament.tree_type}</p>
            </div>
            <button className="btn-danger">Supprimer le tournoi</button>
        </div>

    </div>
  );
}