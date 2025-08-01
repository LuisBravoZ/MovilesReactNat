import React, { useState, useEffect, useContext } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import styles from '../../styles/style_reservarTurno';
import Sidebar from '../../components/Sidebar';
import { Platform } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { useAwesomeAlert } from '../../contexts/AwesomeAlert';
import { useNavigation } from '@react-navigation/native';

const HistorialTurnosCompletados = () => {
  const navigation = useNavigation();
  const { showAlert } = useAwesomeAlert();
  const { logout, listarTurnosCompletadosNutricionista } = useContext(AuthContext);

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [turnos, setTurnos] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState('');

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
    { icon: 'star', label: 'NutricionistaUser', navigateTo: 'NutricionistaUser' },
    { icon: 'account', label: 'Perfil', navigateTo: 'Perfil' },
    { icon: 'calendar-plus', label: 'Crear Turnos', navigateTo: 'CrearTurnos' },
    { icon: 'account', label: 'Listar Turnos', navigateTo: 'ListaTurnos' },
    { icon: 'calendar-check', label: 'Historial Turnos', navigateTo: 'HistorialTurnosCompletados' },
    { icon: 'logout', label: 'Cerrar sesión', onPress: handleLogout }
  ];

 useEffect(() => {
  const fetchTurnos = async () => {
    try {
      const data = await listarTurnosCompletadosNutricionista();

      // Guardamos solo el array de turnos
      setTurnos(data.turnos);

      // Extraemos pacientes únicos
      const pacientesUnicos = [];
      const ids = new Set();
      data.turnos.forEach(turno => {
        if (turno.paciente && !ids.has(turno.paciente.id)) {
          pacientesUnicos.push(turno.paciente);
          ids.add(turno.paciente.id);
        }
      });
      setPacientes(pacientesUnicos);
    } catch (error) {
      console.error('Error cargando turnos completados:', error);
    }
  };

  fetchTurnos();
}, []);


 const turnosFiltrados = pacienteSeleccionado
  ? turnos.filter(t => t.paciente && t.paciente.id === parseInt(pacienteSeleccionado))
  : [];


  return (
    <View style={styles.container}>
      {Platform.OS === 'web' && (
        <TouchableOpacity style={styles.menuButton} onPress={() => setDrawerVisible(true)}>
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

      <View style={styles.formContainer}>
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          <Text style={styles.title}>Historial de Turnos Completados</Text>

          <Text style={styles.label}>Selecciona un paciente:</Text>
          <Picker
            selectedValue={pacienteSeleccionado}
            onValueChange={(value) => setPacienteSeleccionado(value)}
            style={styles.picker}
          >
            <Picker.Item label="Seleccione..." value="" />
            {pacientes.map(p => (
              <Picker.Item key={p.id} label={p.name} value={p.id} />
            ))}
          </Picker>

          {pacienteSeleccionado && turnosFiltrados.length > 0 ? (
            turnosFiltrados.map(item => (
              <View key={item.id} style={styles.turnoCardElegante}>
                <View style={styles.turnoIconBox}>
                  <Text style={styles.turnoIcon}>✅</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.turnoFecha}>
                    <Text style={styles.turnoLabelIcon}>📅</Text> {item.fecha}
                  </Text>
                  <Text style={styles.turnoHora}>
                    <Text style={styles.turnoLabelIcon}>⏰</Text> {item.hora}
                  </Text>
                  <Text style={styles.turnoEstado}>
                    <Text style={styles.turnoLabelIcon}>🏷️</Text> {item.estado.charAt(0).toUpperCase() + item.estado.slice(1)}
                  </Text>
                </View>
              </View>
            ))
          ) : pacienteSeleccionado ? (
            <Text style={styles.sinTurnos}>Este paciente no tiene turnos completados.</Text>
          ) : null}
        </ScrollView>
      </View>
    </View>
  );
};

export default HistorialTurnosCompletados;
