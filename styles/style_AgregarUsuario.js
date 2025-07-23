import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6', // gris claro moderno
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  menuButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
    borderRadius: 8,
    elevation: 4,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
   drawerContainer: {
        backgroundColor: '#fff',
        padding: 20,
        width: 250,
        alignSelf: 'flex-start',
        borderRadius: 10,
        minHeight: 300,
    },
  dashbox: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    elevation: 5, // sombra en Android
    shadowColor: '#000', // sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  h1: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827', // gris oscuro
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#ffffff',
  },
  button: {
    marginTop: 10,
    paddingVertical: 6,
    backgroundColor: '#0a0a0aff', // azul moderno
    borderRadius: 10,
  },
  picker: {
  backgroundColor: '#fff',
  borderWidth: 1,
  borderColor: '#d1d5db', // gris claro
  borderRadius: 8,
  paddingHorizontal: 10,
  marginBottom: 15,
  color: '#111827',
  height: 50,
  justifyContent: 'center',
},

});
