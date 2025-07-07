import React, { useState, useEffect, useContext } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import styles from '../styles/style_dashboard';
import Sidebar from '../components/Sidebar';
import { Platform } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';



const Dashboard = ({ navigation }) => {

    const { logout } = useContext(AuthContext);
    const handleLogout = async () => {
        await logout();
    };
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const sidebarItems = [
        { icon: 'star', label: 'Dashboard', navigateTo: 'Dashboard' },
        { icon: 'account', label: 'Perfil', navigateTo: 'Perfil' },
        { icon: 'settings', label: 'Configuración' },
        { icon: 'logout', label: 'Cerrar sesión', onPress: handleLogout }
    ];


    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = Platform.OS === 'web' ? localStorage.getItem('token') : await AsyncStorage.getItem('token');

                const response = await axios.get('http://127.0.0.1:8000/api/perfil', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setName(response.data.name || '');
                setEmail(response.data.email || '');
            } catch (error) {
                console.error('Error al obtener perfil:', error);

                if (error.response && error.response.status === 401) {
                    // token inválido, cierra sesión automáticamente
                    await logout();
                }
            }
        };

        fetchProfile();
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

            <View style={styles.content}>
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
            </View>
        </View>
    );
};

export default Dashboard;