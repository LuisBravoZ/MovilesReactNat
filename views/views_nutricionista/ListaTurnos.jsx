import React, { useEffect, useState, useContext } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Button, Card, IconButton } from 'react-native-paper';
import { AuthContext } from '../../contexts/AuthContext';
import Sidebar from '../../components/Sidebar';
import { useNavigation } from '@react-navigation/native';
import { useAwesomeAlert } from '../../contexts/AwesomeAlert';
import { Platform } from 'react-native';




const ListaTurnos = () => {
 const navigation = useNavigation();
  const { logout, listarTurnos } = useContext(AuthContext);
  const { showAlert } = useAwesomeAlert();

  const [drawerVisible, setDrawerVisible] = useState(false);
  const sidebarItems = [
    { icon: 'star', label: 'NutricionistaUser', navigateTo: 'NutricionistaUser' },
    { icon: 'calendar-plus', label: 'Crear Turnos', navigateTo: 'CrearTurnos' },
    { icon: 'account', label: 'Listar Turnos', navigateTo: 'ListaTurnos' },
    { icon: 'account', label: 'Perfil', navigateTo: 'Perfil' },
    { icon: 'logout', label: 'Cerrar sesión', onPress: () => handleLogout() }
  ];

  function handleLogout() {
    showAlert({
      title: 'Cerrar sesión',
      message: '¿Está seguro que quiere cerrar sesión?',
      onConfirm: () => logout(navigation),
      showCancel: true,
      onCancel: () => console.log('Cancelado'),
    });
  }
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);


useEffect(() => {
  const cargarTurnos = async () => {
    try {
      setLoading(true);
      const data = await listarTurnos();
      console.log('Turnos cargados:', data);
      setTurnos(data.turnos);
    } catch (error) {
      console.error('Error cargando turnos:', error);
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

  cargarTurnos();
}, []);


  const renderBoton = (turno) => {
    switch (turno.estado) {
      case 'disponible':
        return <Button onPress={() => asignarPaciente(turno.id)}>Asignar a paciente</Button>;
      case 'reservado':
        return <Button onPress={() => cancelarTurno(turno.id)} color="red">Cancelar</Button>;
      case 'ocupado':
        return <Button onPress={() => atenderTurno(turno.id)}>Atender</Button>;
      default:
        return <Text style={{ color: 'gray' }}>No disponible</Text>;
    }
  };

  const asignarPaciente = (turnoId) => {
    console.log(`Asignar paciente al turno ${turnoId}`);
    // aquí pones tu lógica
  };

  const cancelarTurno = (turnoId) => {
    console.log(`Cancelar turno ${turnoId}`);
    // aquí tu lógica para cancelar
  };

  const atenderTurno = (turnoId) => {
    console.log(`Atender turno ${turnoId}`);
    // tu lógica para atención
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
    
      <ScrollView contentContainerStyle={styles.scrollContainer}>
  {loading ? (
    <Text>Cargando turnos...</Text>
  ) : turnos.length === 0 ? (
    <Text>No hay turnos disponibles</Text>
  ) : (
    turnos.map((turno) => {
      let cardStyle = [styles.card];
      if (turno.estado === 'reservado') {
        cardStyle.push({ backgroundColor: '#ffe0e0' });
      } else if (turno.estado === 'ocupado') {
        cardStyle.push({ backgroundColor: '#e0e0ff' });
      } else if (turno.estado === 'disponible') {
        cardStyle.push({ backgroundColor: '#e0ffe0' });
      }
      return (
        <Card key={turno.id} style={cardStyle}>
          <Card.Content>
            <Text>📅 Fecha: {turno.fecha}</Text>
            <Text>⏰ Hora: {turno.hora}</Text>
            <Text>Estado: {turno.estado}</Text>
            {turno.paciente && <Text>👤 Paciente: {turno.paciente.nombre}</Text>}
            <View style={{ marginTop: 10 }}>
              {renderBoton(turno)}
            </View>
          </Card.Content>
        </Card>
      );
    })
  )}
</ScrollView>
    </View>
  );
};

const shadowStyle = Platform.OS === 'web'
    ? { boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }
    : {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 10,
    };
const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  card: {
    marginBottom: 10,
    backgroundColor: '#f5f5f5',
  },

  dashbox:
  {
    backgroundColor: '#fff',
    paddingVertical: 40,
    paddingHorizontal: 30,
    width: 350,
    borderRadius: 12,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    alignItems: 'center',
    ...shadowStyle
  },
   drawerContainer: {
    backgroundColor: '#fff',
    padding: 20,
    width: 250,
    alignSelf: 'flex-start',
    borderRadius: 10,
    minHeight: 300,
  },
   scrollContainer: {
    padding: 20,
    paddingBottom: 40,
    flexGrow: 1,
    ...(Platform.OS === 'web' && {
      maxHeight: '90vh',
      overflowY: 'auto',
    }),
  },
  card: {
    marginBottom: 10,
    backgroundColor: '#f5f5f5',
  }
});

export default ListaTurnos;
