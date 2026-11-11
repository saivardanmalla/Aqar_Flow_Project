import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api, setAuthToken, getAuthToken } from '../lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, serverType?: 'user' | 'admin') => Promise<void>;
  loginWithGoogle: (data?: { email?: string; name?: string; avatar?: string }) => Promise<void>;
  register: (data: { full_name: string; email: string; password: string; phone?: string; agency_name?: string }) => Promise<void>;
  logout: () => Promise<void>;
  switchDemoRole: (role: 'agency_admin' | 'agent' | 'user') => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isAgent: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // When the browser/page is refreshed, automatically log out and require login
    setAuthToken(null);
    setUser(null);
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, serverType: 'user' | 'admin' = 'user') => {
    setLoading(true);
    try {
      const res = await api.login(email, password, serverType);
      setUser(res.user);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (data?: { email?: string; name?: string; avatar?: string }) => {
    setLoading(true);
    try {
      const res = await api.loginWithGoogle(data);
      setUser(res.user);
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: { full_name: string; email: string; password: string; phone?: string; agency_name?: string }) => {
    setLoading(true);
    try {
      const res = await api.register(data);
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

  const switchDemoRole = async (role: 'agency_admin' | 'agent' | 'user') => {
    setLoading(true);
    try {
      const email = role === 'agency_admin' 
        ? 'admin@aqarflow.com' 
        : role === 'agent' 
        ? 'bilal@aqarflow.com' 
        : 'sai@college.edu';
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
        register,
        logout,
        switchDemoRole,
        loginWithGoogle,
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
