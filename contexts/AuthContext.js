// context/AuthContext.js
import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const getToken = async () => {
    if (Platform.OS === 'web') {
      return localStorage.getItem('token');
    } else {
      return await AsyncStorage.getItem('token');
    }
  };

  const login = async (token) => {
    if (Platform.OS === 'web') {
      localStorage.setItem('token', token);
    } else {
      await AsyncStorage.setItem('token', token);
    }
    setIsAuthenticated(true);
  };

  const logout = async () => {
    if (Platform.OS === 'web') {
      localStorage.removeItem('token');
    } else {
      await AsyncStorage.removeItem('token');
    }
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken();
      setIsAuthenticated(!!token);
      setCheckingAuth(false);
    };
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, checkingAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
