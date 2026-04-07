// Import Router 
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// Import composant 
import Header from './components/Header';
import Account from './pages/Accounts';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateTournament from './pages/CreateTournament';
import Tournament from './pages/Tournament';
import HomePage from './pages/HomePage';
function App() {
  return (
    <Router>
      <Route path="/" element={<Header />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="create-tournament" element={<CreateTournament />} />
        <Route path="tournaments" element={<Tournament />} />
        <Route path="account" element={<Account />} />
        <Route path="*" element={<Navigate to="/" />} />  
      </Route>
    </Router>
  );
}

export default App;