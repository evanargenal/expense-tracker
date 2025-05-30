import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import './index.css';

import Spinner from 'react-bootstrap/Spinner';

import LandingPage from './pages/LandingPage/LandingPage';
import ExpensesList from './pages/ExpensesList/ExpensesList';
import IncomeItemsList from './pages/IncomeItemsList/IncomeItemsList';
import CategoriesList from './pages/Categories/CategoriesList';
import NoMatchPage from './pages/NoMatchPage/NoMatchPage';

function App() {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="loading-spinner">
        <Spinner animation="border" />
        <h3>Loading</h3>
      </div>
    ); // Prevents UI flickering

  return (
    <Routes>
      <Route
        path="/"
        element={!user ? <LandingPage /> : <Navigate to="/expenses-list" />}
      />
      <Route
        path="/expenses-list"
        element={user ? <ExpensesList /> : <Navigate to="/" />}
      />
      <Route
        path="/income-list"
        element={user ? <IncomeItemsList /> : <Navigate to="/" />}
      />
      <Route
        path="/categories-list"
        element={user ? <CategoriesList /> : <Navigate to="/" />}
      />
      <Route path="*" element={<NoMatchPage />} />
    </Routes>
  );
}

export default App;
