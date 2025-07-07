import React, { useState, useContext } from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import style_login from '../styles/style_login'
import { Platform } from 'react-native'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../contexts/AuthContext'; 

const Login = () => {
  const navigation = useNavigation()
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const irARegistro = () => {
    navigation.navigate("Registro")
  }

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', {
        email: email,
        password: password,
      });
      console.log('Login successful:', response.data);

     
      if (Platform.OS === 'web') {
        localStorage.setItem('token', response.data.token);
      } else {
        await AsyncStorage.setItem('token', response.data.token);
      }
      await login(response.data.token);

    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error.message);
      alert('Error al iniciar sesión. Por favor, verifique sus credenciales.');
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