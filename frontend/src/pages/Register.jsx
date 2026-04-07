import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/index.css';// Importe ton CSS global

export default function Register()  {

  const [mail, setMail] = useState('');
  const [mdp, setMdp] = useState('');
  const [pseudo, setPseudo] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await setAuth(pseudo, mail, mdp, birthday);
      alert('Compte créé avec succès !');
      navigate('/login');
    } catch (error) {
      alert('Erreur : Création de compte incorrect !');
    }
  };

  return (
    <div className="auth-page-container">
      <div className="card auth-card">
        <h1 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.75rem' }}>
          S'inscrire
        </h1>

        {error && (
          <div style={{
            padding: 'var(--spacing-md)',
            marginBottom: 'var(--spacing-md)',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: '#FEF2F2',
            color: '#DC2626',
            border: '1px solid #FCA5A5'
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="text-label" htmlFor="pseudo">Pseudo</label>
            <input 
                type="text" 
                name="pseudo" 
                id="pseudo"
                className="input-field" 
                placeholder="ex: JeanD"
                value={pseudo}
                onChange={(e) => setPseudo(e.target.value)}
                required
            />
          </div>

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

          <div className="input-group">
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

          <div className="input-group" style={{ marginBottom: 'var(--spacing-lg)' }}>
            <label className="text-label" htmlFor="confirmPassword">Confirmer le mot de passe</label>
            <input 
                type="password" 
                name="confirmPassword" 
                id="confirmPassword"
                className="input-field" 
                placeholder="••••••••" 
                value={formData.confirmPassword} 
                onChange={handleChange} 
                required
            />
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
              Créer mon compte
            </button>
          </div>
        </form>

        <div style={{ textAlign: 'center', marginTop: 'var(--spacing-lg)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--spacing-md)' }}>
          <p className="text-body" style={{ color: 'var(--color-text-muted)' }}>
            Déjà un compte ?{' '}
            <Link to="/login" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 500 }}>
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};