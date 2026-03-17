
import { useState, useContext } from 'react';
import { connectAuth } from '../services/auth';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function Login() {
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
    <AuthLayout>
      <Card>
        <h2>Connexion</h2>
        <form onSubmit={handleSubmit}>
          <Input
            label="Adresse Email"
            type="email"
            placeholder="test@gmail.com"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
          />
          <Input
            label="Mot de passe"
            type="password"
            placeholder="••••••••"
            value={mdp}
            onChange={(e) => setMdp(e.target.value)}
          />
          <Button type="submit">
            Se connecter
          </Button>
        </form>
      </Card>
    </AuthLayout>
  );
}