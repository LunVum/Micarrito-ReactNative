/*pagina sin nada para Home
import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { logoutUser } from '../utils/auth';

const Home = () => {
  const navigation = useNavigation();

  const handleLogout = () => {
    logoutUser();
    navigation.replace('Login');
  };

  return (
    <View>
      <Text>Bienvenido a la aplicación!</Text>
      <Button title="Cerrar sesión" onPress={handleLogout} />
    </View>
  );
};

export default Home;*/
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Image, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useCartStore from '../store/cartStore';
import { logoutUser } from '../utils/auth';

// Obtener el ancho de la ventana
const { width } = Dimensions.get('window');

const products = [
  { id: '1', name: 'Matemáticas', price: 25, image: require('../../assets/matematicas.png') },
  { id: '2', name: 'Historia', price: 20, image: require('../../assets/Historia.png') },
  { id: '3', name: 'Ciencias Naturales', price: 30, image: require('../../assets/cienciasNaturales.png') },
  { id: '4', name: 'Lengua y Literatura', price: 22, image: require('../../assets/lenguaLiteratura.png') },
  { id: '5', name: 'Geografía', price: 28, image: require('../../assets/geografia.png') }, 
];

const Home = () => {
  const navigation = useNavigation();
  const addToCart = useCartStore((state) => state.addToCart);

  const handleLogout = () => {
    logoutUser();
    navigation.replace('Login');
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    alert(`${product.name} añadido al carrito`);
  };

  const goToCart = () => {
    navigation.navigate('Cart');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.welcomeText}>Bienvenido a la tienda!</Text>

        <View style={styles.productsRow}>
          {products.map((item) => (
            <View key={item.id} style={styles.productContainer}>
              <Image source={item.image} style={styles.productImage} />
              <View style={styles.productDetails}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>€{item.price}</Text>
              </View>
              <TouchableOpacity
                style={styles.addToCartButton}
                onPress={() => handleAddToCart(item)}
              >
                <Image source={require('../../assets/iconoCarrito.png')} style={styles.cartIcon} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Contenedor de botones fijos */}
      <View style={styles.buttonContainer}>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cajaBoton} onPress={goToCart}>
            <Text style={styles.TextoBoton}>Ver mi carrito</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cajaBotonLogout} onPress={handleLogout}>
            <Text style={styles.TextoBoton}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  // Contenedor de los productos con Scroll
  scrollContainer: {
    paddingBottom: 100, // Asegura que haya suficiente espacio debajo de los productos
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  welcomeText: {
    fontSize: 28,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // Fila de productos
  productsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
  },

  productContainer: {
    marginBottom: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    width: '48%',
    minWidth: 220,
    marginHorizontal: 5,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 15,
  },
  productDetails: {
    alignItems: 'center',
    marginBottom: 15,
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 18,
    color: '#666',
  },
  addToCartButton: {
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 12,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartIcon: {
    width: 30,
    height: 30,
  },

  // Contenedor para los botones fijos
  buttonContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    zIndex: 10, // Asegura que los botones estén encima del contenido
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },

  cajaBoton: {
    backgroundColor: '#525FE1',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    width: 'auto',
    maxWidth: 300,
    marginTop: 15,
    marginRight: 10,
  },

  cajaBotonLogout: {
    backgroundColor: '#E74C3C',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    width: 'auto',
    maxWidth: 300,
    marginTop: 15,
  },

  TextoBoton: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default Home;
