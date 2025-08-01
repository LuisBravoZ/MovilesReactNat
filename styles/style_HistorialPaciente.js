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
    flexDirection: 'row',
    backgroundColor: '#f7faff',
  },
  menuButton: {
    position: 'absolute',
    top: 20,
    left: 10,
    zIndex: 2,
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
  closeIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 4,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: Platform.OS === 'web' ? 0 : 8,
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 18,
    textAlign: 'center',
  },
  loading: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 30,
  },
  empty: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 30,
  },
  list: {
    paddingBottom: 30,
    width: '100%',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eaf6ff',
    borderRadius: 12,
    padding: Platform.OS === 'web' ? 16 : 10,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 2,
    width: '100%',
  },
  icon: {
    fontSize: 28,
    marginRight: 14,
  },
  info: {
    flex: 1,
  },
  label: {
    fontSize: 15,
    color: '#34495e',
    marginBottom: 2,
  },
  drawerContainer: {
        backgroundColor: '#fff',
        padding: 20,
        width: 250,
        alignSelf: 'flex-start',
        borderRadius: 10,
        minHeight: 300,
    }
});