import React, { useState, useContext } from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import style_login from '../styles/style_login'
import { Platform } from 'react-native'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../contexts/AuthContext';
import { useAwesomeAlert } from '../contexts/AwesomeAlert'
import api from '../components/api';



const Login = () => {
  const { loginWC } = useContext(AuthContext);
  const navigation = useNavigation()
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { showAlert } = useAwesomeAlert();

  const irARegistro = () => {
    navigation.navigate("Registro")
  }

const handleSubmit = async () => {
  const result = await loginWC({ email, password });
  
  if (result.token && result.user) {
    showAlert({
      title: 'Éxito',
      message: result.message,
      onConfirm: () => {
        // La redirección ahora se manejará automáticamente por el Router
        // basado en el estado de autenticación y el rol del usuario
      },
    });
  } else {
    showAlert({
      title: 'Error',
      message: result.message,
      showCancel: false,
    });
  }
};

  return (
    <View style={style_login.container}>
      <View style={style_login.loginBox}>
        <Text style={style_login.title}>Iniciar sesión</Text>

        <Text style={style_login.label}>Correo:</Text>
        <TextInput
          placeholder="Ingrese su correo"
          keyboardType="email-address"
          style={style_login.input}
          value={email}
          onChangeText={setEmail}

        />

        <Text style={style_login.label}>Contraseña:</Text>
        <TextInput
          placeholder="Ingrese su contraseña"
          secureTextEntry
          style={style_login.input}
          value={password}
          onChangeText={setPassword}
          mode="outlined"

        />

        <TouchableOpacity style={style_login.button} onPress={handleSubmit}>
          <Text style={style_login.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>

        <Text style={style_login.registerText} onPress={irARegistro}>
          No tienes cuenta? Registrate aqui
        </Text>
      </View>
    </View>
  )
}

export default Login