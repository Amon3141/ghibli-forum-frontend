'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/utils/api';
import { User } from '@/types/database';

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userId: string, username: string, password: string, email: string) => Promise<{ redirectUrl: string }>;
  checkAuth: () => Promise<void>;
  isLoading: boolean;
  isSendingEmail: boolean;
  resendVerificationEmail: (email: string) => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/users/me');
      setUser(response.data.user as User);
    } catch (err: any) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (identifier: string, password: string) => {
    setIsLoading(true);
    try {
      await api.post('/auth/login', {
        identifier,
        password
      });
      await checkAuth();
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

      console.log("response", response);
      
      const emailSent = response.data.emailSent;
      const redirectUrl = `/auth/email-sent?email=${encodeURIComponent(email)}&emailSent=${emailSent}`;

      console.log("redirectUrl", redirectUrl);
      
      return { redirectUrl };
    } catch (err: any) {
      setUser(null);
      console.log(err);
      throw new Error(err.response?.data?.error || 'ユーザー登録に失敗しました');
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

  const resendVerificationEmail = async (email: string) => {
    setIsSendingEmail(true);
    try {
      await api.post('/auth/resend-verification', { email });
    } catch (error: any) {
      throw new Error(error.response?.data?.error || '確認メールの再送信に失敗しました。少し後で再度お試しください。');
    } finally {
      setIsSendingEmail(false);
    }
  }

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      login,
      logout,
      register,
      checkAuth,
      isLoading,
      isSendingEmail,
      resendVerificationEmail
    }}>
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
