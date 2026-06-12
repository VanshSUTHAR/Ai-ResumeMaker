import React, { createContext, useState, useEffect, useCallback } from 'react';
import storage from '../utils/storage';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const token = storage.get('auth_token');
    const savedUser = storage.get('auth_user');
    
    if (token && savedUser) {
      setUser(savedUser);
      try {
        const data = await authService.getMe();
        if (data && data.user) {
          setUser(data.user);
          storage.set('auth_user', data.user);
        }
      } catch (err) {
        console.error('Session verification failed, logging out:', err);
        logout();
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      storage.set('auth_token', data.token);
      storage.set('auth_user', data.user);
      setUser(data.user);
      return data.user;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const data = await authService.register(name, email, password);
      storage.set('auth_token', data.token);
      storage.set('auth_user', data.user);
      setUser(data.user);
      return data.user;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    storage.remove('auth_token');
    storage.remove('auth_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
