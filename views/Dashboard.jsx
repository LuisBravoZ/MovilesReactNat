import React, { useState, useEffect, useContext } from 'react';
import { View, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { Text, IconButton, Button, Card } from 'react-native-paper';
import styles from '../styles/style_dashboard';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../contexts/AuthContext';
import { useAwesomeAlert } from '../contexts/AwesomeAlert';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { obtenerPerfil } from '../components/datos_Personales';

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

  // ✅ Mover esta función arriba evita el error
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
    { icon: 'eye', label: 'Ver Atencion' },
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
    const confirm =
      Platform.OS === 'web'
        ? window.confirm('¿Estás seguro de cancelar este turno?')
        : true; // puedes usar un Alert en móviles

    if (!confirm) return;

    const result = await cancelarTurno(turnoId);

    if (result.success) {
      Alert.alert('Éxito', result.message);
      fetchTurnos();
    } else {
      Alert.alert('Error', result.message);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchTurnos();
  }, []);

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

        <View style={styles.dashbox}>
          <Text style={styles.h2}>Mis turnos reservados</Text>
          {turnos.length === 0 ? (
            <Text>No tienes turnos reservados.</Text>
          ) : (
            turnos.map((turno) => (
              <Card key={turno.id} style={{ marginBottom: 10, padding: 10 }}>
                <Text>📅 Fecha: {turno.fecha}</Text>
                <Text>🕒 Hora: {turno.hora}</Text>
                <Text>👨‍⚕️ Nutricionista: {turno.nutricionista?.name || 'Sin nombre'}</Text>
                <Button
                  mode="contained"
                  onPress={() => handleCancelar(turno.id)}
                  style={{ marginTop: 8 }}
                >
                  Cancelar turno
                </Button>
              </Card>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Dashboard;
