import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import useAuthStore from '../utils/auth'; // Importar la tienda de autenticación
import Login from '../screens/Login';
import Home from '../screens/Home';
import Middleware from '../screens/Middleware';
import Products from '../screens/Products';
import Cart from '../screens/Cart';
import AdminHome from '../screens/AdminHome';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const authStatus = useAuthStore((state) => state.isAuthenticated); // Accedemos al estado de autenticación

  // Si no hay autenticación aún, mostramos el Middleware
  if (authStatus === null) {
    return <Middleware />;
  }

  return (
    <Stack.Navigator initialRouteName={authStatus ? 'Home' : 'Login'}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="AdminHome" component={AdminHome} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Products" component={Products} />
      <Stack.Screen name="Cart" component={Cart} />
    </Stack.Navigator>
  );
};

export default AppNavigator;

