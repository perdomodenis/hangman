import React, { createContext, useState, useEffect, useCallback } from 'react';

interface User {
    id: number;
    email: string;
    username: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    register: (username: string, email: string, password: string, passwordConfirmation: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    restoreSession: () => Promise <void>;
}

    export const AuthContext = createContext<AuthContextType | undefined>(undefined);

    export const AuthProvider: React.FC = ({ children }) => {
        const [user, setUser] = useState<User | null>(null);
        const [token, setToken] = useState<string | null>(null);
        const [isLoading, setIsLoading] = useState(true);

        const API_URL = 'http://localhost:8000/api';

        /**
         * Registriert neuen user
         */
  const register = useCallback(async (username: string, email: string, password: string, passwordConfirm: string) => {
    const response = await fetch(`${API_URL}/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, passwordConfirm }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Registration failed');
    }

    const data = await response.json();
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('token', data.token);
  }, []);

        /**
         * Loggt den user ein
         */
        const login = useCallback(async (email: string, password: string) => {
            const response = await fetch(`${API_URL}/auth/login/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Login failed');
            }

            const data = await response.json();
            setToken(data.token);
            setUser(data.user);
            localStorage.setItem('token', data.token);
        }, []);

        /**
         * Loggt den user aus
         */
         const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  }, []);

  /**
   * Restore session on page reload
   * Called in useEffect, checks localStorage for token and validates it
   */
  const restoreSession = useCallback(async () => {
    try {
      const savedToken = localStorage.getItem('token');
      if (!savedToken) {
        setIsLoading(false);
        return;
      }

      // Verify token is still valid by fetching user info
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${savedToken}` },
      });

      if (!response.ok) {
        // Token invalid, remove it
        localStorage.removeItem('token');
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      setToken(savedToken);
      setUser(data.user);
    } catch (error) {
      console.error('Failed to restore session:', error);
      localStorage.removeItem('token');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Restore session on app startup
  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        register,
        login,
        logout,
        restoreSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};