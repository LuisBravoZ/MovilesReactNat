import React from 'react'
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'

const Login = () => {
  const navigation = useNavigation()

  return (
    <View style={styles.container}>
      <View style={styles.loginBox}>
        <Text style={styles.title}>Iniciar sesión</Text>

        <Text style={styles.label}>Correo</Text>
        <TextInput
          placeholder="Ingrese su correo"
          keyboardType="email-address"
          style={styles.input}
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          placeholder="Ingrese su contraseña"
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>


        <Text style={styles.registerText} onPress={() => navigation.navigate('Registro')} >No tienes cuenta? Registrate aqui</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
    justifyContent: 'center',
    alignItems: 'center'
  },
  loginBox: {
    backgroundColor: '#fff',
    paddingVertical: 40,
    paddingHorizontal: 30,
    width: 350,
    borderRadius: 12,
    elevation: 10, // para sombra en Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    textAlign: 'center'
  },
  title: {
    fontSize: 24,
    color: '#2d3436',
    marginBottom: 24,
    textAlign: 'center'
  },
  label: {
    color: '#636e72',
    fontSize: 15,
    marginTop: 8,
    marginBottom: 4
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#dfe6e9',
    borderRadius: 6,
    fontSize: 15,
    marginBottom: 16
  },
  button: {
    backgroundColor: '#0984e3',
    padding: 12,
    borderRadius: 6,
    marginVertical: 8
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center'
  },
  registerText: {
    color: '#636e72',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 16
  }
})

export default Login
