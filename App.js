import Router from './routers/routers';

import { UserProvider } from './contexts/UserContext';
import { PaperProvider } from 'react-native-paper';
import { AuthProvider } from './contexts/AuthContext';
import { AwesomeAlertProvider } from './contexts/AwesomeAlert';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  return (
   <AwesomeAlertProvider>
      <AuthProvider>
        <UserProvider>
          <PaperProvider>
            <NavigationContainer>
              <Router />
            </NavigationContainer>
          </PaperProvider>
        </UserProvider>
      </AuthProvider>
    </AwesomeAlertProvider>
  );
}