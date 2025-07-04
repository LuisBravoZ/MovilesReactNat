import { StyleSheet } from "react-native"

export default StyleSheet.create({
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
    color: '#000000',
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
    marginBottom: 10,
    color: '#888888'
  },
  button: {
    backgroundColor: '#000000',
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