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

const { width } = Dimensions.get('window');

// Array de URLs completas con doble barra
const imageUrls = [
  'https://ninoqfhximfqkhpzpbtd.supabase.co/storage/v1/object/public/book-images//matematicas.png',
  'https://ninoqfhximfqkhpzpbtd.supabase.co/storage/v1/object/public/book-images//Historia.png',
  'https://ninoqfhximfqkhpzpbtd.supabase.co/storage/v1/object/public/book-images//cienciasNaturales.png',
  'https://ninoqfhximfqkhpzpbtd.supabase.co/storage/v1/object/public/book-images//lengua%20y%20literatura.png',
  'https://ninoqfhximfqkhpzpbtd.supabase.co/storage/v1/object/public/book-images//geografia.png',
  // Agregar más URLs de imágenes aquí...
];

export default function Home() {
  const navigation = useNavigation();
  const addToCart = useCartStore(s => s.addToCart);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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

      // Asignamos las URLs completas de las imágenes desde el array 'imageUrls'
      const updated = books.map((item, index) => {
        const publicUrl = imageUrls[index] || ''; // Asignar URL correspondiente o vacío si no hay más imágenes
        return { ...item, publicUrl };
      });

      setProducts(updated);
      setLoading(false);
    })();
  }, []);

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
          {products.length > 0 ? products.map(item => (
            <View key={item.id} style={styles.productContainer}>
              {item.publicUrl ? (
                <Image
                  source={{ uri: item.publicUrl }}
                  style={styles.productImage}
                  resizeMode="contain"
                  onError={e => console.error('Error al cargar la imagen:', e.nativeEvent.error)}
                />
              ) : (
                <Text style={styles.noImageText}>Sin imagen disponible</Text>
              )}
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>€{item.price}</Text>
              <TouchableOpacity
                style={styles.addToCartButton}
                onPress={() => { addToCart(item); alert(`${item.name} añadido al carrito`); }}
              >
                <Text>🛒</Text>
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
    width: width * 0.45, margin: 8, padding: 12,
    borderWidth: 1, borderColor: '#ddd', borderRadius: 10, alignItems: 'center',
  },
  productImage: { width: 100, height: 100, marginBottom: 10 },
  noImageText: { color: 'red', marginBottom: 10 },
  productName: { fontSize: 18, fontWeight: 'bold' },
  productPrice: { fontSize: 16, color: '#666', marginBottom: 10 },
  addToCartButton: { padding: 8, borderRadius: 25, borderWidth: 1, borderColor: '#ccc' },
  noProductsText: { fontSize: 18, color: '#888', marginTop: 20 },
  footer: {
    flexDirection: 'row', justifyContent: 'space-around',
    padding: 16, borderTopWidth: 1, borderColor: '#ddd', backgroundColor: '#fff',
  },
  button: { padding: 12, backgroundColor: '#525FE1', borderRadius: 30 },
  buttonLogout: { padding: 12, backgroundColor: '#E74C3C', borderRadius: 30 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});



