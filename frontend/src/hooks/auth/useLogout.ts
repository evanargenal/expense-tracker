import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { logoutUser } from '../../services/authService';

export function useLogout() {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Error logging user out:', error);
    }
  };

  return handleLogout;
}
