import { Routes, Route } from 'react-router-dom';

import LandingPage from './pages/landingPage';
import Dashboard from './pages/dashboard';
import NoMatch from './pages/noMatch';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<NoMatch />} />
    </Routes>
  );
}

export default App;
