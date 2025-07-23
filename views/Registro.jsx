import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import style_registro from '../styles/style_registro';
import axios from 'axios';
import { useAwesomeAlert } from '../contexts/AwesomeAlert'
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../components/api'
import { AuthContext } from '../contexts/AuthContext';

const Registro = () => {
  
  const navigation = useNavigation();

  const { registerUser } = useContext(AuthContext);

  const { showAlert } = useAwesomeAlert();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

const handleSubmit = async () => {
  if (!form.name || !form.email || !form.password || !form.password_confirmation) {
    showAlert({
      title: 'Error',
      message: 'Por favor, complete todos los campos.',
      showCancel: false,
    });
    return;
  }

  if (form.password !== form.password_confirmation) {
    showAlert({
      title: 'Error',
      message: 'Las contraseñas no coinciden.',
      showCancel: false,
    });
    return;
  }

  setLoading(true);

  const result = await registerUser(form); 

  if (result.success) {
    showAlert({
      title: 'Éxito',
      message: result.message,
      showCancel: false,
      onConfirm: () => navigation.navigate('Login'),
    });
  } else {
    showAlert({
      title: 'Error',
      message: result.message,
      showCancel: false,
    });
  }

  setLoading(false);
};

  return (
    <View style={style_registro.container}>
      <View style={style_registro.registerBox}>
        <Text style={style_registro.title}>Registro</Text>

        <Text style={style_registro.label}>Nombre:</Text>
        <TextInput
          style={style_registro.input}
          placeholder="Ingrese su nombre"
          value={form.name}
          onChangeText={(text) => handleChange('name', text)}
        />

        <Text style={style_registro.label}>Correo:</Text>
        <TextInput
          style={style_registro.input}
          placeholder="Ingrese su correo"
          keyboardType="email-address"
          value={form.email}
          onChangeText={(text) => handleChange('email', text)}
        />

        <Text style={style_registro.label}>Contraseña:</Text>
        <TextInput
          style={style_registro.input}
          placeholder="Ingrese su contraseña"
          secureTextEntry
          value={form.password}
          onChangeText={(text) => handleChange('password', text)}
        />

        <Text style={style_registro.label}>Confirmar Contraseña:</Text>
        <TextInput
          style={style_registro.input}
          placeholder="Confirme su contraseña"
          secureTextEntry
          value={form.password_confirmation}
          onChangeText={(text) => handleChange('password_confirmation', text)}
        />

        <TouchableOpacity
          style={style_registro.button}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={style_registro.buttonText}>
            {loading ? 'Registrando...' : 'Registrarse'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Registro;