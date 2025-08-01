import React, { useState, useEffect, useContext } from 'react';

import { View, TouchableOpacity } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import styles from '../../styles/style_reservarTurno';
import Sidebar from '../../components/Sidebar';
import { Platform } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';
import { useAwesomeAlert } from '../../contexts/AwesomeAlert'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import api from '../../components/api'
import { obtenerPerfil } from '../../components/datos_Personales';
import { Picker } from '@react-native-picker/picker'; 
import { ScrollView, FlatList } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const ReservarTurno = () => {
  const navigation = useNavigation();
  const { showAlert } = useAwesomeAlert();
  const { logout } = useContext(AuthContext);
  const handleLogout = () => {
    showAlert({
      title: 'Cerrar sesión',
      message: '¿Está seguro que quiere cerrar sesión?',
      onConfirm: () => logout(navigation),
      showCancel: true,
      onCancel: () => console.log('Cancelado'),
    });
  };
  const [fechaFiltro, setFechaFiltro] = useState(null);
  const [mostrarDatePicker, setMostrarDatePicker] = useState(false);

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');


  const { listarNutricionistas, listarTurnosPorNutricionista, reservarTurno } = useContext(AuthContext);
  const [nutricionistas, setNutricionistas] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [selectedNutricionista, setSelectedNutricionista] = useState('');
  const [loading, setLoading] = useState(false);
  const ahora = new Date();

  const turnosFiltrados = fechaFiltro
    ? turnos.filter(t => t.fecha === fechaFiltro.toISOString().split('T')[0])
    : turnos;

  // Filtra solo turnos futuros o actuales
  const turnosValidos = turnosFiltrados.filter(t => {
    const fechaHora = new Date(`${t.fecha}T${t.hora}`);
    return fechaHora >= ahora;
  });

  const turnosManana = turnosValidos.filter(t => parseInt(t.hora.split(':')[0]) < 12);
  const turnosTarde = turnosValidos.filter(t => parseInt(t.hora.split(':')[0]) >= 12);

  const sidebarItems = [
    { icon: 'star', label: 'Dashboard', navigateTo: 'Dashboard' },
    { icon: 'account', label: 'Perfil', navigateTo: 'Perfil' },
    { icon: 'calendar-check', label: 'Reservar Turno', navigateTo: 'ReservarTurno' },
    { icon: 'history', label: 'Historial Paciente', navigateTo: 'HistorialPaciente' },
    { icon: 'logout', label: 'Cerrar sesión', onPress: handleLogout }
  ];


  useEffect(() => {
    const cargarNutricionistas = async () => {
      try {
        const data = await listarNutricionistas();
        setNutricionistas(data.nutricionistas); // Asegúrate de que este sea el nombre correcto en tu API
      } catch (error) {
        console.error('Error al listar nutricionistas:', error);
      }
    };
    cargarNutricionistas();
  }, []);

  const cargarTurnosNutricionista = async (nutricionistaId) => {
    try {
      setSelectedNutricionista(nutricionistaId);

      const data = await listarTurnosPorNutricionista(nutricionistaId);
      const turnosFiltrados = data.turnos || [];

      setTurnos(turnosFiltrados);

    } catch (error) {
      console.error('Error al cargar turnos por nutricionista:', error);
    }
  };

  const handleReservar = async (turno) => {
    setLoading(true);
    const result = await reservarTurno(turno.id, turno.fecha);
    showAlert({
      title: result.success ? 'Reservado' : 'Error',
      message: result.message,
    });
    if (result.success) {
      // Vuelve a cargar turnos
      await cargarTurnosNutricionista(selectedNutricionista);
    }
    setLoading(false);
  };


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

      <View style={styles.formContainer}>
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          <Text style={styles.title}>Reservar Turno</Text>

          <Text style={styles.label}>Selecciona un nutricionista:</Text>
          <Picker
            selectedValue={selectedNutricionista}
            onValueChange={cargarTurnosNutricionista}
            style={styles.picker}
          >
            <Picker.Item label="Seleccione..." value="" />
            {nutricionistas.map(n => (
              <Picker.Item key={n.id} label={n.name} value={n.id} />
            ))}
          </Picker>

          <View style={{ marginVertical: 10 }}>
            <TouchableOpacity
              style={styles.botonReservar}
              onPress={() => setMostrarDatePicker(true)}
            >
              <Text style={styles.botonReservarTexto}>
                {fechaFiltro ? `Fecha: ${fechaFiltro.toISOString().split('T')[0]}` : 'Filtrar por Fecha'}
              </Text>
            </TouchableOpacity>

            {mostrarDatePicker && (
              <DateTimePicker
                value={fechaFiltro || new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setMostrarDatePicker(false);
                  if (event.type === 'set') {
                    setFechaFiltro(selectedDate);
                  }
                }}
              />
            )}

            {fechaFiltro && (
              <TouchableOpacity
                onPress={() => setFechaFiltro(null)}
                style={[styles.botonReservar, { backgroundColor: '#ccc', marginTop: 5 }]}
              >
                <Text style={styles.botonReservarTexto}>Limpiar filtro</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {/* Turnos Mañana */}
            <View style={{ flex: 1, marginRight: 5 }}>
              <Text style={styles.subtitulo}>Turnos Mañana</Text>
              {turnosManana.length > 0 ? (
                turnosManana.map((item) => (
                  <View
                    key={item.id}
                    style={[
                      styles.turnoCard,
                      item.estado === 'reservado' && { borderColor: '#43a047', borderWidth: 2 }
                    ]}
                  >
                    <Text style={styles.turnoTexto}>Fecha: {item.fecha}</Text>
                    <Text style={styles.turnoTexto}>Hora: {item.hora}</Text>
                    {item.estado === 'reservado' ? (
                      <TouchableOpacity
                        style={[styles.botonReservar, { backgroundColor: '#43a047' }]}
                        disabled={true}
                      >
                        <Text style={[styles.botonReservarTexto, { color: '#fff' }]}>Reservado</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={styles.botonReservar}
                        onPress={() => handleReservar(item)}
                        disabled={loading}
                      >
                        <Text style={styles.botonReservarTexto}>Reservar</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))
              ) : (
                <Text style={styles.sinTurnos}>Sin turnos.</Text>
              )}
            </View>

            {/* Turnos Tarde */}
            <View style={{ flex: 1, marginLeft: 5 }}>
              <Text style={styles.subtitulo}>Turnos Tarde</Text>
              {turnosTarde.length > 0 ? (
                turnosTarde.map((item) => (
                  <View
                    key={item.id}
                    style={[
                      styles.turnoCard,
                      item.estado === 'reservado' && { borderColor: '#43a047', borderWidth: 2 }
                    ]}
                  >
                    <Text style={styles.turnoTexto}>Fecha: {item.fecha}</Text>
                    <Text style={styles.turnoTexto}>Hora: {item.hora}</Text>
                    {item.estado === 'reservado' ? (
                      <TouchableOpacity
                        style={[styles.botonReservar, { backgroundColor: '#43a047' }]}
                        disabled={true}
                      >
                        <Text style={[styles.botonReservarTexto, { color: '#fff' }]}>Reservado</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={styles.botonReservar}
                        onPress={() => handleReservar(item)}
                        disabled={loading}
                      >
                        <Text style={styles.botonReservarTexto}>Reservar</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))
              ) : (
                <Text style={styles.sinTurnos}>Sin turnos.</Text>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default ReservarTurno;