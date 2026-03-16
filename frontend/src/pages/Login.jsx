
import { useState, useContext } from 'react';
import { connectAuth } from '../services/auth'; // Le Service
import { AuthContext } from '../context/AuthContext'; // La mémoire
import { useNavigate } from 'react-router-dom';
import '../assets/css/index.css';
export default function Login() {

    const [mail, setMail] = useState('');
    const [mdp, setMdp] = useState('');
    
    const { login } = useContext(AuthContext);

    const navigate = useNavigate();
    const handleSubmit = async (e) => {
      e.preventDefault()
      try {
        const reponseBackend = await connectAuth( mail, mdp );

        login(reponseBackend.user); 

        alert("Connexion réussie ! Bienvenue.");

        navigate('/tournaments');
      } catch (error) {
        alert("Erreur : Mauvais mail ou mot de passe.");
      }
    };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Connexion</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Adresse Email</label>
            <input 
                type="email" 
                className="form-input" 
                placeholder="test@gmail.com" 

                value={mail}

                onChange={(e) => setMail(e.target.value)} 
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
            />
          </div>
          
          <button type="submit" className="btn-primary">
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}