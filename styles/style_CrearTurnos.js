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
    padding: 20,},
  scrollContainer: {
    padding: 20,
    flexGrow: 1,

  },
  containerview:{
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  }
  ,
  title: {
    fontSize: 22,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 20,
    borderRadius: 8,
    backgroundColor: '#141414ff',
  },
  buttonContent: {
    paddingVertical: 8,
  },
  menuButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  webInput: {
    marginBottom: 16,
    padding: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    width: '100%',
    boxSizing: 'border-box',
  },
  inputTouchable: {
    width: '100%',
    marginBottom: 16,
  },
  drawer: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: 200,
        height: '100%',
        backgroundColor: '#f5f5f5',
        borderRightWidth: 1,
        borderRightColor: '#ddd',
        justifyContent: 'flex-start',
        paddingTop: 40,
        zIndex: 3,
  },
  dashbox:
    {
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
});
