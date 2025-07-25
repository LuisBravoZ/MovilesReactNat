import React, { useState, useContext } from 'react';
import { View, ScrollView, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { Text, Button, TextInput, Divider, IconButton } from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { AuthContext } from '../../contexts/AuthContext';
import Sidebar from '../../components/Sidebar';
import { useNavigation } from '@react-navigation/native';
import { useAwesomeAlert } from '../../contexts/AwesomeAlert';
import DateTimePicker from '@react-native-community/datetimepicker';



const CrearTurnos = () => {

  const navigation = useNavigation();
  const { logout, crearTurnos } = useContext(AuthContext);
  const { showAlert } = useAwesomeAlert();

  const [drawerVisible, setDrawerVisible] = useState(false);

  const sidebarItems = [
    { icon: 'star', label: 'NutricionistaUser', navigateTo: 'NutricionistaUser' },
    { icon: 'calendar-plus', label: 'Crear Turnos', navigateTo: 'CrearTurnos' },
        { icon: 'account', label: 'Listar Turnos', navigateTo: 'ListaTurnos' },

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

  const [form, setForm] = useState({
    fecha_inicio: '',
    fecha_fin: '',
    hora_inicio: '',
    hora_fin: '',
    descanso_inicio: '',
    descanso_fin: '',
  });

  const [picker, setPicker] = useState({
    mode: 'date',
    field: null,
    visible: false,
  });


  const [showPicker, setShowPicker] = useState({
    field: null,
    mode: 'date',
    visible: false,
    date: new Date()
  });

  const handlePickerChange = (event, selectedDate) => {
    setShowPicker({ ...showPicker, visible: false });

    if (selectedDate) {
      const value = showPicker.mode === 'time'
        ? moment(selectedDate).format('HH:mm')
        : moment(selectedDate).format('YYYY-MM-DD');

      setForm({ ...form, [showPicker.field]: value });
    }
  };
  const hidePicker = () => {
    setPicker({ ...picker, visible: false });
  };

  const handleConfirm = (date) => {
    const value = picker.mode === 'time'
      ? moment(date).format('HH:mm')
      : moment(date).format('YYYY-MM-DD');
    console.log('Valor seleccionado:', picker.field, value);

    setForm({ ...form, [picker.field]: value });
    hidePicker();
  };

  const openPicker = (field, mode) => {
    // Establecer fecha actual o la existente en el formulario
    let initialDate = new Date();
    const currentValue = form[field];

    if (currentValue) {
      initialDate = mode === 'time'
        ? moment(currentValue, mode === 'time' ? 'HH:mm' : 'YYYY-MM-DD').toDate()
        : moment(currentValue, 'YYYY-MM-DD').toDate();
    }

    setShowPicker({
      field,
      mode,
      visible: true,
      date: initialDate
    });
  };

  const handleSubmit = async () => {
    if (!form.fecha_inicio || !form.fecha_fin || !form.hora_inicio || !form.hora_fin) {
      showAlert({
        title: 'Error',
        message: 'Por favor complete todos los campos obligatorios.',
        showCancel: false,
      });
      return;
    }

    if (moment(form.fecha_fin).isBefore(moment(form.fecha_inicio))) {
      showAlert({
        title: 'Error',
        message: 'La Fecha Fin debe ser igual o posterior a la Fecha Inicio.',
        showCancel: false,
      });
      return;
    }

    const validarHora = (hora) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(hora);

    if (!validarHora(form.hora_inicio) || !validarHora(form.hora_fin)) {
      showAlert({
        title: 'Error',
        message: 'La Hora Inicio y Hora Fin deben tener formato HH:mm (ejemplo: 14:30).',
        showCancel: false,
      });
      return;
    }

    try {
      const res = await crearTurnos(form);
      showAlert({
        title: 'Éxito',
        message: res.message || 'Turno creado correctamente',
        onConfirm: () => {
          setForm({
            fecha_inicio: '',
            fecha_fin: '',
            hora_inicio: '',
            hora_fin: '',
            descanso_inicio: '',
            descanso_fin: '',
          });
        }
      });
    } catch (error) {
      showAlert({
        title: 'Error',
        message: error?.message || 'No se pudo crear el turno',
        showCancel: false,
      });
    }
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

      <ScrollView contentContainerStyle={{ ...styles.scrollContainer, flexGrow: 1 }}>
        <Text variant="titleLarge" style={styles.title}>Crear Turnos</Text>

        {/* Campos de fecha y hora */}

        <View style={styles.inputGroup}>
          {/* Fecha Inicio */}
          <TouchableOpacity
            onPress={() => openPicker('fecha_inicio', 'date')}
            style={styles.inputTouchable}
          >
            <TextInput
              label="Fecha Inicio*"
              value={form.fecha_inicio}
              style={styles.input}
              editable={false}
              pointerEvents="none"
              right={<TextInput.Icon icon="calendar" />}
            />
          </TouchableOpacity>

          {/* Fecha Fin */}
          <TouchableOpacity
            onPress={() => openPicker('fecha_fin', 'date')}
            style={styles.inputTouchable}
          >
            <TextInput
              label="Fecha Fin*"
              value={form.fecha_fin}
              style={styles.input}
              editable={false}
              pointerEvents="none"
              right={<TextInput.Icon icon="calendar" />}
            />
          </TouchableOpacity>

          {/* Hora Inicio */}
          <TouchableOpacity
            onPress={() => openPicker('hora_inicio', 'time')}
            style={styles.inputTouchable}
          >
            <TextInput
              label="Hora Inicio*"
              value={form.hora_inicio}
              style={styles.input}
              editable={false}
              pointerEvents="none"
              right={<TextInput.Icon icon="clock-outline" />}
            />
          </TouchableOpacity>

          {/* Hora Fin */}
          <TouchableOpacity
            onPress={() => openPicker('hora_fin', 'time')}
            style={styles.inputTouchable}
          >
            <TextInput
              label="Hora Fin*"
              value={form.hora_fin}
              style={styles.input}
              editable={false}
              pointerEvents="none"
              right={<TextInput.Icon icon="clock-outline" />}
            />
          </TouchableOpacity>

          {/* Descanso Inicio */}
          <TouchableOpacity
            onPress={() => openPicker('descanso_inicio', 'time')}
            style={styles.inputTouchable}
          >
            <TextInput
              label="Descanso Inicio"
              value={form.descanso_inicio}
              style={styles.input}
              editable={false}
              pointerEvents="none"
              right={<TextInput.Icon icon="clock-outline" />}
            />
          </TouchableOpacity>

          {/* Descanso Fin */}
          <TouchableOpacity
            onPress={() => openPicker('descanso_fin', 'time')}
            style={styles.inputTouchable}
          >
            <TextInput
              label="Descanso Fin"
              value={form.descanso_fin}
              style={styles.input}
              editable={false}
              pointerEvents="none"
              right={<TextInput.Icon icon="clock-outline" />}
            />
          </TouchableOpacity>
        </View>

        {/* Botón */}
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          Crear Turnos
        </Button>

        {/* Selector de fecha/hora (Android) */}

        {showPicker.visible && (
          Platform.OS === 'web' ? (
            <DateTimePickerModal
              isVisible={showPicker.visible}
              mode={showPicker.mode}
              date={showPicker.date}
              onConfirm={(date) => handlePickerChange(null, date)}
              onCancel={() => setShowPicker({ ...showPicker, visible: false })}
              locale="es-ES"
              is24Hour
            />
          ) : (
            <DateTimePicker
              value={showPicker.date}
              mode={showPicker.mode}
              is24Hour={true}
              display="default"
              onChange={handlePickerChange}
              locale="es-ES"
            />
          )
        )}

      </ScrollView>
    </View>
  );
};

export default CrearTurnos;
const shadowStyle = Platform.OS === 'web'
  ? { boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }
  : {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
  };
const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 12,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
  },
  divider: {
    marginVertical: 10,
  },
   button: {
    marginTop: 20,
    borderRadius: 8,
    backgroundColor: '#0e0e0eff',
  },
  menuButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
  },
  drawerContainer: {
    backgroundColor: '#fff',
    padding: 20,
    width: 250,
    alignSelf: 'flex-start',
    borderRadius: 10,
    minHeight: 300,
  },

  dashbox:
  {
    backgroundColor: '#fff',
    paddingVertical: 40,
    paddingHorizontal: 30,
    width: 350,
    borderRadius: 12,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    alignItems: 'center',
    ...shadowStyle
  },
   scrollContainer: {
    padding: 20,
    paddingBottom: 40,
    flexGrow: 1,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  inputGroup: {
    gap: 1,
    marginBottom: 20,
  },
  inputTouchable: {
    width: '100%',
    marginBottom: 16,
  },
 
  
});