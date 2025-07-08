import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { logoutUser } from '../utils/auth';

const AdminHome = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';

  const handleLogout = () => {
    logoutUser();
    navigation.replace('Login');
  };

  const goToProducts = () => {
    navigation.navigate('Home');
  };

  const goToAddProductScreen = () => {
    navigation.navigate('AddProductos');
  };

  const handleEditProduct = () => {
    navigation.navigate('BuscarProductoScreen');
  };

  const handleDeleteProduct = () => {
    navigation.navigate('BorrarProducto');
  };

  const handleDeletedHistory = () => {
    navigation.navigate('HistorialBorrados'); 
  };

  const buttonWidth = isWeb ? Math.min(400, width * 0.7) : '100%';

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.welcomeText}>Bienvenido, Administrador!</Text>

        <View style={[styles.menuContainer, { width: buttonWidth }]}>
          <TouchableOpacity style={styles.menuButton} onPress={goToAddProductScreen}>
            <Text style={styles.menuButtonText}>Añadir Productos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuButton} onPress={handleEditProduct}>
            <Text style={styles.menuButtonText}>Buscar Productos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuButton} onPress={handleDeleteProduct}>
            <Text style={styles.menuButtonText}>Borrar Productos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuButton, styles.historyButton]} onPress={handleDeletedHistory}>
            <Text style={styles.menuButtonText}>Historial de Borrados</Text>
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
  scrollContainer: {
    paddingBottom: 100,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 28,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  menuContainer: {
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  menuButton: {
    backgroundColor: '#525FE1',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
  },
  historyButton: {
    backgroundColor: '#0077B6',
  },
  menuButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    maxWidth: 400,
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

