import React, { useEffect, useState, useContext } from 'react';
import { View, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import styles from '../../styles/style_HistorialPaciente';
import Sidebar from '../../components/Sidebar';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { useAwesomeAlert } from '../../contexts/AwesomeAlert';

const HistorialPaciente = () => {
  const navigation = useNavigation();
    const { showAlert } = useAwesomeAlert();
  const { listarMisTurnosReservadosPaciente, logout } = useContext(AuthContext);
  const [atenciones, setAtenciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    const cargarHistorial = async () => {
      try {
        const data = await listarMisTurnosReservadosPaciente();
        const atencionesConfirmadas = (data.turnos || []).filter(
          t => t.estado === 'confirmado' || t.estado === 'completado'
        );
        setAtenciones(atencionesConfirmadas);
      } catch (error) {
        setAtenciones([]);
      } finally {
        setLoading(false);
      }
    };
    cargarHistorial();
  }, []);

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

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.dashbox}>
          <Text style={styles.title}>Historial de Atenciones</Text>
          {loading ? (
            <Text style={styles.loading}>Cargando...</Text>
          ) : atenciones.length === 0 ? (
            <Text style={styles.empty}>No tienes atenciones confirmadas.</Text>
          ) : (
            <ScrollView contentContainerStyle={styles.list}>
              {atenciones.map((atencion) => (
                <View key={atencion.id} style={styles.card}>
                  <Text style={styles.icon}>✅</Text>
                  <View style={styles.info}>
                    <Text style={styles.label}>Fecha: {atencion.fecha}</Text>
                    <Text style={styles.label}>Hora: {atencion.hora}</Text>
                    <Text style={styles.label}>Nutricionista: {atencion.nutricionista?.name || 'Sin nombre'}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default HistorialPaciente;