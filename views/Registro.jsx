import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'

const Registro = () => {
  const navigation = useNavigation()
  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    cedula: '',
    celular: '',
    contraseña: ''
  })

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = () => {
    // Aquí puedes enviar los datos a tu API o manejarlos localmente
    console.log('Datos del formulario:', form)
    // Luego puedes redirigir o limpiar el formulario si deseas
    navigation.navigate('Login')
  }

  return (
    <View style={styles.container}>
      <View style={styles.registerBox}>
        <Text style={styles.title}>Registro</Text>

        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingrese su nombre"
          value={form.nombre}
          onChangeText={(text) => handleChange('nombre', text)}
        />

        <Text style={styles.label}>Correo</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingrese su correo"
          keyboardType="email-address"
          value={form.correo}
          onChangeText={(text) => handleChange('correo', text)}
        />

        <Text style={styles.label}>Cédula</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingrese su cédula"
          keyboardType="numeric"
          value={form.cedula}
          onChangeText={(text) => handleChange('cedula', text)}
        />

        <Text style={styles.label}>Celular</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingrese su número celular"
          keyboardType="phone-pad"
          value={form.celular}
          onChangeText={(text) => handleChange('celular', text)}
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingrese su contraseña"
          secureTextEntry
          value={form.contraseña}
          onChangeText={(text) => handleChange('contraseña', text)}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>
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
  registerBox: {
    backgroundColor: '#fff',
    paddingVertical: 40,
    paddingHorizontal: 30,
    width: 350,
    borderRadius: 12,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6
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
    marginBottom: 10
  },
  button: {
    backgroundColor: '#0984e3',
    padding: 12,
    borderRadius: 6,
    marginTop: 12
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center'
  }
})

export default Registro
