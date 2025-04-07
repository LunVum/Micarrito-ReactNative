import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import useAuthStore from '../utils/auth'; // Importar la tienda correctamente
import Login from '../screens/Login';
import Home from '../screens/Home';
import Middleware from '../screens/Middleware';

const Stack = createStackNavigator();

const AppNavigator = () => {
  // Acceder directamente al estado de autenticación desde Zustand
  const authStatus = useAuthStore((state) => state.isAuthenticated);

  // Si el estado de autenticación no está definido aún, muestra el indicador de carga
  if (authStatus === null) {
    return <Middleware />;
  }

  return (
    <Stack.Navigator initialRouteName={authStatus ? "Home" : "Login"}>
      {/* Pantallas según el estado de autenticación */}
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Login" component={Login} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
