import React from 'react'
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import style_login from '../styles/style_login'
import { Platform } from 'react-native';


const Login = () => {
  const navigation = useNavigation()
    const irARegistro = () => {
        navigation.navigate("Registro");
    };

    const irADashboard = () => {
        if (Platform.OS === 'web') {
            navigation.navigate("Dashboard");
        } else {
            navigation.navigate("MainTabs");
        }
    }
  return (
    <View style={style_login.container}>
      <View style={style_login.loginBox}>
        
        <Text style={style_login.title}>Iniciar sesión</Text>

        <Text style={style_login.label}>Correo:</Text>
        <TextInput
          placeholder="Ingrese su correo"
          keyboardType="email-address"
          style={style_login.input}
        />

        <Text style={style_login.label}>Contraseña:</Text>
        <TextInput
          placeholder="Ingrese su contraseña"
          secureTextEntry
          style={style_login.input}
        />

        <TouchableOpacity style={style_login.button}>
          <Text style={style_login.buttonText} onPress={irADashboard} >Iniciar Sesión</Text>
        </TouchableOpacity>


        <Text style={style_login.registerText} onPress={irARegistro} >
          No tienes cuenta? Registrate aqui
        </Text>
      </View>
    </View>
  )
}
export default Login
