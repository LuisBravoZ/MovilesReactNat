import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import style_registro from '../styles/style_registro';
import axios from 'axios';

const Registro = () => {
  const navigation = useNavigation();
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
    // Validación de campos
    if (!form.name || !form.email || !form.password || !form.password_confirmation) {
      Alert.alert('Error', 'Por favor, complete todos los campos.');
      return;
    }
    
    // Validación de contraseñas coincidentes
    if (form.password !== form.password_confirmation) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/register', {
        name: form.name,
        email: form.email,
        password: form.password,
        password_confirmation: form.password_confirmation,
      });

      Alert.alert('Éxito', 'Registro completado correctamente');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error en el registro:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.message || 'Error al registrar');
    } finally {
      setLoading(false);
    }
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