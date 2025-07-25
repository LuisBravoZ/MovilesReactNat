import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Login from '../views/Login'
import Registro from '../views/Registro'
import Dashboard from '../views/Dashboard'
import Perfil from '../views/Perfil'
import LogoutTab from '../views/LogoutTab'
import { Platform } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { navigationRef } from '../components/NavigationService';
import AdminUser from '../views/views_Admin/AdminUser';
import NutricionistaUser from '../views/views_nutricionista/NutricionistaUser';
import AgregarUsuario from '../views/views_Admin/AgregarUsuario';
import ListarUser from '../views/views_Admin/ListarUser';
import CrearTurnos from '../views/views_nutricionista/CrearTurnos'
import ListaTurnos from '../views/views_nutricionista/ListaTurnos'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator();

function MainTabs({ userRole }) {
  return (
    <Tab.Navigator
      initialRouteName={
        userRole === 1
          ? 'AdminUser'
          : userRole === 2
            ? 'NutricionistaUser'
            : 'Dashboard'
      }
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Dashboard':
              iconName = 'view-dashboard';
              break;
            case 'Perfil':
              iconName = 'account';
              break;
            case 'AdminUser':
              iconName = 'account-cog';
              break;
            case 'ListarUser':
              iconName = 'account-multiple';
              break;
            case 'AgregarUsuario':
              iconName = 'account-plus';
              break;
            case 'NutricionistaUser':
              iconName = 'stethoscope';
              break;
            case 'CrearTurnos':
              iconName = 'calendar-plus';
              break;
            case 'ListaTurnos':
              iconName = 'calendar-list';
              break;
            case 'Cerrar sesión':
              iconName = 'logout';
              break;
            default:
              iconName = 'help-circle';
          }

          return <Icon name={iconName} color={color} size={size} />;
        },
        tabBarActiveTintColor: '#4a90e2',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      {/* Tabs para rol administrador */}
      {userRole === 1 && (
        <>
          <Tab.Screen name="AdminUser" component={AdminUser} />
          <Tab.Screen name="AgregarUsuario" component={AgregarUsuario} />
          <Tab.Screen name="ListarUser" component={ListarUser} />
        </>
      )}

      {/* Tabs para rol nutricionista */}
      {userRole === 2 && (
        <>
        <Tab.Screen name="NutricionistaUser" component={NutricionistaUser} />
        <Tab.Screen name="CrearTurnos" component={CrearTurnos} />
        <Tab.Screen name="ListaTurnos" component={ListaTurnos} />
        </>
      )}

      {/* Tabs para rol usuario normal */}
      {userRole === 3 && (
        <>
          <Tab.Screen name="Dashboard" component={Dashboard} />

        </>
      )}
      {/* Tabs para todos los usuarios */}
      {(userRole === 3 || userRole === 2 || userRole === 1) && (
        <>
          <Tab.Screen name="Perfil" component={Perfil} />
          <Tab.Screen name="Cerrar sesión" component={LogoutTab} />
        </>
      )}
    </Tab.Navigator>
  );
}

export default function Router() {
  const { isAuthenticated, checkingAuth, userData } = useContext(AuthContext);

  if (checkingAuth) return null;

  const userRole = userData?.roles_id;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          {Platform.OS !== 'web' ? (
            // En móviles, usar tabs
            <Stack.Screen name="MainTabs">
              {(props) => <MainTabs {...props} userRole={userRole} />}
            </Stack.Screen>
          ) : (
            // En web, usar vistas directas según el rol
            <>
              {userRole === 1 && (
                <>
                  <Stack.Screen name="AdminUser" component={AdminUser} />
                  <Stack.Screen name="AgregarUsuario" component={AgregarUsuario} />
                  <Stack.Screen name="ListarUser" component={ListarUser} />
                  <Stack.Screen name="Perfil" component={Perfil} />

                </>
              )}
              {userRole === 2 && (
                <>
                  <Stack.Screen name="NutricionistaUser" component={NutricionistaUser} />
                  <Stack.Screen name="CrearTurnos" component={CrearTurnos} />
                  <Stack.Screen name="ListaTurnos" component={ListaTurnos} />
                  <Stack.Screen name="Perfil" component={Perfil} />

                </>
              )}
              {userRole === 3 && (
                <>
                  <Stack.Screen name="Dashboard" component={Dashboard} />
                  <Stack.Screen name="Perfil" component={Perfil} />
                </>
              )}
              {/* Común para todos */}
              {/*<Stack.Screen name="Perfil" component={Perfil} />*/}
            </>
          )}
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Registro" component={Registro} />
        </>
      )}
    </Stack.Navigator>
  );
}
