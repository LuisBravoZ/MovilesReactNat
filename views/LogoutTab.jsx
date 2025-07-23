import React, { useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const LogoutTab = ({ navigation }) => {
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const doLogout = async () => {
      await logout(navigation);
    };

    doLogout();
  }, [logout, navigation]);

  return null;
};

export default LogoutTab;
