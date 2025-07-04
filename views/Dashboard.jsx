import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import styles from '../styles/style_dashboard';
import Sidebar from '../components/Sidebar';
import { Platform } from 'react-native';



const Dashboard = ({ navigation }) => {
    const [drawerVisible, setDrawerVisible] = useState(false);
    const sidebarItems = [
        { icon: 'star', label: 'Dashboard', navigateTo: 'Dashboard' },
        { icon: 'account', label: 'Perfil', navigateTo: 'Perfil' },
        { icon: 'settings', label: 'Configuración' },
        { icon: 'logout', label: 'Cerrar sesión', onPress: () => navigation.navigate('Login') }
    ];

    var nombre = "Luis";
    var apellido = "Bravo";
    var correo = "luisbravo@hotmail.com";
    var telefono = "0990909099";
    var direccion = "Calle Falsa 123";

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
                    <Text style={{ fontSize: 20, marginBottom: 10, textAlign: 'center' }}>Bienvenido, Luis:</Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Nombre:</Text>
                        <Text style={styles.value}>{nombre}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Apellido:</Text>
                        <Text style={styles.value}>{apellido}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Correo:</Text>
                        <Text style={styles.value}>{correo}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Teléfono:</Text>
                        <Text style={styles.value}>{telefono}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Dirección:</Text>
                        <Text style={styles.value}>{direccion}</Text>
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigation.navigate('Perfil')}
                        >
                            <Text style={styles.buttonText}>Editar Perfil</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default Dashboard;