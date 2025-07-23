import React, { useState, useContext } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Text, TextInput, Button, IconButton } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker'; // usa este picker recomendado
import styles from '../../styles/style_AgregarUsuario';
import Sidebar from '../../components/Sidebar';
import { Platform } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { useAwesomeAlert } from '../../contexts/AwesomeAlert';
import { useNavigation } from '@react-navigation/native';

const AgregarUsuario = () => {
    const navigation = useNavigation();
    const { showAlert } = useAwesomeAlert();
    const { registerUser, logout } = useContext(AuthContext);

    const [drawerVisible, setDrawerVisible] = useState(false);
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        roles_id: '3', // por defecto paciente, se usa en caso que un paciente se registre desde la pagina y el administrador si puede escoger uno de los 3 roles para crear usuarios
    });
    const [loading, setLoading] = useState(false);

    const sidebarItems = [
        { icon: 'star', label: 'AdminUser', navigateTo: 'AdminUser' },
        { icon: 'account-plus', label: 'Agregar Usuario', navigateTo: 'AgregarUsuario' },
        { icon: 'account', label: 'Perfil', navigateTo: 'Perfil' },
        { icon: 'logout', label: 'Cerrar sesión', onPress: handleLogout }
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

    const handleChange = (name, value) => {
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleAgregar = async () => {
        // Validaciones básicas
        if (!form.name || !form.email || !form.password || !form.password_confirmation) {
            showAlert({ title: 'Error', message: 'Complete todos los campos', showCancel: false });
            return;
        }
        if (form.password !== form.password_confirmation) {
            showAlert({ title: 'Error', message: 'Las contraseñas no coinciden', showCancel: false });
            return;
        }

        setLoading(true);

        // Llamas a registerUser del contexto pasando el form completo (incluyendo roles_id)
        const result = await registerUser(form);

        if (result.success) {
            showAlert({
                title: 'Éxito',
                message: result.message,
                onConfirm: () => {
                    setForm({
                        name: '',
                        email: '',
                        password: '',
                        password_confirmation: '',
                        roles_id: '3',
                    });
                },
                showCancel: false,
            });
        } else {
            showAlert({
                title: 'Error',
                message: result.message || 'Error desconocido',
                showCancel: false,
            });
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

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.dashbox}>
                    <Text style={styles.h1}>Agregar Usuario</Text>

                    <TextInput
                        label="Nombre"
                        value={form.name}
                        onChangeText={text => handleChange('name', text)}
                        style={styles.input}
                        mode="outlined"
                    />
                    <TextInput
                        label="Correo"
                        value={form.email}
                        onChangeText={text => handleChange('email', text)}
                        style={styles.input}
                        mode="outlined"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <TextInput
                        label="Contraseña"
                        value={form.password}
                        onChangeText={text => handleChange('password', text)}
                        style={styles.input}
                        mode="outlined"
                        secureTextEntry
                    />
                    <TextInput
                        label="Confirmar contraseña"
                        value={form.password_confirmation}
                        onChangeText={text => handleChange('password_confirmation', text)}
                        style={styles.input}
                        mode="outlined"
                        secureTextEntry
                    />

                    <Picker
                        selectedValue={form.roles_id}
                        onValueChange={(itemValue) => handleChange('roles_id', itemValue)}
                       // style={{ marginVertical: 10 }}
                       style={styles.picker}
                    >
                        <Picker.Item label="Administrador" value="1" />
                        <Picker.Item label="Nutricionista" value="2" />
                        <Picker.Item label="Paciente" value="3" />
                    </Picker>

                    <Button
                        mode="contained"
                        style={styles.button}
                        onPress={handleAgregar}
                        loading={loading}
                        disabled={loading}
                    >
                        Agregar Usuario
                    </Button>
                </View>
            </ScrollView>
        </View>
    );
};

export default AgregarUsuario;
