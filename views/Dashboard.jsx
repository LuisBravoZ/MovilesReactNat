import React, { useState, useEffect, useContext  } from 'react';
import { View, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { Text, IconButton, Button, Card } from 'react-native-paper';
import styles from '../styles/style_dashboard';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../contexts/AuthContext';
import { useAwesomeAlert } from '../contexts/AwesomeAlert';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { obtenerPerfil } from '../components/datos_Personales';
import { useFocusEffect } from '@react-navigation/native';


const Dashboard = () => {
  const navigation = useNavigation();
  const { showAlert } = useAwesomeAlert();

  const {
    logout,
    listarMisTurnosReservadosPaciente,
    cancelarTurno,
  } = useContext(AuthContext);

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [turnos, setTurnos] = useState([]);

  const handleLogout = () => {
    showAlert({
      title: 'Cerrar sesión',
      message: '¿Está seguro que quiere cerrar sesión?',
      onConfirm: () => logout(navigation),
      showCancel: true,
      onCancel: () => console.log('Cancelado'),
    });
  };

  const sidebarItems = [
    { icon: 'star', label: 'Dashboard', navigateTo: 'Dashboard' },
    { icon: 'account', label: 'Perfil', navigateTo: 'Perfil' },
    { icon: 'calendar-check', label: 'Reservar Turno', navigateTo: 'ReservarTurno' },
    { icon: 'history', label: 'Historial Paciente', navigateTo: 'HistorialPaciente' },
    { icon: 'logout', label: 'Cerrar sesión', onPress: handleLogout },
  ];

  const fetchProfile = async () => {
    try {
      const token =
        Platform.OS === 'web'
          ? localStorage.getItem('token')
          : await AsyncStorage.getItem('token');

      const response = await obtenerPerfil(token);
      setName(response.name || '');
      setEmail(response.email || '');
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      if (error.response?.status === 401) {
        await logout(navigation);
      }
    }
  };

  const fetchTurnos = async () => {
    try {
      const data = await listarMisTurnosReservadosPaciente();
      setTurnos(data.turnos || []);
    } catch (error) {
      console.error('Error al cargar turnos reservados:', error);
    }
  };

  const handleCancelar = async (turnoId) => {
    showAlert({
      title: 'Cancelar turno',
      message: '¿Estás seguro de cancelar este turno?',
      showCancel: true,
      onConfirm: async () => {
        const result = await cancelarTurno(turnoId);
        showAlert({
          title: result.success ? 'Éxito' : 'Error',
          message: result.message,
          showCancel: false,
        });
        if (result.success) fetchTurnos();
      },
      onCancel: () => {},
    });
  };

  useEffect(() => {
    fetchProfile();
    //fetchTurnos();
  }, []);
  useFocusEffect(
  React.useCallback(() => {
    fetchTurnos();
  }, [])
);

  return (
    <View style={styles.container}>
      {Platform.OS === 'web' && (
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setDrawerVisible(true)}
        >
          <IconButton icon="menu" size={28} />
        </TouchableOpacity>
      )}

      <Sidebar
        navigation={navigation}
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        items={sidebarItems}
        style={styles}
      />

<ScrollView contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
        <View style={styles.dashbox}>
          <Text style={styles.h1}>Bienvenido, {name}:</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Nombre:</Text>
            <Text style={styles.value}>{name}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Correo:</Text>
            <Text style={styles.value}>{email}</Text>
          </View>
        </View>

        <View style={styles.dashboxC}>
          <Text style={styles.h2}>Mis turnos reservados</Text>
          {turnos.length === 0 ? (
            <Text>No tienes turnos reservados.</Text>
          ) : (
            turnos.map((turno) => (
              <View key={turno.id} style={styles.turnoCard}>
                <Text style={styles.turnoIcon}>📅</Text>
                <View style={styles.turnoInfoBox}>
                  <Text style={styles.turnoLabel}>Fecha: {turno.fecha}</Text>
                  <Text style={styles.turnoLabel}>Hora: {turno.hora}</Text>
                  <Text style={styles.turnoNutricionista}>
                    Nutricionista: {turno.nutricionista?.name || 'Sin nombre'}
                  </Text>
                </View>
                <Button
                  mode="contained"
                  onPress={() => handleCancelar(turno.id)}
                  style={styles.turnoButton}
                  labelStyle={styles.turnoButtonText}
                >
                  Cancelar
                </Button>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Dashboard;
