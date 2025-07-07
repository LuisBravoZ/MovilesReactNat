import React, { useState, useEffect, useContext } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text, TextInput, IconButton, Button } from 'react-native-paper';
import styles from '../styles/style_perfil';
import Sidebar from '../components/Sidebar';
import { Platform } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../contexts/AuthContext'; // Ajusta la ruta según tu proyecto


const Perfil = ({ navigation }) => {

    const { logout } = useContext(AuthContext);
    const handleLogout = async () => {
        await logout();
    };

    const [drawerVisible, setDrawerVisible] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); // <-- nuevo estado para contraseña
    const [password_confirmation, setPasswordConfirmation] = useState('');

    const updateProfile = async (profileData) => {
        try {
            // Obtener el token según la plataforma
            let token;
            if (Platform.OS === 'web') {
                token = localStorage.getItem('token');
            } else {
                token = await AsyncStorage.getItem('token');
            }
            if (profileData.password === '') {
                delete profileData.password;
                delete profileData.password_confirmation;
            }

            const response = await axios.put('http://127.0.0.1:8000/api/perfil', profileData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            console.log('Perfil actualizado:', response.data);
            alert('Perfil actualizado correctamente');
        } catch (error) {
            console.error('Error al actualizar perfil:', error.response?.data || error.message);
            alert('Error al actualizar perfil');
        }
    };

    const sidebarItems = [
        { icon: 'star', label: 'Dashboard', navigateTo: 'Dashboard' },
        { icon: 'account', label: 'Perfil', navigateTo: 'Perfil' },
        { icon: 'settings', label: 'Configuración' },
        { icon: 'logout', label: 'Cerrar sesión', onPress: handleLogout }
    ];
    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log('TOKEN ENVIADO:', token);

        axios.get('http://127.0.0.1:8000/api/perfil', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                const { name, email } = response.data;
                setName(name || '');
                setEmail(email || '');

            })
            .catch(error => {
                console.error('Error al obtener perfil:', error);
            });
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
            <View style={styles.perfilBox}>
                <View style={{ alignItems: 'center', marginBottom: 20 }}>
                    <Text style={styles.title}>Informacion de Perfil</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Nombre:</Text>
                    <TextInput
                        mode="outlined"
                        style={styles.input}
                        value={name}
                        onChangeText={setName}

                    />
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Correo:</Text>
                    <TextInput
                        mode="outlined"
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}

                    />

                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.label}>Contraseña:</Text>
                    <TextInput
                        placeholder="Nueva contraseña"
                        mode="outlined"
                        secureTextEntry
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                       
                    />
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Confirmar Contraseña:</Text>
                    <TextInput
                        placeholder="Confirmar contraseña"
                        mode="outlined"
                        secureTextEntry
                        style={styles.input}
                        value={password_confirmation}
                        onChangeText={setPasswordConfirmation}
                    />
                </View>

                <Button
                    style={styles.button}
                    contentStyle={{ paddingVertical: 6 }}
                    icon="pencil"
                    mode="contained"
                    onPress={() => updateProfile({ name, email, password, password_confirmation })}
                >
                    Actualizar Perfil
                </Button>

            </View>
        </View>

    );
};

export default Perfil;