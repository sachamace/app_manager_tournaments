
import { useState, useContext } from 'react';
import { connectAuth, setAuth } from '../services/auth'; // Le Service
import { AuthContext } from '../context/AuthContext'; // La mémoire
import '../assets/css/index.css';
import '../assets/js/date.js';
export default function Register() {

    const [mail, setMail] = useState('');
    const [mdp, setMdp] = useState('');
    const [pseudo, setPseudo] = useState('');
    const [birthday, setBirthday] = useState('');

    const { login } = useContext(AuthContext);


    const handleSubmit = async (e) => {
        e.preventDefault(); 

        try {

            const reponseSet = await setAuth({pseudo,mail,mdp,birthday});

            const reponseBackend = await connectAuth({ mail, mdp });
            
            login(reponseBackend.user); 

            alert("Création de compte réussie ! Bienvenue.");

            window.location.href = "/";

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
                        // 2. On lie la valeur à la variable React
                        value={pseudo}
                        // 3. À chaque touche tapée, on met à jour la variable
                        onChange={(e) => setPseudo(e.target.value)} 
                    />
                </div>
                
                <div className="form-group">
                    <label>Adresse Mail</label>
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

                <div className="form-group">
                    <label>Birthdate</label>
                    <input 
                        type="date" 
                        className="form-input" 
                        // 2. On lie la valeur à la variable React
                        value={birthdate}
                        // 3. À chaque touche tapée, on met à jour la variable
                        onChange={(e) => setBirthday(e.target.value)} 
                    />
                </div>
                <button type="submit" className="btn-primary">
                Sign in
                </button>
            </form>
        </div>
    </div>
  );
}