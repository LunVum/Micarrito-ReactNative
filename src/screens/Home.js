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
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useCartStore from '../store/cartStore'; // Usamos Zustand para manejar el carrito
import { logoutUser } from '../utils/auth';
import { ScrollView } from 'react-native-web';

const { width } = Dimensions.get('window'); // Obtiene el ancho de la pantalla

const products = [
  { id: '1', name: 'Matemáticas', price: 25, image: require('../../assets/matematicas.png') },
  { id: '2', name: 'Historia', price: 20, image: require('../../assets/Historia.png') },
  { id: '3', name: 'Ciencias Naturales', price: 30, image: require('../../assets/cienciasNaturales.png') },
  { id: '4', name: 'Lengua y Literatura', price: 22, image: require('../../assets/lenguaLiteratura.png') },
];

const Home = () => {
  const navigation = useNavigation();
  const addToCart = useCartStore((state) => state.addToCart); // Función de Zustand para agregar al carrito

  const handleLogout = () => {
    logoutUser(); // Aquí se maneja el logout, asegurándonos de cerrar sesión.
    navigation.replace('Login');
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    alert(`${product.name} añadido al carrito`); // Mensaje de confirmación
  };

  const goToCart = () => {
    navigation.navigate('Cart'); // Navegar a la pantalla del carrito
  };

  return (
    
    <View style={styles.padre}>
      <Text style={styles.welcomeText}>Bienvenido a la tienda!</Text>

      <FlatList
        data={products}
        renderItem={({ item }) => (
          <View style={styles.productContainer}>
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
        )}
        keyExtractor={(item) => item.id}
      />

      <TouchableOpacity
        style={styles.cajaBoton}
        onPress={goToCart}
      >
        <Text style={styles.TextoBoton}>Ver mi carrito</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cajaBoton}
        onPress={handleLogout}
      >
        <Text style={styles.TextoBoton}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  padre: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: width * 0.05, // Espaciado lateral adaptativo (5% del ancho de la pantalla)
  },
  welcomeText: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  productContainer: {
    marginBottom: 16,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    width: '100%', // El ancho se ajusta a 100% del espacio disponible
    maxWidth: 600, // Límite de ancho para no estirarse demasiado
    backgroundColor: '#f9f9f9',
    flexDirection: 'column', // Cambiado a columna para apilar los elementos
    alignItems: 'center', // Centrado de los elementos
  },
  productImage: {
    width: 50,  // Ajusta el tamaño de la imagen
    height: 50,
    marginRight: 15,  // Espacio entre la imagen y el texto
    borderRadius: 8, // Hacemos las esquinas redondeadas para la imagen
  },
  productDetails: {
    alignItems: 'center', // Alinea el nombre y precio al centro
    marginBottom: 10, // Espacio entre el precio y el icono de carrito
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center', 
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    color: '#666', 
    textAlign: 'center',
    marginBottom: 10,
  },
  addToCartButton: {
    backgroundColor: 'white',
    borderRadius: 50,  // Hacemos el botón redondeado
    padding: 8, // Reducimos el tamaño del botón
    width: 40,  // Ajustamos el tamaño del botón
    height: 40, // Ajustamos el tamaño del botón
    justifyContent: 'center', // Centrado del icono
    alignItems: 'center', // Centrado del icono
    marginTop: 10, // Espacio entre el precio y el botón
  },
  cartIcon: {
    width: 25,  // Ajustamos el tamaño del icono
    height: 25,  // Ajustamos el tamaño del icono
  },
  cajaBoton: {
    backgroundColor: '#525FE1',
    borderRadius: 30,
    paddingVertical: 10,
    width: '80%',
    marginTop: 10,
    alignItems: 'center',
  },
  TextoBoton: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Home;
