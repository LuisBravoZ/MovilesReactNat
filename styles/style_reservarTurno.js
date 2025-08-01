import { StyleSheet, Platform } from 'react-native';

const shadowStyle = Platform.OS === 'web'
    ? { boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }
    : {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 10,
    };

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    formContainer: {
        flex: 1, 
        padding: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    picker: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 20,
    },
    turnoCard: {
        backgroundColor: '#f9f9f9',
        padding: 16,
        borderRadius: 10,
        marginBottom: 10,
        borderColor: '#ddd',
        borderWidth: 1,
    },
    turnoTexto: {
        fontSize: 16,
    },
    botonReservar: {
        marginTop: 10,
        backgroundColor: '#0f0f0fff',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    botonReservarTexto: {
        color: '#fff',
        fontWeight: 'bold',
    },
    sinTurnos: {
        marginTop: 10,
        fontStyle: 'italic',
        color: '#999',
    },
    dashbox:
    {
        margin: 20,
        padding: 20,
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
    drawerContainer: {
        backgroundColor: '#fff',
        padding: 20,
        width: 250,
        alignSelf: 'flex-start',
        borderRadius: 10,
        minHeight: 300,
    },
    subtitulo: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    botonReservar: {
  backgroundColor: '#141414ff',
  padding: 10,
  borderRadius: 8,
  alignItems: 'center',
  marginVertical: 5
},
turnoCardElegante: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#e8f5e9',
  borderRadius: 14,
  padding: 16,
  marginBottom: 14,
  borderWidth: 1.5,
  borderColor: '#43a047',
  ...shadowStyle,
},
turnoIconBox: {
  width: 48,
  height: 48,
  borderRadius: 24,
  backgroundColor: '#43a04722',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 16,
},
turnoIcon: {
  fontSize: 28,
  color: '#43a047',
},
turnoFecha: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#222',
  marginBottom: 2,
},
turnoHora: {
  fontSize: 15,
  color: '#1976d2',
  marginBottom: 2,
},
turnoEstado: {
  fontSize: 15,
  color: '#43a047',
  fontWeight: 'bold',
  marginBottom: 2,
},
turnoLabelIcon: {
  fontSize: 16,
  marginRight: 4,
},

});
