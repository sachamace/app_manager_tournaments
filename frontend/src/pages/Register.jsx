
import { useState} from 'react';
import { setAuth } from '../services/auth'; // Le Service
import { useNavigate } from 'react-router-dom';
import '../assets/css/index.css';
//import '../assets/js/date.js';
export default function Register() {

    const [mail, setMail] = useState('');
    const [mdp, setMdp] = useState('');
    const [pseudo, setPseudo] = useState('');
    const [birthday, setBirthday] = useState('');

    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            
            const reponseBackend = await setAuth(pseudo, mail, mdp,birthday);
            
            // Si le backend répond positivement :
            alert("Compte créé avec succès !");
            navigate('/login'); // On renvoie l'utilisateur vers la connexion

        } catch (error) {
            alert("Erreur : Création de compte incorrect !");
        }
    };

  return (
    <div className="auth-wrapper">
        <div className="auth-card">
            <h2>Register</h2>
        
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Pseudo</label>
                    <input 
                        type="test" 
                        className="form-input" 
                        placeholder="dada" 
                        value={pseudo}
                        onChange={(e) => setPseudo(e.target.value)} 
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label>Adresse Mail</label>
                    <input 
                        type="email" 
                        className="form-input" 
                        placeholder="test@gmail.com" 
                        value={mail}
                        onChange={(e) => setMail(e.target.value)} 
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Birthdate</label>
                    <input 
                        type="date" 
                        className="form-input" 
                        value={birthday}
                        onChange={(e) => setBirthday(e.target.value)} 
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Mot de passe</label>
                    <input 
                        type="password" 
                        className="form-input" 
                        placeholder="••••••••" 
                        value={mdp}
                        onChange={(e) => setMdp(e.target.value)} 
                        required
                    />
                </div>


                <button type="submit" className="btn-primary">
                    S'inscrire
                </button>
            </form>
        </div>
    </div>
  );
}