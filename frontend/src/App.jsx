// Import Router 
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// Import composant 
import Header from './components/Header';
// Import page 
import Tournaments from './pages/Tournaments';
import TournamentDetail from './pages/TournamentDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';
import AddTournaments from './pages/AddTournaments';
import AddTeam from './pages/AddTeam';
function App() {
  return (
    <Router>
      <Header />
      <Routes>
        {/* On définit nos différentes pages et leurs URLs */}
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/tournaments" element={<Tournaments />} />
        
        {/* Le fameux :id est une variable dynamique dans l'URL ! */}
        <Route path="/tournaments/:id" element={<TournamentDetail />} />

        <Route path="/account" element={<Account />}/>

        <Route path="/tournaments/create" element={<AddTournaments/>}/>

        <Route path="/tournaments/:id/add-team" element={<AddTeam/>}/>
        {/* Si l'utilisateur tape n'importe quoi, on le renvoie vers les tournois */}
        <Route path="*" element={<Navigate to="/tournaments" />} />
      </Routes>
    </Router>
  );
}

export default App;