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
        flex: 1, // 👈 Asegura esto
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
  backgroundColor: '#4CAF50',
  padding: 10,
  borderRadius: 8,
  alignItems: 'center',
  marginVertical: 5
},

});
