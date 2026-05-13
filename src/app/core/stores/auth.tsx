import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'CLIENT' | 'EXPERT' | 'ADMIN';
  company?: string;
  isTwoFactorEnabled?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, token: string) => void;
  updateUser: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const userData = await api.get('/auth/me');
        if (userData && userData.role) {
          const normalizedUser = { ...userData, role: userData.role.toUpperCase() as any };
          setUser(normalizedUser);
          localStorage.setItem('user', JSON.stringify(normalizedUser));
        } else {
          throw new Error('Invalid user data');
        }
      } catch (err) {
        console.warn('Session verification failed, using local session:', err);
        // Temporairement désactivé pour éviter les déconnexions intempestives
        // setUser(null);
        // localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = (userData: User, token?: string) => {
    const normalizedUser = { ...userData, role: userData.role?.toUpperCase() as any };
    setUser(normalizedUser);
    if (token) setToken(token);
    localStorage.setItem('user', JSON.stringify(normalizedUser));
  };

  const updateUser = (userData: User) => {
    const normalizedUser = { ...userData, role: userData.role?.toUpperCase() as any };
    setUser(normalizedUser);
    localStorage.setItem('user', JSON.stringify(normalizedUser));
  };

  const logout = async () => {
    try { await api.post('/auth/logout', {}); } catch (e) { console.error(e); }
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      updateUser, 
      logout, 
      isAuthenticated: !!user 
    }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
