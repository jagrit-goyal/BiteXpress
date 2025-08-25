import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true
  });

  useEffect(() => {
    // Check for stored auth data
    const storedUser = localStorage.getItem('BiteXpress_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          loading: false
        });
      } catch (error) {
        localStorage.removeItem('BiteXpress_user');
        setAuthState({
          user: null,
          isAuthenticated: false,
          loading: false
        });
      }
    } else {
      setAuthState({
        user: null,
        isAuthenticated: false,
        loading: false
      });
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call - in real app, this would be an actual API request
      const mockUsers = JSON.parse(localStorage.getItem('BiteXpress_users') || '[]');
      const user = mockUsers.find((u: User) => u.email === email && u.password === password);
      
      if (user) {
        localStorage.setItem('BiteXpress_user', JSON.stringify(user));
        setAuthState({
          user,
          isAuthenticated: true,
          loading: false
        });
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const register = async (userData: any): Promise<boolean> => {
    try {
      // Simulate API call
      const mockUsers = JSON.parse(localStorage.getItem('BiteXpress_users') || '[]');
      
      // Check if user already exists
      if (mockUsers.find((u: User) => u.email === userData.email)) {
        return false;
      }

      const newUser = {
        ...userData,
        _id: Date.now().toString(),
        createdAt: new Date()
      };

      mockUsers.push(newUser);
      localStorage.setItem('BiteXpress_users', JSON.stringify(mockUsers));
      
      localStorage.setItem('BiteXpress_user', JSON.stringify(newUser));
      setAuthState({
        user: newUser,
        isAuthenticated: true,
        loading: false
      });
      
      return true;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('BiteXpress_user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      loading: false
    });
  };

  const value: AuthContextType = {
    ...authState,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};