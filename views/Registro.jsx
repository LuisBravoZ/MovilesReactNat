import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import style_registro from '../styles/style_registro'

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
    <View style={style_registro.container}>
      <View style={style_registro.registerBox}>
        <Text style={style_registro.title}>Registro</Text>

        <Text style={style_registro.label}>Nombre:</Text>
        <TextInput
          style={style_registro.input}
          placeholder="Ingrese su nombre"
          value={form.nombre}
          onChangeText={(text) => handleChange('nombre', text)}
        />

        <Text style={style_registro.label}>Correo:</Text>
        <TextInput
          style={style_registro.input}
          placeholder="Ingrese su correo"
          keyboardType="email-address"
          value={form.correo}
          onChangeText={(text) => handleChange('correo', text)}
        />

        <Text style={style_registro.label}>Cédula:</Text>
        <TextInput
          style={style_registro.input}
          placeholder="Ingrese su cédula"
          keyboardType="numeric"
          value={form.cedula}
          onChangeText={(text) => handleChange('cedula', text)}
        />

        <Text style={style_registro.label}>Celular:</Text>
        <TextInput
          style={style_registro.input}
          placeholder="Ingrese su número celular"
          keyboardType="phone-pad"
          value={form.celular}
          onChangeText={(text) => handleChange('celular', text)}
        />

        <Text style={style_registro.label}>Contraseña:</Text>
        <TextInput
          style={style_registro.input}
          placeholder="Ingrese su contraseña"
          secureTextEntry
          value={form.contraseña}
          onChangeText={(text) => handleChange('contraseña', text)}
        />

        <TouchableOpacity style={style_registro.button} onPress={handleSubmit}>
          <Text style={style_registro.buttonText}>Registrarse</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Registro
