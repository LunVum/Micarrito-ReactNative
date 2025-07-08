import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import useAuthStore from '../utils/auth'; // Importar la tienda de autenticación
import Login from '../screens/Login';
import Home from '../screens/Home';
import Middleware from '../screens/Middleware';
import Products from '../screens/Products';
import Cart from '../screens/Cart';
import AdminHome from '../screens/AdminHome';
import AddProductos from '../screens/AddProductos';
import BuscarProductoScreen from '../screens/BuscarProductoScreen';
import BorrarProducto from '../screens/BorrarProducto';
import HistorialBorrados from '../screens/HistorialBorrados';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const authStatus = useAuthStore((state) => state.isAuthenticated); // Accedemos al estado de autenticación

  // Si no hay autenticación aún, mostramos el Middleware
  if (authStatus === null) {
    return <Middleware />;
  }

  return (
    <Stack.Navigator initialRouteName={authStatus ? 'Home' : 'Login'}>
      <Stack.Screen
  name="Home"
  component={Home}
  options={{ title: 'Inicio' }}
/>
<Stack.Screen
  name="AdminHome"
  component={AdminHome}
  options={{ title: 'Panel de Administrador' }}
/>
<Stack.Screen
  name="Login"
  component={Login}
  options={{ title: 'Iniciar Sesión' }}
/>
<Stack.Screen
  name="Products"
  component={Products}
  options={{ title: 'Productos' }}
/>
<Stack.Screen
  name="Cart"
  component={Cart}
  options={{ title: 'Carrito de Compras' }}
/>
<Stack.Screen
  name="AddProductos"
  component={AddProductos}
  options={{ title: 'Añadir Producto' }}
/>
<Stack.Screen
  name="BuscarProductoScreen"
  component={BuscarProductoScreen}
  options={{ title: 'Buscar Producto' }}
/>
<Stack.Screen
  name="BorrarProducto"
  component={BorrarProducto}
  options={{ title: 'Borrar Producto' }}
/>
<Stack.Screen
  name="HistorialBorrados"
  component={HistorialBorrados}
  options={{ title: 'Historial de Productos Borrados' }}
/>
    </Stack.Navigator>
  );
};

export default AppNavigator;

