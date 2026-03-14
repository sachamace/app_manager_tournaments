
import { useState, useContext } from 'react';
import { connectAuth } from '../services/auth'; // Le Service
import { AuthContext } from '../context/AuthContext'; // La mémoire
import '../assets/css/index.css';
export default function Login() {

    const [mail, setMail] = useState('');
    const [mdp, setMdp] = useState('');
    
    const { login } = useContext(AuthContext);


    const handleSubmit = async (e) => {
        e.preventDefault(); 

        try {

            const reponseBackend = await connectAuth({ mail, mdp });
            
            login(reponseBackend.login); 
            
            alert("Connexion réussie ! Bienvenue.");

            

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
                // 2. On lie la valeur à la variable React
                value={mail}
                // 3. À chaque touche tapée, on met à jour la variable
                onChange={(e) => setMail(e.target.value)} 
            />
          </div>
          
          <div className="form-group">
            <label>Mot de passe</label>
            <input 
                type="password" 
                className="form-input" 
                placeholder="••••••••" 
                // 2. On lie la valeur à la variable React
                value={mdp}
                // 3. À chaque touche tapée, on met à jour la variable
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