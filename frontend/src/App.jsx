// Import Router 
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import composant 
import Header from './components/Header';
import Account from './pages/Accounts';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateTournament from './pages/CreateTournament';  
import Tournament from './pages/Tournament';  
import AddTeam from './pages/AddTeam';
import HomePage from './pages/HomePage';  
import Tournaments from './pages/Tournaments';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Header />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="tournament/create" element={<CreateTournament />} />
          <Route path="tournament/:id" element={<Tournament />} />
          <Route path="tournament/:id/add-team" element={<AddTeam />} />
          <Route path="tournaments" element={<Tournaments />} />
          <Route path="account" element={<Account />} />
          <Route path="*" element={<Navigate to="/" />} />  
        </Route>
      </Routes>
    </Router>
  );
}

export default App;