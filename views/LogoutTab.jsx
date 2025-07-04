import React, { useEffect } from 'react';

const LogoutTab = ({ navigation }) => {
    useEffect(() => {
        navigation.replace('Login');
    }, [navigation]);

    return null; 
};

export default LogoutTab;