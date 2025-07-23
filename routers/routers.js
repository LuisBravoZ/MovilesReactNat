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

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') iconName = 'view-dashboard';
          if (route.name === 'Perfil') iconName = 'account';
          if (route.name === 'Cerrar sesión') iconName = 'logout';
          return <Icon name={iconName} color={color} size={size} />;
        },
        tabBarActiveTintColor: '#4a90e2',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="Perfil" component={Perfil} />
      <Tab.Screen name="Cerrar sesión" component={LogoutTab} />
    </Tab.Navigator>
  );
}

export default function Router() {
  const { isAuthenticated, checkingAuth, userData } = useContext(AuthContext);

  if (checkingAuth) return null;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          {/* Rutas para administrador */}
          {userData?.roles_id === 1 && (
            <>
              <Stack.Screen name="AdminUser" component={AdminUser} />
              <Stack.Screen name="AgregarUsuario" component={AgregarUsuario} />
            </>
          )}

          {/* Rutas para nutricionista */}
          {userData?.roles_id === 2 && (
            <Stack.Screen
              name={Platform.OS === 'web' ? 'NutricionistaUser' : 'MainTabs'}
              component={Platform.OS === 'web' ? NutricionistaUser : MainTabs}
              initialParams={{ screen: 'NutricionistaUser' }}
            />
          )}

          {/* Rutas para usuario normal */}
          {userData?.roles_id === 3 && (
            <Stack.Screen
              name={Platform.OS === 'web' ? 'Dashboard' : 'MainTabs'}
              component={Platform.OS === 'web' ? Dashboard : MainTabs}
              initialParams={{ screen: 'Dashboard' }}
            />
          )}

          {/* Rutas comunes para todos los usuarios autenticados */}
          {Platform.OS === 'web' && (
            <Stack.Screen name="Perfil" component={Perfil} />
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