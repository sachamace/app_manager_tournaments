import { useState, useContext } from 'react';
import { connectAuth } from '../services/auth';
import { AuthContext } from '../context/AuthContext';
import { useNavigate , Link} from 'react-router-dom';
import '../assets/css/index.css';


export default  function Login(){
  const [mail, setMail] = useState('');
  const [mdp, setMdp] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const reponseBackend = await connectAuth(mail, mdp);
      login(reponseBackend.user);
      alert('Connexion réussie ! Bienvenue.');
      navigate('/tournaments');
    } catch (error) {
      alert('Erreur : Mauvais mail ou mot de passe.');
    }
  };

  return (
    <div className="auth-page-container">
      <div className="card auth-card">
        <h1 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.75rem' }}>
          Se connecter
        </h1>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="text-label" htmlFor="email">Adresse Email</label>
            <input 
                type="email" 
                name="email" 
                id="email"
                className="input-field" 
                placeholder="ex: jean.dupont@email.com"
                value={mail}
                onChange={(e) => setMail(e.target.value)}
                required
            />
          </div>

          <div className="input-group" style={{ marginBottom: 'var(--spacing-sm)' }}>
            <label className="text-label" htmlFor="password">Mot de passe</label>
            <input 
                type="password" 
                name="password" 
                id="password"
                className="input-field" 
                placeholder="••••••••" 
                value={mdp}
                onChange={(e) => setMdp(e.target.value)}
                required
            />
          </div>

          <div style={{ textAlign: 'right', marginBottom: 'var(--spacing-md)' }}>
            <Link to="/forgot-password" style={{ color: 'var(--color-primary)', fontSize: '14px', textDecoration: 'none' }}>
              Mot de passe oublié ?
            </Link>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
              Se connecter
            </button>
          </div>
        </form>

        <div style={{ textAlign: 'center', marginTop: 'var(--spacing-lg)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--spacing-md)' }}>
          <p className="text-body" style={{ color: 'var(--color-text-muted)' }}>
            Pas encore de compte ?{' '}
            <Link to="/register" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 500 }}>
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};