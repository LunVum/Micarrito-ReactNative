import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  useWindowDimensions,
  Alert,
} from 'react-native';
import { supabase } from '../utils/supabaseConfig';

const isWeb = Platform.OS === 'web';

const mostrarAlerta = (titulo, mensaje) => {
  if (isWeb) {
    window.alert(`${titulo}\n\n${mensaje}`);
  } else {
    Alert.alert(titulo, mensaje);
  }
};

const HistorialBorrados = () => {
  const [productosBorrados, setProductosBorrados] = useState([]);
  const [loading, setLoading] = useState(false);
  const { width } = useWindowDimensions();

  useEffect(() => {
    fetchDeletedProducts();
  }, []);

  const fetchDeletedProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('deleted_books')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;

      setProductosBorrados(data);
    } catch (error) {
      console.error('Error al cargar historial:', error.message);
      mostrarAlerta('Error', 'No se pudo cargar el historial de borrados.');
    }
    setLoading(false);
  };

  const maxContentWidth = isWeb ? Math.min(width * 0.9, 500) : '100%';

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Historial de Productos Borrados</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#525FE1" />
        ) : productosBorrados.length === 0 ? (
          <Text style={styles.noResults}>No hay productos eliminados aún.</Text>
        ) : (
          productosBorrados.map((producto, index) => (
            <View
              key={producto.id || index}
              style={[styles.productCard, { width: maxContentWidth }]}
            >
              <TextInput
                style={styles.input}
                value={producto.id?.toString() || ''}
                editable={false}
                placeholder="ID"
              />
              <TextInput
                style={styles.input}
                value={producto.name || ''}
                editable={false}
                placeholder="Nombre"
              />
              <TextInput
                style={styles.input}
                value={producto.price?.toString() || ''}
                editable={false}
                placeholder="Precio"
              />
              <TextInput
                style={styles.input}
                value={producto.image || ''}
                editable={false}
                placeholder="Imagen"
              />
            </View>
          ))
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default HistorialBorrados;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    ...(isWeb ? { height: '100vh' } : {}),
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  productCard: {
    backgroundColor: '#F2F4F7',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  noResults: {
    fontSize: 16,
    marginTop: 20,
    color: '#777',
  },
});




