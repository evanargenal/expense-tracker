import { createContext, useContext, useState, useEffect } from 'react';

import axios from 'axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Prevents UI flickering

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get('/api/auth/validate', {
          withCredentials: true,
        });
        setUser(data.user);
      } catch (error) {
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
    <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
