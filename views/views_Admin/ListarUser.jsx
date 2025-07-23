import React, { useState, useEffect, useContext } from 'react';
import { View, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Text, IconButton, Button, Modal, Portal, Provider, TextInput } from 'react-native-paper';
import styles from '../../styles/style_dashboard';
import Sidebar from '../../components/Sidebar';
import { AuthContext } from '../../contexts/AuthContext';
import { useAwesomeAlert } from '../../contexts/AwesomeAlert';

const ListarUser = () => {
  const { logout, ListarUsers, eliminarUsuario, editarUsuarioAdmin } = useContext(AuthContext);
  const { showAlert } = useAwesomeAlert();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [users, setUsers] = useState([]);

  const [visible, setVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    roles_id: '',
  });

  const handleLogout = () => {
    showAlert({
      title: 'Cerrar sesión',
      message: '¿Está seguro que quiere cerrar sesión?',
      onConfirm: () => logout(),
      showCancel: true,
    });
  };

  const sidebarItems = [
    { icon: 'star', label: 'AdminUser', navigateTo: 'AdminUser' },
    { icon: 'account-plus', label: 'Agregar Usuario', navigateTo: 'AgregarUsuario' },
    { icon: 'account-multiple', label: 'Listar Usuario', navigateTo: 'ListarUser' },
    { icon: 'account', label: 'Perfil', navigateTo: 'Perfil' },
    { icon: 'logout', label: 'Cerrar sesión', onPress: handleLogout }
  ];

  const fetchUsers = async () => {
    try {
      const data = await ListarUsers();
      setUsers(Array.isArray(data) ? data : data.users);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const abrirModal = (user) => {
    setSelectedUser(user);
    setForm({
      name: user.name,
      email: user.email,
      password: '',
      password_confirmation: '',
      roles_id: user.roles_id?.toString() || '3',
    });
    setVisible(true);
  };

  const cerrarModal = () => {
    setVisible(false);
    setSelectedUser(null);
    setForm({
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      roles_id: '',
    });
  };

  const guardarCambios = async () => {
    if (!selectedUser) return;
    const result = await editarUsuarioAdmin(selectedUser.id, form);
    if (result.success) {
      showAlert({ title: 'Éxito', message: result.message });
      cerrarModal();
      fetchUsers();
    } else {
      showAlert({ title: 'Error', message: result.message });
    }
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
            showAlert({ title: 'Éxito', message: result.message });
            fetchUsers();
          } else {
            showAlert({ title: 'Error', message: result.message });
          }
        } catch (error) {
          console.error('Error inesperado:', error);
          showAlert({ title: 'Error', message: 'Ocurrió un error al eliminar el usuario.' });
        }
      },
    });
  };

  return (
    <Provider>
      <View style={styles.container}>
        {Platform.OS === 'web' && (
          <TouchableOpacity style={styles.menuButton} onPress={() => setDrawerVisible(true)}>
            <IconButton icon="menu" size={28} />
          </TouchableOpacity>
        )}

        <Sidebar
          navigation={null}
          visible={drawerVisible}
          onClose={() => setDrawerVisible(false)}
          items={sidebarItems}
          style={styles}
        />

        <View style={styles.content}>
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
                <View key={user.id} style={{ flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderColor: '#ddd' }}>
                  <Text style={{ width: 50 }}>{user.id}</Text>
                  <Text style={{ width: 150 }}>{user.name}</Text>
                  <Text style={{ width: 180 }}>{user.email}</Text>
                  <Text style={{ width: 100 }}>{user.roles?.nombre_rol || 'N/A'}</Text>
                  <View style={{ width: 120, flexDirection: 'row' }}>
                    <Button icon="pencil" compact onPress={() => abrirModal(user)} />
                    <Button icon="delete" compact onPress={() => confirmarEliminarUsuario(user.id)} />
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* MODAL */}
        <Portal>
          <Modal visible={visible} onDismiss={cerrarModal} contentContainerStyle={{ backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 10 }}>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>Editar Usuario</Text>
            <TextInput label="Nombre" value={form.name} onChangeText={text => setForm({ ...form, name: text })} />
            <TextInput label="Email" value={form.email} onChangeText={text => setForm({ ...form, email: text })} keyboardType="email-address" />
            <TextInput label="Contraseña (opcional)" value={form.password} onChangeText={text => setForm({ ...form, password: text })} secureTextEntry />
            <TextInput label="Confirmar Contraseña" value={form.password_confirmation} onChangeText={text => setForm({ ...form, password_confirmation: text })} secureTextEntry />
            <TextInput label="Rol ID (1=Admin, 2=Nutri, 3=Paciente)" value={form.roles_id} onChangeText={text => setForm({ ...form, roles_id: text })} keyboardType="numeric" />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20 }}>
              <Button onPress={cerrarModal} style={{ marginRight: 10 }}>Cancelar</Button>
              <Button mode="contained" onPress={guardarCambios}>Guardar</Button>
            </View>
          </Modal>
        </Portal>
      </View>
    </Provider>
  );
};

export default ListarUser;
