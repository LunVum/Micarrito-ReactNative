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
import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet,
  ScrollView, Dimensions,
  Image,
  TouchableOpacity, KeyboardAvoidingView, Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useCartStore from '../store/cartStore';
import { logoutUser } from '../utils/auth';
import { supabase } from '../utils/supabaseConfig';
import { v4 as uuidv4 } from 'uuid';
import { launchImageLibrary } from 'react-native-image-picker';

import iconoCarrito from '../../assets/iconoCarrito.png';

const { width } = Dimensions.get('window');

export default function Home() {
  const navigation = useNavigation();
  const addToCart = useCartStore(s => s.addToCart);
  const [products, setProducts] = useState([]);
  // Manual array of URLs to override broken Supabase URLs
  const [urlImages] = useState([
    'https://ninoqfhximfqkhpzpbtd.supabase.co/storage/v1/object/public/book-images//matematicas.png',
    'https://ninoqfhximfqkhpzpbtd.supabase.co/storage/v1/object/public/book-images//cienciasNaturales.png',
    'https://ninoqfhximfqkhpzpbtd.supabase.co/storage/v1/object/public/book-images//Historia.png',
    'https://ninoqfhximfqkhpzpbtd.supabase.co/storage/v1/object/public/book-images//lengua%20y%20literatura.png',
    'https://ninoqfhximfqkhpzpbtd.supabase.co/storage/v1/object/public/book-images//geografia.png',
    'https://ninoqfhximfqkhpzpbtd.supabase.co/storage/v1/object/public/book-images//ingles.png'
  ]);
  const [publicUrls, setPublicUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imagen, setImagen] = useState(null);

  useEffect(() => {
    (async () => {
      const { data: books, error: fetchError } = await supabase
        .from('books')
        .select('id,name,price,image');

      if (fetchError) {
        console.error('Error al obtener libros:', fetchError.message);
        setLoading(false);
        return;
      }

      // Use manual urlImages array for public URLs
      const urls = urlImages;

      setProducts(books);
      setPublicUrls(urls);
      setLoading(false);
    })();
  }, []);

  const handleSeleccionarImagen = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, (response) => {
      if (response.didCancel) {
        console.log('Selección de imagen cancelada');
      } else if (response.errorCode) {
        console.error('Error al seleccionar imagen: ', response.errorMessage);
      } else {
        setImagen(response.assets[0]);
      }
    });
  };

  const handleGuardar = async (nombre, precio) => {
    if (!nombre || !precio || !imagen) {
      alert('Por favor, complete todos los campos');
      return;
    }

    try {
      const fileName = imagen.fileName || `${nombre.toLowerCase().replace(/\s+/g, '')}.png`;
      const fileUri = imagen.uri;

      const { error: uploadError } = await supabase.storage
        .from('book-images')
        .upload(fileName, { uri: fileUri, type: imagen.type });
      if (uploadError) throw uploadError;

      const { data: urlData, error: urlError } = await supabase
        .storage
        .from('book-images')
        .getPublicUrl(fileName);
      if (urlError) throw urlError;
      const publicURL = urlData.publicUrl;

      const newProduct = {
        id: uuidv4(),
        name: nombre,
        price: parseFloat(precio),
        image: fileName,
        publicUrl: publicURL
      };
      const { error: insertError } = await supabase
        .from('books')
        .insert([newProduct]);
      if (insertError) throw insertError;

      setProducts(prev => [...prev, newProduct]);
      setPublicUrls(prev => [...prev, publicURL]);

      alert('Libro añadido exitosamente');
      setImagen(null);
    } catch (error) {
      console.error('Error al añadir el libro:', error.message);
      alert('Hubo un error al añadir el libro');
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigation.replace('Login');
  };

  const goToCart = () => navigation.navigate('Cart');

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Cargando productos…</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.welcomeText}>¡Bienvenido a la tienda!</Text>
        <View style={styles.productsRow}>
          {products.length > 0 ? products.map((item, index) => (
            <View key={item.id} style={styles.productContainer}>
              {publicUrls[index] ? (
                <Image
                  source={{ uri: publicUrls[index] }}
                  style={styles.productImage}
                  resizeMode="contain"
                  onError={e => console.error('Error al cargar imagen:', e.nativeEvent.error)}
                />
              ) : (
                <Text style={styles.noImageText}>Sin imagen disponible</Text>
              )}
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>€{item.price}</Text>

              <TouchableOpacity
                style={styles.addToCartButton}
                onPress={() => {
                  addToCart(item);
                  alert(`${item.name} añadido al carrito`);
                }}
              >
                <Image
                  source={iconoCarrito}
                  style={styles.cartIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          )) : (
            <Text style={styles.noProductsText}>No hay productos.</Text>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={goToCart}>
          <Text style={styles.buttonText}>Ver carrito</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonLogout} onPress={handleLogout}>
          <Text style={styles.buttonText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: { paddingBottom: 100, alignItems: 'center' },
  welcomeText: { fontSize: 28, fontWeight: 'bold', margin: 20 },
  productsRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  productContainer: {
    width: width * 0.45,
    margin: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  productImage: { width: 100, height: 100, marginBottom: 10 },
  noImageText: { color: 'red', marginBottom: 10 },
  productName: { fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  productPrice: { fontSize: 16, color: '#666', marginBottom: 10 },
  addToCartButton: {
    padding: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  cartIcon: { width: 24, height: 24 },
  noProductsText: { fontSize: 18, color: '#888', marginTop: 20 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  button: {
    padding: 12,
    backgroundColor: '#525FE1',
    borderRadius: 30,
  },
  buttonLogout: {
    padding: 12,
    backgroundColor: '#E74C3C',
    borderRadius: 30,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

