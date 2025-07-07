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
        flexDirection: 'row',
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
    content: {
        flex: 1,
        padding: 24,
        backgroundColor: '#fff',
        marginLeft: 0,
        justifyContent: 'center',
        alignItems: 'center',
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
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
        width: '100%',
        justifyContent: 'space-between',
    },
    label: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#000000',
        minWidth: 90,
    },
    h1: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 20,
        textAlign: 'center',
    },
    value: {
        fontSize: 16,
        color: '#333',
        backgroundColor: '#f5f5f5',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
        flex: 1,
        textAlign: 'right',
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: 24,
    },
    button: {
        backgroundColor: '#000000',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 32,
        elevation: 3,
        minWidth: 180,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    },
});