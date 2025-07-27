import React, { useState, useEffect, useContext } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import styles from '../../styles/style_dashboard';
import Sidebar from '../../components/Sidebar';
import { Platform } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { useAwesomeAlert } from '../../contexts/AwesomeAlert'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { obtenerPerfil } from '../../components/datos_Personales';

const NutricionistaUser = () => {
    const navigation = useNavigation();
    const { showAlert } = useAwesomeAlert();
    const { logout, userData, listarTurnosReservadosNutricionista } = useContext(AuthContext);
    const handleLogout = () => {
        showAlert({
            title: 'Cerrar sesión',
            message: '¿Está seguro que quiere cerrar sesión?',
            onConfirm: () => logout(navigation),
            showCancel: true,
            onCancel: () => console.log('Cancelado'),
        });
    };
    const [turnosReservados, setTurnosReservados] = useState([]);
    const [loadingTurnos, setLoadingTurnos] = useState(true);

    const [drawerVisible, setDrawerVisible] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const [fechaSeleccionada, setFechaSeleccionada] = useState(() => {
        const hoy = new Date();
        return hoy.toISOString().slice(0, 10); // formato YYYY-MM-DD
    });

    const sidebarItems = [
        { icon: 'star', label: 'NutricionistaUser', navigateTo: 'NutricionistaUser' },
        { icon: 'calendar-plus', label: 'Crear Turnos', navigateTo: 'CrearTurnos' },
        { icon: 'account', label: 'Listar Turnos', navigateTo: 'ListaTurnos' },

        { icon: 'account', label: 'Perfil', navigateTo: 'Perfil' },
        { icon: 'logout', label: 'Cerrar sesión', onPress: handleLogout }
    ];

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = Platform.OS === 'web' ? localStorage.getItem('token') : await AsyncStorage.getItem('token');

                const response = await obtenerPerfil(token);

                setName(response.name || '');
                setEmail(response.email || '');
            } catch (error) {
                console.error('Error al obtener perfil:', error);

                if (error.response && error.response.status === 401) {
                    //alert('Sesión expirada. Por favor, inicia sesión nuevamente.');
                    await logout(navigation);

                }
            }
        };
        const cargarTurnos = async () => {
            try {
                setLoadingTurnos(true);
                if (userData?.id) {
                    const data = await listarTurnosReservadosNutricionista(userData.id);
                    setTurnosReservados(data.turnos || []);
                }
            } catch (error) {
                setTurnosReservados([]);
            } finally {
                setLoadingTurnos(false);
            }
        };
        cargarTurnos();

        fetchProfile();
    }, [userData]);

    const turnosFiltrados = turnosReservados.filter(
        t => t.fecha === fechaSeleccionada
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

            <View style={styles.content}>
                <View style={styles.dashbox}>
                    <Text style={styles.h1}>Bienvenido Nutricionista, {name}:</Text>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Correo:</Text>
                        <Text style={styles.value}>{email}</Text>
                    </View>

<View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                    <Text style={{ marginRight: 8 }}>Buscar por fecha:</Text>
                    {Platform.OS === 'web' ? (
                        <input
                            type="date"
                            value={fechaSeleccionada}
                            onChange={e => setFechaSeleccionada(e.target.value)}
                            style={{ padding: 4, borderRadius: 4, borderWidth: 1, borderColor: '#ccc' }}
                        />
                    ) : (
                        <TouchableOpacity
                            onPress={async () => {
                                // Puedes usar un DateTimePicker aquí si lo tienes instalado
                                // Por simplicidad, aquí solo mostramos un ejemplo
                                // setFechaSeleccionada(nuevaFechaSeleccionada)
                            }}
                            style={{
                                borderWidth: 1,
                                borderColor: '#ccc',
                                borderRadius: 4,
                                padding: 8,
                                backgroundColor: '#f9f9f9'
                            }}
                        >
                            <Text>{fechaSeleccionada}</Text>
                        </TouchableOpacity>
                    )}
                </View>

                </View>
                <View style={styles.dashbox}>
                    <Text style={styles.label}>Turnos Reservados:</Text>
                    {loadingTurnos ? (
                        <Text>Cargando...</Text>
                    ) : turnosReservados.length === 0 ? (
                        <Text>No hay turnos reservados</Text>
                    ) : (
                        <ScrollView horizontal style={{ marginTop: 10 }}>
                            <View style={styles.turnosTable}>
                               
                                {/* Filas */}
                                {turnosFiltrados.length === 0 ? (
                                    <Text>No hay turnos reservados para esta fecha</Text>
                                ) : (
                                    <ScrollView horizontal style={{ marginTop: 10 }}>
                                        <View style={styles.turnosTable}>
                                            {/* Encabezados */}
                                            <View style={styles.turnosTableHeader}>
                                                <Text style={styles.turnosTableHeaderCell}>Fecha</Text>
                                                <Text style={styles.turnosTableHeaderCell}>Hora</Text>
                                                <Text style={styles.turnosTableHeaderCell}>Acción</Text>
                                            </View>
                                            {/* Filas */}
                                            {turnosFiltrados.map(turno => (
                                                <View key={turno.id} style={styles.turnosTableRow}>
                                                    <Text style={styles.turnosTableCell}>{turno.fecha}</Text>
                                                    <Text style={styles.turnosTableCell}>{turno.hora}</Text>
                                                    <TouchableOpacity
                                                        style={styles.atenderButton}
                                                        onPress={() => console.log('Atender turno', turno.id)}
                                                    >
                                                        <Text style={styles.atenderButtonText}>Atender</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            ))}
                                        </View>
                                    </ScrollView>
                                )}
                            </View>
                        </ScrollView>
                    )}
                </View>
                
            </View>
        </View>
    );
};

export default NutricionistaUser;