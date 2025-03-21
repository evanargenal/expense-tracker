import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import './index.css';

import Spinner from 'react-bootstrap/Spinner';

import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import NoMatch from './pages/NoMatch';
import Categories from './pages/Categories';

function App() {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="loadingSpinner">
        <Spinner animation="border" />
        <p>Loading</p>
      </div>
    ); // Prevents UI flickering

  return (
    <Routes>
      <Route
        path="/"
        element={!user ? <LandingPage /> : <Navigate to="/dashboard" />}
      />
      <Route
        path="/dashboard"
        element={user ? <Dashboard /> : <Navigate to="/" />}
      />
      <Route
        path="/categories"
        element={user ? <Categories /> : <Navigate to="/" />}
      />
      <Route path="*" element={<NoMatch />} />
    </Routes>
  );
}

export default App;
