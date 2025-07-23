import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuthCheck = () => {
  const navigation = useNavigation();
  const { isAuthenticated, userData } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated && userData) {
      // Solo redirige si es necesario (para manejar casos especiales)
      const currentRoute = navigation.getCurrentRoute();
      const expectedRoute = getExpectedRoute(userData.roles_id);
      
      if (currentRoute?.name !== expectedRoute) {
        navigation.navigate(expectedRoute);
      }
    }
  }, [isAuthenticated, userData, navigation]);
};

const getExpectedRoute = (rolId) => {
  if (Platform.OS === 'web') {
    return rolId === 1 ? 'AdminUser' : 
           rolId === 2 ? 'NutricionistaUser' : 'Dashboard';
  } else {
    return 'MainTabs';
  }
};