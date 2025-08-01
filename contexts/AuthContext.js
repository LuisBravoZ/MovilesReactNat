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

  //
  // ==================== TURNOS ====================

  // Obtener turnos completados por el nutricionista autenticado
  const listarTurnosCompletadosNutricionista = async () => {
    try {
      const token = await getToken();
      const response = await api.get('/turnos/completados', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener turnos completados:', error.response?.data || error.message);
      throw error;
    }
  };
  // funcion para atender turno 
  const atenderTurno = async (turnoId) => {
    try {
      const token = await getToken();
      const response = await api.post(`/turnos/${turnoId}/atender`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Error al atender turno:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al atender turno',
      };
    }
  };

  //listar turno reservados po el paciente autenticado
  const listarMisTurnosReservadosPaciente = async () => {
    try {
      const token = await getToken();
      const response = await api.get('/paciente/turnos', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error al listar mis turnos reservados:', error.response?.data || error.message);
      throw error;
    }
  }

  // Listar solo los turnos reservados del nutricionista autenticado
  const listarMisTurnosReservados = async () => {
    try {
      const token = await getToken();
      const response = await api.get('/nutricionistas/turnos/reservados', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error al listar mis turnos reservados:', error.response?.data || error.message);
      throw error;
    }
  };

  //listar turnos de un nutricionista específico
  const listarTurnosPorNutricionista = async (nutricionistaId) => {
    try {
      const token = await getToken();
      const response = await api.get(`/nutricionistas/turnos/${nutricionistaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error al listar turnos por nutricionista:', error.response?.data || error.message);
      throw error;
    }
  };

  // Obtener turnos reservados de un nutricionista específico
  const listarTurnosReservadosNutricionista = async (nutricionistaId) => {
    try {
      const token = await getToken();
      const response = await api.get(`/nutricionistas/turnos/${nutricionistaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error al listar turnos reservados:', error.response?.data || error.message);
      throw error;
    }
  };

  // Crear turnos (por nutricionista)
  const crearTurnos = async (form) => {
    try {
      const token = await getToken();
      const response = await api.post('/turnos', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return {
        success: true,
        message: response.data.message,
        turnos: response.data.turnos,
      };
    } catch (error) {
      console.error('Error al crear turnos:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al crear turnos',
      };
    }
  };

  // Reservar turno (por paciente)
  const reservarTurno = async (turnoId, fecha) => {
    try {
      const token = await getToken();

      // Verificar si el usuario ya tiene un turno reservado ese día
      const responseTurnos = await api.get('/turnos/mis-turnos', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const yaReservado = responseTurnos.data.turnos?.some(
        t => t.fecha === fecha
      );
      if (yaReservado) {
        return {
          success: false,
          message: 'Solo puedes reservar un turno por día.',
        };
      }

      // 2. Intentar reservar el turno
      const response = await api.post(`/turnos/${turnoId}/reservar`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Error al reservar turno:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al reservar turno',
      };
    }
  };

  // Cancelar turno (nutricionista o paciente)
  const cancelarTurno = async (turnoId) => {
    try {
      const token = await getToken();
      const response = await api.post(`/turnos/${turnoId}/cancelar`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      // El backend debe validar si el usuario tiene permiso para cancelar
      console.error('Error al cancelar turno:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'No tienes permiso para cancelar este turno',
      };
    }
  };

  // listarpacientes para poder asignar turnos
  const listarPacientes = async () => {
    try {
      const token = await getToken();
      const response = await api.get('/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Respuesta completa:', response.data);

      // Ajusta aquí según la estructura real:
      const lista = Array.isArray(response.data) ? response.data : response.data.users || response.data.usuarios || [];
      const pacientes = lista.filter(u => u.roles_id === 3);
      return pacientes;
    } catch (error) {
      console.error('Error al listar pacientes:', error.response?.data || error.message);
      return [];
    }
  };
  // Asignar turno (nutricionista asigna a paciente)

  const asignarTurno = async (turnoId, paciente_id) => {
    try {
      const token = await getToken();
      const response = await api.post(`/turnos/${turnoId}/asignar`, {
        paciente_id,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Error al asignar turno:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al asignar turno',
      };
    }
  };

  //eliminar turno (por nutricionista)
  const eliminarTurno = async (turnoId) => {
    try {
      const token = await getToken();
      const response = await api.delete(`/turnos/${turnoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Error al eliminar turno:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al eliminar turno',
      };
    }
  }

  //listar turnos (por nutricionista)
  const listarTurnos = async () => {
    try {
      const token = await getToken();
      const response = await api.get('/nutricionistas/turnos', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error al listar turnos:', error);
      throw error;
    }
  }

  //funcion para listar todos los usuarios como administrador
  const ListarUsers = async () => {
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
  //funcion de listar nutricionistas
  const listarNutricionistas = async () => {
    try {
      const token = await getToken();
      const response = await api.get('/nutricionistas/listar', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error al listar nutricionistas:', error);
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
      editarUsuarioAdmin,
      crearTurnos,
      reservarTurno,
      cancelarTurno,
      asignarTurno,
      listarTurnos,
      listarTurnosReservadosNutricionista,
      listarPacientes,
      listarNutricionistas,
      listarTurnosPorNutricionista,
      listarMisTurnosReservados,
      listarMisTurnosReservadosPaciente,
      atenderTurno,
      listarTurnosCompletadosNutricionista,
      eliminarTurno
    }}>
      {children}
    </AuthContext.Provider>
  );
};
