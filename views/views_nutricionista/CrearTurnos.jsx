import React, { useState, useContext } from 'react';
import { View, ScrollView, StyleSheet, Platform, TouchableOpacity, Text as RNText } from 'react-native';
import { Text, Button, TextInput, IconButton } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { AuthContext } from '../../contexts/AuthContext';
import Sidebar from '../../components/Sidebar';
import { useNavigation } from '@react-navigation/native';
import { useAwesomeAlert } from '../../contexts/AwesomeAlert';
import styles from '../../styles/style_CrearTurnos';


function pad(num) {
  return String(num).padStart(2, '0');
}
function formatDate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}
function formatTime(date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

const CrearTurnos = () => {
  const navigation = useNavigation();
  const { logout, crearTurnos } = useContext(AuthContext);
  const { showAlert } = useAwesomeAlert();

  const isWeb = Platform.OS === 'web';

  const [drawerVisible, setDrawerVisible] = useState(false);

  const [form, setForm] = useState({
    fecha_inicio: new Date(),
    fecha_fin: new Date(),
    hora_inicio: new Date().setHours(8, 0, 0, 0),
    hora_fin: new Date().setHours(16, 0, 0, 0),
    descanso_inicio: new Date().setHours(12, 0, 0, 0),
    descanso_fin: new Date().setHours(13, 0, 0, 0),
  });

  const [picker, setPicker] = useState({ visible: false, field: '', mode: 'date' });

  const sidebarItems = [
    { icon: 'star', label: 'NutricionistaUser', navigateTo: 'NutricionistaUser' },
    { icon: 'calendar-plus', label: 'Crear Turnos', navigateTo: 'CrearTurnos' },
    { icon: 'calendar-plus', label: 'Listar Turnos', navigateTo: 'ListaTurnos' },
    { icon: 'calendar-check', label: 'Historial Turnos', navigateTo: 'HistorialTurnosCompletados' },
    { icon: 'account', label: 'Perfil', navigateTo: 'Perfil' },
    { icon: 'logout', label: 'Cerrar sesión', onPress: handleLogout },
  ];

  function handleLogout() {
    showAlert({
      title: 'Cerrar sesión',
      message: '¿Está seguro que quiere cerrar sesión?',
      onConfirm: () => logout(navigation),
      showCancel: true,
    });
  }

  const handleChange = (field, date) => {
    setForm(prev => ({ ...prev, [field]: date }));
  };

  const openPicker = (field, mode) => {
    setPicker({ visible: true, field, mode });
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        fecha_inicio: formatDate(new Date(form.fecha_inicio)),
        fecha_fin: formatDate(new Date(form.fecha_fin)),
        hora_inicio: formatTime(new Date(form.hora_inicio)),
        hora_fin: formatTime(new Date(form.hora_fin)),
        descanso_inicio: formatTime(new Date(form.descanso_inicio)),
        descanso_fin: formatTime(new Date(form.descanso_fin)),
      };
      await crearTurnos(payload);
      showAlert({ title: 'Éxito', message: 'Turnos generados correctamente', showCancel: false });
    } catch (error) {
      showAlert({ title: 'Error', message: 'No se pudo crear el turno', showCancel: false });
    }
  };

  const renderPicker = () => {
    if (!picker.visible || isWeb) return null;
    return (
      <DateTimePicker
        value={new Date(form[picker.field])}
        mode={picker.mode}
        is24Hour
        display="default"
        onChange={(event, date) => {
          setPicker({ ...picker, visible: false });
          if (date) handleChange(picker.field, date);
        }}
      />
    );
  };

  const renderInput = (label, field, mode) => {
    const value = new Date(form[field]);
    return isWeb ? (
      <>
        <RNText style={styles.label}>{label}</RNText>
        <input
          type={mode}
          value={mode === 'date' ? formatDate(value) : formatTime(value)}
          onChange={e => {
            const [h, m] = e.target.value.split(':');
            const date = new Date(form[field]);
            if (mode === 'date') {
              const [yy, mm, dd] = e.target.value.split('-');
              handleChange(field, new Date(yy, mm - 1, dd));
            } else {
              date.setHours(h, m, 0, 0);
              handleChange(field, date);
            }
          }}
          style={styles.webInput}
        />
      </>
    ) : (
      <TouchableOpacity
        onPress={() => openPicker(field, mode)}
        style={styles.inputTouchable}
      >
        <TextInput
          label={label}
          value={mode === 'date' ? formatDate(value) : formatTime(value)}
          style={styles.input}
          editable={false}
          pointerEvents="none"
          right={<TextInput.Icon icon={mode === 'date' ? 'calendar' : 'clock-outline'} />}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {isWeb && (
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

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.containerview}>
        <Text style={styles.title}>Crear Turnos</Text>

        {renderInput('Fecha Inicio*', 'fecha_inicio', 'date')}
        {renderInput('Fecha Fin*', 'fecha_fin', 'date')}
        {renderInput('Hora Inicio*', 'hora_inicio', 'time')}
        {renderInput('Hora Fin*', 'hora_fin', 'time')}
        {renderInput('Descanso Inicio', 'descanso_inicio', 'time')}
        {renderInput('Descanso Fin', 'descanso_fin', 'time')}

        {renderPicker()}

        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          Crear Turnos
        </Button>
        </View>
      </ScrollView>
    </View>
  );
};

export default CrearTurnos;
