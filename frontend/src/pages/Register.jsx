
import { useState } from 'react';
import { setAuth } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button_Primary';

export default function Register() {
  const [mail, setMail] = useState('');
  const [mdp, setMdp] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [birthday, setBirthday] = useState('');
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
    <AuthLayout>
      <Card>
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <Input
            label="Pseudo"
            type="text"
            placeholder="dada"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            required
          />
          <Input
            label="Adresse Mail"
            type="email"
            placeholder="test@gmail.com"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            required
          />
          <Input
            label="Birthdate"
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            required
          />
          <Input
            label="Mot de passe"
            type="password"
            placeholder="••••••••"
            value={mdp}
            onChange={(e) => setMdp(e.target.value)}
            required
          />
          <Button type="submit">
            S'inscrire
          </Button>
        </form>
      </Card>
    </AuthLayout>
  );
}