import React, { useState, useEffect, useContext } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text, TextInput, IconButton, Button } from 'react-native-paper';
import styles from '../styles/style_perfil';
import Sidebar from '../components/Sidebar';
import { Platform } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../contexts/AuthContext';
import { useAwesomeAlert } from '../contexts/AwesomeAlert'
import { useNavigation } from '@react-navigation/native';
import api from '../components/api'
import { obtenerDatosPersonales, crearDatosPersonales, actualizarDatosPersonales, obtenerPerfil, actualizarPerfil } from '../components/datos_Personales';
import { ScrollView } from 'react-native';

const Perfil = () => {
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
    const [password, setPassword] = useState('');
    const [password_confirmation, setPasswordConfirmation] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    // para los Datos_Personales
    const [telefono, setTelefono] = useState('');
    const [cedula, setCedula] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [direccion, setDireccion] = useState('');
    const [ciudad, setCiudad] = useState('');

    const updateProfile = async (profileData) => {
        try {
            let token = Platform.OS === 'web'
                ? localStorage.getItem('token')
                : await AsyncStorage.getItem('token');

            // Limpiar contraseña si está vacía
            if (profileData.password === '') {
                delete profileData.password;
                delete profileData.password_confirmation;
            }

            // Intentar actualizar datos personales, si no existen se crean
            const datos = {
                telefono,
                cedula,
                fecha_nacimiento: fechaNacimiento,
                direccion,
                ciudad
            };
            await actualizarPerfil(profileData, token);

            try {
                await actualizarDatosPersonales(datos, token);
            } catch (e) {
                // Si falla actualizar, intenta crear
                await crearDatosPersonales(datos, token);
            }

            showAlert({
                title: 'Éxito',
                message: 'Perfil y datos personales actualizados'
            });

        } catch (error) {
            console.error('Error al actualizar perfil:', error.response?.data || error.message);
            showAlert({
                title: 'Error',
                message: 'Ocurrió un error al actualizar'
            });
        }
    };

    const sidebarItems = [
        { icon: 'star', label: 'Dashboard', navigateTo: 'Dashboard' },
        { icon: 'account', label: 'Perfil', navigateTo: 'Perfil' },
        { icon: 'settings', label: 'Configuración' },
        { icon: 'logout', label: 'Cerrar sesión', onPress: handleLogout }
    ];

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                let token = Platform.OS === 'web'
                    ? localStorage.getItem('token')
                    : await AsyncStorage.getItem('token');

                const response = await obtenerPerfil(token);

                const { name, email } = response;
                setName(name || '');
                setEmail(email || '');

                // Obtener datos personales
                const datos = await obtenerDatosPersonales(token);
                console.log('Datos personales cargados:', datos);
                if (datos) {
                    setTelefono(datos.telefono || '');
                    setCedula(datos.cedula || '');
                    setFechaNacimiento(datos.fecha_nacimiento || '');
                    setDireccion(datos.direccion || '');
                    setCiudad(datos.ciudad || '');
                }

            } catch (error) {
                console.error('Error al obtener perfil o datos personales:', error);
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
            <ScrollView
                contentContainerStyle={{
                    alignItems: 'center',
                    paddingVertical: 20,
                }}
                style={{ flex: 1 }}
            >
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
                            secureTextEntry={!showPassword}
                            style={styles.input}
                            value={password}
                            onChangeText={setPassword}
                            right={
                                <TextInput.Icon
                                    icon={showPassword ? 'eye-off' : 'eye'}
                                    onPress={() => setShowPassword(!showPassword)}
                                />
                            }

                        />
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Confirmar Contraseña:</Text>
                        <TextInput
                            placeholder="Confirmar contraseña"
                            mode="outlined"
                            secureTextEntry={!showPasswordConfirmation}
                            style={styles.input}
                            value={password_confirmation}
                            onChangeText={setPasswordConfirmation}
                            right={
                                <TextInput.Icon
                                    icon={showPasswordConfirmation ? 'eye-off' : 'eye'}
                                    onPress={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                                />
                            }

                        />
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Teléfono:</Text>
                        <TextInput
                            mode="outlined"
                            style={styles.input}
                            value={telefono}
                            onChangeText={setTelefono}
                        />
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Cédula:</Text>
                        <TextInput
                            mode="outlined"
                            style={styles.input}
                            value={cedula}
                            onChangeText={setCedula}
                        />
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Fecha Nacimiento:</Text>
                        <TextInput
                            mode="outlined"
                            style={styles.input}
                            placeholder="YYYY-MM-DD"
                            value={fechaNacimiento}
                            onChangeText={setFechaNacimiento}
                        />
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Dirección:</Text>
                        <TextInput
                            mode="outlined"
                            style={styles.input}
                            value={direccion}
                            onChangeText={setDireccion}
                        />
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Ciudad:</Text>
                        <TextInput
                            mode="outlined"
                            style={styles.input}
                            value={ciudad}
                            onChangeText={setCiudad}
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
            </ScrollView>
        </View>


    );
};
export default Perfil;