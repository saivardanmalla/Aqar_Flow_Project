import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api, setAuthToken, getAuthToken } from '../lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  switchDemoRole: (role: 'agency_admin' | 'agent') => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isAgent: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function initAuth() {
      const token = getAuthToken();
      if (token) {
        try {
          const res = await api.getCurrentUser();
          setUser(res.user);
        } catch (err) {
          console.warn('Initial session restore failed:', err);
          setAuthToken(null);
          setUser(null);
        }
      } else {
        // Auto-login default demo admin for effortless exploration, but allow logout or switching to Agent
        try {
          const res = await api.login('admin@aqarflow.com', 'Password123!');
          setUser(res.user);
        } catch {
          // ignore if server not yet started
        }
      }
      setLoading(false);
    }

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.login(email, password);
      setUser(res.user);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } finally {
      setUser(null);
    }
  };

  const switchDemoRole = async (role: 'agency_admin' | 'agent') => {
    setLoading(true);
    try {
      const email = role === 'agency_admin' ? 'admin@aqarflow.com' : 'bilal@aqarflow.com';
      const res = await api.login(email, 'Password123!');
      setUser(res.user);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        switchDemoRole,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'agency_admin',
        isAgent: user?.role === 'agent',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
