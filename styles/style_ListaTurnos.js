import { StyleSheet, Platform } from "react-native";

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
    backgroundColor: 'white', 
    padding: 16,
  },
  menuButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
  },
  drawerContainer: {
    backgroundColor: '#fff',
    padding: 20,
    width: 250,
    alignSelf: 'flex-start',
    borderRadius: 10,
    minHeight: 300,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
    flexGrow: 1,
    ...(Platform.OS === 'web' && {
      maxHeight: '90vh',
      overflowY: 'auto',
    }),
  },
  card: {
    marginVertical: 10,
    marginHorizontal: 16,
    borderRadius: 12,
    elevation: 3,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    padding: 0,
  },
  turnoInfo: {
    marginBottom: 8,
    fontSize: 16,
    color: '#222',
  },
  turnoPaciente: {
    fontWeight: 'bold',
    color: '#1d1d1dff',
    marginTop: 4,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 12,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalList: {
    maxHeight: 300,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  modalPatientName: {
    fontSize: 16,
  },
  modalPatientEmail: {
    color: '#888',
    fontSize: 13,
  },
  modalButton: {
    backgroundColor: '#0c0c0cff',
    padding: 5,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5,
  },
  renderButton: {
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
});
