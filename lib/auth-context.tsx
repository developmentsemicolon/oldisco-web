'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient, User, AuthResponse, LoginDto, RegisterDto } from './api-client';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginDto, rememberMe?: boolean) => Promise<void>;
  register: (data: RegisterDto, rememberMe?: boolean) => Promise<void>;
  loginWithGoogle: () => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';
const REMEMBER_ME_KEY = 'auth_remember_me';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Carregar dados salvos ao montar
  useEffect(() => {
    const loadAuthData = () => {
      try {
        const rememberMe = localStorage.getItem(REMEMBER_ME_KEY) === 'true';
        const storage = rememberMe ? localStorage : sessionStorage;
        
        const savedToken = storage.getItem(TOKEN_KEY);
        const savedUser = storage.getItem(USER_KEY);

        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
          // Verificar se o token ainda é válido
          checkAuth();
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error loading auth data:', error);
        clearAuthData();
        setIsLoading(false);
      }
    };

    loadAuthData();
  }, []);

  const saveAuthData = (authData: AuthResponse, rememberMe: boolean = false) => {
    const storage = rememberMe ? localStorage : sessionStorage;
    
    storage.setItem(TOKEN_KEY, authData.token);
    storage.setItem(USER_KEY, JSON.stringify(authData.user));
    if (rememberMe) {
      localStorage.setItem(REMEMBER_ME_KEY, 'true');
    } else {
      localStorage.removeItem(REMEMBER_ME_KEY);
    }

    setToken(authData.token);
    setUser(authData.user);
  };

  const clearAuthData = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(REMEMBER_ME_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);

    setToken(null);
    setUser(null);
  };

  const login = async (credentials: LoginDto, rememberMe: boolean = false) => {
    try {
      setIsLoading(true);
      const response = await apiClient.login(credentials);
      saveAuthData(response, rememberMe);
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      throw new Error(error.message || 'Erro ao fazer login');
    }
  };

  const register = async (data: RegisterDto, rememberMe: boolean = false) => {
    try {
      const response = await apiClient.register(data);
      saveAuthData(response, rememberMe);
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      throw new Error(error.message || 'Erro ao registrar');
    }
  };

  const loginWithGoogle = () => {
    apiClient.initiateGoogleAuth();
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuthData();
      setIsLoading(false);
      router.push('/');
    }
  };

  const checkAuth = async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const userData = await apiClient.getMe();
      setUser(userData);
      setIsLoading(false);
    } catch (error) {
      // Token inválido ou expirado
      clearAuthData();
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    register,
    loginWithGoogle,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
