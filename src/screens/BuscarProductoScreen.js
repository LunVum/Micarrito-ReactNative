import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import supabase from '../utils/supabaseClient';  // Asegúrate de importar correctamente el cliente de Supabase

const BuscarProductoScreen = () => {
  const [searchField, setSearchField] = useState('');
  const [searchType, setSearchType] = useState('name'); // Puede ser: 'id', 'name', 'price'
  const [productoEncontrado, setProductoEncontrado] = useState(null);

  const buscarProducto = async () => {
    try {
      // Realizamos una consulta a la tabla 'products' (reemplaza 'products' con tu nombre de tabla)
      let { data, error } = await supabase
        .from('products')  // Nombre de tu tabla en Supabase
        .select('*')
        .eq(searchType, searchType === 'price' ? parseFloat(searchField) : searchField);  // Usamos 'eq' para filtrar

      if (error) {
        throw error;
      }

      if (data.length === 0) {
        Alert.alert('No encontrado', 'No se encontró ningún producto con ese criterio.');
        setProductoEncontrado(null);
        return;
      }

      // Solo tomamos el primer producto encontrado
      setProductoEncontrado(data[0]);
    } catch (error) {
      console.error('Error al buscar producto:', error);
      Alert.alert('Error', 'No se pudo buscar el producto.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Buscar Producto</Text>

        <Text style={styles.label}>Buscar por:</Text>
        <View style={styles.searchTypeContainer}>
          <TouchableOpacity onPress={() => setSearchType('id')} style={searchType === 'id' ? styles.searchTypeSelected : styles.searchTypeButton}>
            <Text>ID</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSearchType('name')} style={searchType === 'name' ? styles.searchTypeSelected : styles.searchTypeButton}>
            <Text>Nombre</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSearchType('price')} style={searchType === 'price' ? styles.searchTypeSelected : styles.searchTypeButton}>
            <Text>Precio</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder={`Buscar por ${searchType}`}
          value={searchField}
          onChangeText={setSearchField}
          keyboardType={searchType === 'price' ? 'numeric' : 'default'}
        />

        <TouchableOpacity style={styles.searchButton} onPress={buscarProducto}>
          <Text style={styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>

        {productoEncontrado && (
          <View style={styles.resultContainer}>
            <Text style={styles.label}>ID: {productoEncontrado.id}</Text>
            <Text style={styles.label}>Nombre: {productoEncontrado.name}</Text>
            <Text style={styles.label}>Precio: ${productoEncontrado.price}</Text>
            <Text style={styles.label}>Imagen: {productoEncontrado.image}</Text>
            <Text style={styles.label}>Cantidad: {productoEncontrado.quantity}</Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default BuscarProductoScreen;

