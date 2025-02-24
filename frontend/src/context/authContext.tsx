import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

import axios from 'axios';

interface User {
  userId: string;
  email: string;
  fullName: string;
  isAdmin: boolean;
  exp: number;
  iat: number;
}

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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get('/api/auth/validate', {
          withCredentials: true,
        });
        setUser(data.user);
      } catch (error: any) {
        // Expected case: User is not logged in (no token)
        if (error.response?.status === 401) {
          setUser(null);
        } else {
          console.error('Error with token check', error);
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

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
