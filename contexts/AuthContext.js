// context/AuthContext.js
import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import axios from 'axios';
import api from '../components/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  //funcion para listar todos los usuarios como administrador
  const ListarUsers = async()=>{
    try {
      const token = await getToken();
      const response = await api.get('/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error al listar usuarios:', error);
      throw error;
    }
  }

  //funcion para editar un usuario siendo usuario administrador
const editarUsuarioAdmin = async (id, form) => {
  try {
    const token = await getToken();

    // Copiamos el form para no mutarlo directamente
    const dataToSend = {
      name: form.name,
      email: form.email,
      roles_id: form.roles_id || 3, // Rol por defecto
    };

    // Solo incluir password si fue ingresado
    if (form.password && form.password.trim() !== '') {
      dataToSend.password = form.password;
      dataToSend.password_confirmation = form.password_confirmation;
    }

    const response = await api.put(`/user/${id}`, dataToSend, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return {
      success: true,
      message: 'Usuario editado exitosamente',
      data: response.data,
    };

  } catch (error) {
    console.error('Error al editar usuario:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al editar usuario',
      errors: error.response?.data?.errors || {},
    };
  }
};


  //funcion para eliminar un usuario
  const eliminarUsuario = async (id) => {
    try {
      const token = await getToken();
      const response = await api.delete(`/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { success: true, message: 'Usuario eliminado exitosamente', data: response.data };
    } catch (error) {
      console.error('Error al eliminar usuario:', error.response?.data || error
.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al eliminar usuario',
        errors: error.response?.data?.errors || {},
      };
    }
  };
  

  const registerUser = async (form) => {
    try {
      const response = await api.post('/register', {
        name: form.name,
        email: form.email,
        password: form.password,
        password_confirmation: form.password_confirmation,
        roles_id: form.roles_id || 3, // Default to 'Paciente' if no role is provided
      });

      return { success: true, message: 'Registro exitoso', data: response.data };
    } catch (error) {
      console.error('Error en el registro:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al registrar',
        errors: error.response?.data?.errors || {},
      };
    }
  };


  const getToken = async () => {
    if (Platform.OS === 'web') {
      return localStorage.getItem('token');
    } else {
      return await AsyncStorage.getItem('token');
    }
  };

  const loginWC = async ({ email, password }) => {
    try {
      const response = await api.post('/login', {
        email,
        password,
      });

      // const token = response.data.token;
      const { token, user } = response.data;

      // Guardar token en almacenamiento
      if (Platform.OS === 'web') {
        localStorage.setItem('token', token);
        localStorage.setItem('userData', JSON.stringify(user));

      } else {
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('userData', JSON.stringify(user));

      }

      setIsAuthenticated(true);
      setUserData(user);
      return { success: true, message: 'Inicio de sesión exitoso', token, user };
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Correo o contraseña incorrectos',
      };
    }
  };

  const logout = async () => {
    if (Platform.OS === 'web') {
      localStorage.removeItem('token');
      localStorage.removeItem('userData');

    } else {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userData');

    }
    setIsAuthenticated(false);
    setUserData(null);

  };

   useEffect(() => {
    const checkAuth = async () => {
      try {
        let token, storedUserData;
        
        if (Platform.OS === 'web') {
          token = localStorage.getItem('token');
          storedUserData = JSON.parse(localStorage.getItem('userData') || 'null');
        } else {
          token = await AsyncStorage.getItem('token');
          const userDataString = await AsyncStorage.getItem('userData');
          storedUserData = userDataString ? JSON.parse(userDataString) : null;
        }

        if (token && storedUserData) {
          setIsAuthenticated(true);
          setUserData(storedUserData);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setCheckingAuth(false);
      }
    };
    checkAuth();
  }, []);

  return (
     <AuthContext.Provider value={{ 
      isAuthenticated, 
      userData,
      logout, 
      checkingAuth, 
      registerUser, 
      loginWC,
      ListarUsers,
      eliminarUsuario,
      editarUsuarioAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};
