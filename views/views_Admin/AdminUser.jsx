import React, { useState, useEffect, useContext } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Text, IconButton, Button } from 'react-native-paper';
import styles from '../../styles/style_dashboard';
import Sidebar from '../../components/Sidebar';
import { Platform } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { useAwesomeAlert } from '../../contexts/AwesomeAlert'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { obtenerPerfil } from '../../components/datos_Personales';

const AdminUser = () => {
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

    const [drawerVisible, setDrawerVisible] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const sidebarItems = [
        { icon: 'star', label: 'AdminUser', navigateTo: 'AdminUser' },
        { icon: 'account-plus', label: 'Agregar Usuario', navigateTo: 'AgregarUsuario' },
        { icon: 'account-multiple', label: 'Listar Usuario', navigateTo: 'ListarUser' },
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
                    <Text style={styles.h1}>Bienvenido Administrador, {name}:</Text>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Correo:</Text>
                        <Text style={styles.value}>{email}</Text>
                    </View>

                </View>

            </View>
        </View>
    );
};

export default AdminUser;