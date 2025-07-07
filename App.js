import Router from './routers/routers';
import { UserProvider } from './contexts/UserContext';
import { PaperProvider } from 'react-native-paper';
import { AuthProvider } from './contexts/AuthContext';


export default function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <PaperProvider>
          <Router />
        </PaperProvider>
      </UserProvider>
    </AuthProvider>
  );
}