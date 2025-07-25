'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/utils/api';

export interface UserInfo {
  id: number;
  userId: string;
  username: string;
  email: string;
  isAdmin: boolean;
  imagePath?: string;
}

interface AuthContextType {
  user: UserInfo | null;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  register: (userId: string, username: string, password: string, email: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<UserInfo | null>>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/users/me');
      setUser(response.data.user as UserInfo);
    } catch (err: any) {
      setUser(null);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (identifier: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', {
        identifier,
        password
      });
      setUser(response.data.user);
    } catch (err: any) {
      setUser(null);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userId: string, username: string, password: string, email: string) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/register', {
        userId, username, password, email
      });
    } catch (err: any) {
      setUser(null);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    await api.post('/auth/logout');
    setUser(null);
    setIsLoading(false);
  };

  // Check authentication status on mount
  useEffect(() => {
    try {
      checkAuth();
    } catch (err) {
      router.replace('/auth/login');
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, checkAuth, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};