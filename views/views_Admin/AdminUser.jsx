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
    const { logout, ListarUsers, eliminarUsuario } = useContext(AuthContext);
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
    const [users, setUsers] = useState([]); // Lista de usuarios

    const editarUsuario = (id) => {
        console.log('Editar usuario', id);
        // Aquí puedes navegar a otro formulario o abrir un modal
    };
    const confirmarEliminarUsuario = (id) => {
  showAlert({
    title: 'Eliminar Usuario',
    message: '¿Estás seguro que quieres eliminar este usuario?',
    showCancel: true,
    onConfirm: async () => {
      try {
        const result = await eliminarUsuario(id);
        if (result.success) {
          showAlert({
            title: 'Éxito',
            message: result.message,
            showCancel: false,
          });
          // Refrescar lista de usuarios
          const data = await ListarUsers();
          setUsers(Array.isArray(data) ? data : data.users);
        } else {
          showAlert({
            title: 'Error',
            message: result.message,
            showCancel: false,
          });
        }
      } catch (error) {
        console.error('Error inesperado:', error);
        showAlert({
          title: 'Error',
          message: 'Ocurrió un error al eliminar el usuario.',
          showCancel: false,
        });
      }
    },
  });
};

  
    const sidebarItems = [
        { icon: 'star', label: 'AdminUser', navigateTo: 'AdminUser' },
        { icon: 'account-plus', label: 'Agregar Usuario', navigateTo: 'AgregarUsuario' },
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

        const fetchUsers = async () => {
            try {
                const data = await ListarUsers();
                setUsers(Array.isArray(data) ? data : data.users);
            } catch (error) {
                console.error('Error al cargar usuarios:', error);
            }
        };


        fetchProfile();
        fetchUsers();
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
                
                <ScrollView horizontal>
                    <View style={{ minWidth: 600, padding: 10 }}>
                        <View style={{ flexDirection: 'row', backgroundColor: '#ccc', padding: 10 }}>
                            <Text style={{ width: 50, fontWeight: 'bold' }}>ID</Text>
                            <Text style={{ width: 150, fontWeight: 'bold' }}>Nombre</Text>
                            <Text style={{ width: 180, fontWeight: 'bold' }}>Correo</Text>
                            <Text style={{ width: 100, fontWeight: 'bold' }}>Rol</Text>
                            <Text style={{ width: 120, fontWeight: 'bold' }}>Acciones</Text>
                        </View>

                        {users.map(user => (
                            <View
                                key={user.id}
                                style={{ flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderColor: '#ddd' }}
                            >
                                <Text style={{ width: 50 }}>{user.id}</Text>
                                <Text style={{ width: 150 }}>{user.name}</Text>
                                <Text style={{ width: 180 }}>{user.email}</Text>
                                <Text style={{ width: 100 }}>{user.roles?.nombre_rol || 'N/A'}</Text>
                                <View style={{ width: 120, flexDirection: 'row' }}>
                                    <Button icon="pencil" compact onPress={() => editarUsuario(user.id)} />
                                    <Button icon="delete" compact onPress={() => confirmarEliminarUsuario(user.id)} />
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>
        </View>
    );
};

export default AdminUser;