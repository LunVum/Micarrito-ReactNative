import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { logoutUser } from '../utils/auth';

const AdminHome = () => {
  const navigation = useNavigation();

  const handleLogout = () => {
    logoutUser();
    navigation.replace('Login');
  };

  const goToProducts = () => {
    navigation.navigate('Home');
  };

  const goToAddProductScreen = () => {
    console.log('Añadir productos');
    navigation.navigate('AddProductos');
  };

  const handleEditProduct = () => {
    console.log('Buscar productos');
    navigation.navigate('BuscarProductoScreen');
  };

  const handleDeleteProduct = () => {
    console.log('Borrar productos');
    navigation.navigate('BorrarProducto');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.welcomeText}>Bienvenido, Administrador!</Text>

        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuButton} onPress={goToAddProductScreen}>
            <Text style={styles.menuButtonText}>Añadir Productos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuButton} onPress={handleEditProduct}>
            <Text style={styles.menuButtonText}>Buscar Productos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuButton} onPress={handleDeleteProduct}>
            <Text style={styles.menuButtonText}>Borrar Productos</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cajaBoton} onPress={goToProducts}>
            <Text style={styles.TextoBoton}>Ir a la Tienda</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cajaBotonLogout} onPress={handleLogout}>
            <Text style={styles.TextoBoton}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AdminHome;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: { paddingBottom: 100, alignItems: 'center', justifyContent: 'flex-start' },
  welcomeText: { fontSize: 28, marginBottom: 20, fontWeight: 'bold', textAlign: 'center' },
  menuContainer: { width: '80%', alignItems: 'center', marginBottom: 20 },
  menuButton: {
    backgroundColor: '#525FE1',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginVertical: 10,
  },
  menuButtonText: { color: 'white', fontSize: 16 },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
  },
  cajaBoton: {
    backgroundColor: '#5E8B7E',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 25,
  },
  cajaBotonLogout: {
    backgroundColor: '#E15F5F',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 25,
  },
  TextoBoton: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
