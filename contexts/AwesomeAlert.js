import React, { createContext, useState, useContext } from "react";
import AwesomeAlert from "react-native-awesome-alerts";

const AwesomeAlertContext = createContext();

export const AwesomeAlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({
    show: false,
    title: '',
    message: '',
    confirmText: 'OK',
    cancelText: 'Cancelar',
    showCancel: false,
    onConfirm: () => {},
    onCancel: () => {}
  });

  const showAlert = ({ title, message, onConfirm = () => {}, onCancel = () => {}, showCancel = false }) => {
    setAlert({
      show: true,
      title,
      message,
      confirmText: 'OK',
      cancelText: 'Cancelar',
      onConfirm,
      onCancel,
      showCancel
    });
  };

  const hideAlert = () => {
    setAlert(prev => ({ ...prev, show: false }));
  };

  return (
    <AwesomeAlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      <AwesomeAlert
        show={alert.show}
        title={alert.title}
        message={alert.message}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showCancelButton={alert.showCancel}
        showConfirmButton={true}
        cancelText={alert.cancelText}
        confirmText={alert.confirmText}
        confirmButtonColor="#4CAF50"
        onCancelPressed={() => {
          alert.onCancel();
          hideAlert();
        }}
        onConfirmPressed={() => {
          alert.onConfirm();
          hideAlert();
        }}
        overlayStyle={{ backgroundColor: 'transparent' }}
      />
    </AwesomeAlertContext.Provider>
  );
};

export const useAwesomeAlert = () => useContext(AwesomeAlertContext);
