import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { validateUser } from '../services/authService';
import { logoutUser } from '../services/authService';
import { User } from '../types/types';

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
}

interface AuthProviderProps {
  children: ReactNode; // Typing for children
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Prevents UI flickering

  const fetchUser = useCallback(async () => {
    try {
      const data = await validateUser();
      if (data) {
        setUser(data);
      } else {
        await logoutUser();
        setUser(null);
      }
    } catch (error) {
      await logoutUser();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Only call fetchUser when the user is null or has changed
  useEffect(() => {
    if (user === null) {
      fetchUser();
    }
  }, [fetchUser, user]); // Run the effect only when user state changes

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
