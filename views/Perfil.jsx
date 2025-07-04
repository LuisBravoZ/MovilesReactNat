import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text, TextInput, IconButton, Button } from 'react-native-paper';
import styles from '../styles/style_perfil';
import Sidebar from '../components/Sidebar';
import { Platform } from 'react-native';


const Perfil = ({ navigation }) => {
    const [drawerVisible, setDrawerVisible] = useState(false);

    const sidebarItems = [
        { icon: 'star', label: 'Dashboard', navigateTo: 'Dashboard' },
        { icon: 'account', label: 'Perfil', navigateTo: 'Perfil' },
        { icon: 'settings', label: 'Configuración' },
        { icon: 'logout', label: 'Cerrar sesión', onPress: () => navigation.navigate('Login') }
    ];

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
                        placeholder="Nombre completo"
                        mode="outlined"
                        style={styles.input}
                    />
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Correo:</Text>
                    <TextInput
                        placeholder="Correo electrónico"
                        mode="outlined"
                        style={styles.input}
                    />

                </View>
                <View>
                    <Button
                        icon="pencil"
                        mode="contained"
                        onPress={() => console.log('Guardar cambios')}
                        style={styles.button}>
                        Actualizar Perfil
                    </Button>
                </View>
            </View>
        </View>
        
    );
};

export default Perfil;