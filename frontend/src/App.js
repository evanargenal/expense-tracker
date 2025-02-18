import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/authContext';

import LandingPage from './pages/landingPage';
import Dashboard from './pages/dashboard';
import NoMatch from './pages/noMatch';

function App() {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>; // Prevents UI flickering

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
      <Route path="*" element={<NoMatch />} />
    </Routes>
  );
}

export default App;
