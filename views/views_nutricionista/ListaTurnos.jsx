import React, { useEffect, useState, useContext } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { View, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Text, Button, Card, IconButton, Modal, Portal, Checkbox } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from '../../styles/style_ListaTurnos';
import { AuthContext } from '../../contexts/AuthContext';
import Sidebar from '../../components/Sidebar';
import { useAwesomeAlert } from '../../contexts/AwesomeAlert';

const ListaTurnos = () => {
  const navigation = useNavigation();
  const { logout, listarTurnos, cancelarTurno, asignarTurno, listarPacientes, eliminarTurno } = useContext(AuthContext);
  const { showAlert } = useAwesomeAlert();

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [pacientesModal, setPacientesModal] = useState([]);
  const [turnoAsignar, setTurnoAsignar] = useState(null);
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fechaFiltro, setFechaFiltro] = useState('');
  const [seleccionados, setSeleccionados] = useState([]);
  const [showPicker, setShowPicker] = useState(false);

  const ahora = new Date();

  const sidebarItems = [
    { icon: 'star', label: 'NutricionistaUser', navigateTo: 'NutricionistaUser' },
    { icon: 'calendar-plus', label: 'Crear Turnos', navigateTo: 'CrearTurnos' },
    { icon: 'account', label: 'Listar Turnos', navigateTo: 'ListaTurnos' },
    { icon: 'calendar-check', label: 'Historial Turnos', navigateTo: 'HistorialTurnosCompletados' },
    { icon: 'account', label: 'Perfil', navigateTo: 'Perfil' },
    { icon: 'logout', label: 'Cerrar sesión', onPress: () => handleLogout() }
  ];

  const handleLogout = () => {
    showAlert({
      title: 'Cerrar sesión',
      message: '¿Está seguro que quiere cerrar sesión?',
      onConfirm: () => logout(navigation),
      showCancel: true,
      onCancel: () => { },
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
        return <Button style={styles.renderButton} onPress={() => asignarPaciente(turno.id)}>Asignar a paciente</Button>;
      case 'reservado':
        return <Button style={styles.renderButton} onPress={() => cancelarTurnoHandler(turno.id)} color="red">Cancelar</Button>;
      case 'ocupado':
        return <Button style={styles.renderButton} onPress={() => atenderTurno(turno.id)}>Atender</Button>;
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

  const turnosFiltrados = turnos
    .filter(turno => {
      const fechaHora = new Date(`${turno.fecha}T${turno.hora}`);
      if (fechaHora < ahora) return false;
      if (fechaFiltro) return turno.fecha === fechaFiltro;
      return true;
    });

  return (
    <View style={styles.container}>
      {Platform.OS === 'web' && (
        <TouchableOpacity style={styles.menuButton} onPress={() => setDrawerVisible(true)}>
          <IconButton icon="menu" size={28} />
        </TouchableOpacity>
      )}

      <Sidebar navigation={navigation} visible={drawerVisible} onClose={() => setDrawerVisible(false)} items={sidebarItems} style={styles} />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.dashboxC}>
          <Text style={{ marginRight: 8 }}>Filtrar por fecha:</Text>
          {Platform.OS === 'web' ? (
            <input
              type="date"
              value={fechaFiltro}
              onChange={e => setFechaFiltro(e.target.value)}
              style={{ padding: 4, borderRadius: 4, borderWidth: 1, borderColor: '#ccc' }}
            />
          ) : (
            <TouchableOpacity
              onPress={() => setShowPicker(true)}
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 4,
                padding: 8,
                backgroundColor: '#f9f9f9'
              }}
            >
              <Text>{fechaFiltro || 'Selecciona fecha'}</Text>
            </TouchableOpacity>
          )}
          {showPicker && (
            <DateTimePicker
              value={fechaFiltro ? new Date(fechaFiltro) : new Date()}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowPicker(false);
                if (date) {
                  const yyyy = date.getFullYear();
                  const mm = String(date.getMonth() + 1).padStart(2, '0');
                  const dd = String(date.getDate()).padStart(2, '0');
                  setFechaFiltro(`${yyyy}-${mm}-${dd}`);
                }
              }}
            />
          )}
        </View>

        {loading ? (
          <Text>Cargando turnos...</Text>
        ) : turnosFiltrados.length === 0 ? (
          <Text>No hay turnos disponibles</Text>
        ) : (
          turnosFiltrados.map((turno) => {
            let cardStyle = [styles.card];
            let icon = '🟢';
            let estadoColor = '#388e3c';
            if (turno.estado === 'reservado') {
              cardStyle.push({ backgroundColor: '#e8f5e9', borderColor: '#43a047', borderWidth: 2 });
              icon = '🔒';
              estadoColor = '#43a047';
            } else if (turno.estado === 'ocupado') {
              cardStyle.push({ backgroundColor: '#e3f2fd', borderColor: '#1976d2', borderWidth: 2 });
              icon = '🕒';
              estadoColor = '#1976d2';
            } else if (turno.estado === 'cancelado') {
              cardStyle.push({ backgroundColor: '#ffebee', borderColor: '#d32f2f', borderWidth: 2 });
              icon = '❌';
              estadoColor = '#d32f2f';
            } 
            else if (turno.estado === 'completado') {
              cardStyle.push({ backgroundColor: '#ffebee', borderColor: '#d32f2f', borderWidth: 2 });
              icon = '✅';
              estadoColor = '#a1a1a1ff';
            }else {
              cardStyle.push({ backgroundColor: '#fffde7', borderColor: '#fbc02d', borderWidth: 2 });
              icon = '🟡';
              estadoColor = '#fbc02d';
            }

            return (
              <Card key={turno.id} style={cardStyle}>
                <Card.Content>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {/* Checkbox solo si se puede eliminar */}
                    {(turno.estado === 'disponible' || turno.estado === 'ocupado') && (
                      <Checkbox
                        status={seleccionados.includes(turno.id) ? 'checked' : 'unchecked'}
                        onPress={() => {
                          setSeleccionados(prev =>
                            prev.includes(turno.id)
                              ? prev.filter(id => id !== turno.id)
                              : [...prev, turno.id]
                          );
                        }}
                      />
                    )}
                    <Text style={styles.turnoIcon}>{icon}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.turnoInfo}>📅 <Text style={styles.bold}>{turno.fecha}</Text></Text>
                      <Text style={styles.turnoInfo}>⏰ <Text style={styles.bold}>{turno.hora}</Text></Text>
                      <Text style={[styles.turnoEstado, { color: estadoColor }]}>
                        {icon} {turno.estado.charAt(0).toUpperCase() + turno.estado.slice(1)}
                      </Text>
                      <Text style={styles.turnoPaciente}>
                        👤 Paciente: {turno.paciente?.name || turno.paciente?.nombre || 'Sin nombre'}
                      </Text>
                      <View style={{ marginTop: 10, flexDirection: 'row', gap: 8 }}>
                        <View style={styles.turnoCardButtons}>
                          {renderBoton(turno)}
                          {(turno.estado === 'disponible' || turno.estado === 'ocupado') && (
                            <Button
                              icon="delete"
                              mode="contained"
                              compact
                              style={styles.eliminarButton}
                              labelStyle={styles.eliminarButtonLabel}
                              onPress={() => {
                                showAlert({
                                  title: 'Eliminar turno',
                                  message: '¿Seguro que deseas eliminar este turno?',
                                  showCancel: true,
                                  onConfirm: async () => {
                                    await eliminarTurno(turno.id);
                                    cargarTurnos();
                                    showAlert({ title: 'Eliminado', message: 'Turno eliminado correctamente', showCancel: false });
                                  },
                                  onCancel: () => {},
                                });
                              }}
                            >
                              Eliminar
                            </Button>
                          )}
                        </View>
                      </View>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            );
          })
        )}

        <Button
          mode="contained"
          style={{ marginVertical: 10, backgroundColor: '#313131ff',  }}
          disabled={seleccionados.length === 0}
          onPress={async () => {
            showAlert({
              title: 'Eliminar turnos',
              message: `¿Seguro que deseas eliminar ${seleccionados.length} turno(s)?`,
              showCancel: true,
              onConfirm: async () => {
                for (const turnoId of seleccionados) {
                  const turno = turnos.find(t => t.id === turnoId);
                  if (turno && (turno.estado === 'disponible' || turno.estado === 'ocupado')) {
                    await eliminarTurno(turnoId);
                  }
                }
                setSeleccionados([]);
                cargarTurnos();
                showAlert({ title: 'Eliminado', message: 'Turnos eliminados correctamente', showCancel: false });
              },
              onCancel: () => { },
            });
          }}
        >
          Eliminar seleccionados
        </Button>
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
