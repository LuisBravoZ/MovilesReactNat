import React, { useEffect, useState, useContext } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { View, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Text, Button, Card, IconButton, Modal, Portal } from 'react-native-paper';

import styles from '../../styles/style_ListaTurnos';
import { AuthContext } from '../../contexts/AuthContext';
import Sidebar from '../../components/Sidebar';
import { useAwesomeAlert } from '../../contexts/AwesomeAlert';

const ListaTurnos = () => {
  const navigation = useNavigation();
  const { logout, listarTurnos, cancelarTurno, asignarTurno, listarPacientes } = useContext(AuthContext);
  const { showAlert } = useAwesomeAlert();

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [pacientesModal, setPacientesModal] = useState([]);
  const [turnoAsignar, setTurnoAsignar] = useState(null);
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);

  const sidebarItems = [
    { icon: 'star', label: 'NutricionistaUser', navigateTo: 'NutricionistaUser' },
    { icon: 'calendar-plus', label: 'Crear Turnos', navigateTo: 'CrearTurnos' },
    { icon: 'account', label: 'Listar Turnos', navigateTo: 'ListaTurnos' },
    { icon: 'account', label: 'Perfil', navigateTo: 'Perfil' },
    { icon: 'logout', label: 'Cerrar sesión', onPress: () => handleLogout() }
  ];

  const handleLogout = () => {
    showAlert({
      title: 'Cerrar sesión',
      message: '¿Está seguro que quiere cerrar sesión?',
      onConfirm: () => logout(navigation),
      showCancel: true,
      onCancel: () => {},
    });
  };

  const cargarTurnos = async () => {
    try {
      setLoading(true);
      const data = await listarTurnos();
      setTurnos(data.turnos);
    } catch (error) {
      showAlert({
        title: 'Error',
        message: 'No se pudieron cargar los turnos',
        showCancel: false,
      });
      setTurnos([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      cargarTurnos();
    }, [])
  );

  const renderBoton = (turno) => {
    switch (turno.estado) {
      case 'disponible':
        return <Button style={styles.renderButton}  onPress={() => asignarPaciente(turno.id)}>Asignar a paciente</Button>;
      case 'reservado':
        return <Button style={styles.renderButton} onPress={() => cancelarTurnoHandler(turno.id)} color="red">Cancelar</Button>;
      case 'ocupado':
        return <Button style={styles.renderButton}  onPress={() => atenderTurno(turno.id)}>Atender</Button>;
      default:
        return <Text style={{ color: 'gray' }}>No disponible</Text>;
    }
  };

  const asignarPaciente = async (turnoId) => {
    try {
      const pacientes = await listarPacientes();
      if (!pacientes.length) {
        showAlert({ title: 'Sin pacientes', message: 'No hay pacientes disponibles.', showCancel: false });
        return;
      }
      setPacientesModal(pacientes);
      setTurnoAsignar(turnoId);
      setModalVisible(true);
    } catch {
      showAlert({ title: 'Error', message: 'No se pudo cargar la lista de pacientes', showCancel: false });
    }
  };

  const handleAsignarPaciente = async (pacienteId) => {
    const res = await asignarTurno(turnoAsignar, pacienteId);
    showAlert({ title: res.success ? 'Éxito' : 'Error', message: res.message, showCancel: false });
    setModalVisible(false);
    cargarTurnos();
  };

  const cancelarTurnoHandler = async (turnoId) => {
    showAlert({
      title: 'Cancelar turno',
      message: '¿Está seguro que desea cancelar este turno?',
      showCancel: true,
      onConfirm: async () => {
        const res = await cancelarTurno(turnoId);
        showAlert({ title: res.success ? 'Éxito' : 'Error', message: res.message, showCancel: false });
        cargarTurnos();
      }
    });
  };

  const atenderTurno = (turnoId) => {
    console.log(`Atender turno ${turnoId}`);
  };

  return (
    <View style={styles.container}>
      {Platform.OS === 'web' && (
        <TouchableOpacity style={styles.menuButton} onPress={() => setDrawerVisible(true)}>
          <IconButton icon="menu" size={28} />
        </TouchableOpacity>
      )}

      <Sidebar navigation={navigation} visible={drawerVisible} onClose={() => setDrawerVisible(false)} items={sidebarItems} style={styles} />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {loading ? (
          <Text>Cargando turnos...</Text>
        ) : turnos.length === 0 ? (
          <Text>No hay turnos disponibles</Text>
        ) : (
          turnos.map((turno) => {
            let cardStyle = [styles.card];
            if (turno.estado === 'reservado') cardStyle.push({ backgroundColor: '#ffe0e0' });
            else if (turno.estado === 'ocupado') cardStyle.push({ backgroundColor: '#e0e0ff' });
            else if (turno.estado === 'disponible') cardStyle.push({ backgroundColor: '#e0ffe0' });

            return (
              <Card key={turno.id} style={cardStyle}>
                <Card.Content>
                  <Text style={styles.turnoInfo}>📅 Fecha: {turno.fecha}</Text>
                  <Text style={styles.turnoInfo}>⏰ Hora: {turno.hora}</Text>
                  <Text style={styles.turnoInfo}>📝Estado: {turno.estado}</Text>
                  <Text style={styles.turnoPaciente}>
                    👤 Paciente: {turno.paciente?.name || turno.paciente?.nombre || 'Sin nombre'}
                  </Text>
                  <View style={{ marginTop: 10 }}>
                    {renderBoton(turno)}
                  </View>
                </Card.Content>
              </Card>
            );
          })
        )}
      </ScrollView>

      <Portal>
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modal}>
          <Text style={styles.modalTitle}>Selecciona un paciente</Text>
          <ScrollView style={styles.modalList}>
            {pacientesModal.map(p => (
              <View key={p.id} style={styles.modalItem}>
                <View>
                  <Text style={styles.modalPatientName}>{p.name}</Text>
                  <Text style={styles.modalPatientEmail}>{p.email}</Text>
                </View>
                <Button style={styles.modalButton} mode="contained" onPress={() => handleAsignarPaciente(p.id)}>Asignar</Button>
              </View>
            ))}
          </ScrollView>
          <Button onPress={() => setModalVisible(false)} style={{ marginTop: 10 }}>Cerrar</Button>
        </Modal>
      </Portal>
    </View>
  );
};

export default ListaTurnos;
