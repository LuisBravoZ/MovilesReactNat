import Router from './routers/routers';
import { UserProvider } from './contexts/UserContext';
import { PaperProvider } from 'react-native-paper';



export default function App() {
  return (
    <UserProvider>
      <PaperProvider>
        <Router />
      </PaperProvider>
    </UserProvider>
  );
}