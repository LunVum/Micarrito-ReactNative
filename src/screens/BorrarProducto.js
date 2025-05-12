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
import { supabase } from '../utils/supabaseConfig';

const BorrarProducto = () => {
  const [searchField, setSearchField] = useState('');
  const [searchType, setSearchType] = useState('id');
  const [productoEncontrado, setProductoEncontrado] = useState(null);

  const buscarProducto = async () => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq(searchType, searchType === 'price' ? parseFloat(searchField) : searchField);

      if (error) throw error;

      if (data.length === 0) {
        Alert.alert('No encontrado', 'No se encontró ningún producto con ese criterio.');
        setProductoEncontrado(null);
        return;
      }

      setProductoEncontrado(data[0]);
    } catch (error) {
      console.error('Error al buscar producto:', error.message);
      Alert.alert('Error', 'No se pudo buscar el producto.');
    }
  };

  const confirmarBorrado = () => {
    Alert.alert(
      '¿Está seguro de borrar este libro?',
      'Esta acción eliminará el producto permanentemente.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Aceptar', onPress: guardarYBorrarProducto, style: 'destructive' },
      ],
      { cancelable: false }
    );
  };

  const guardarYBorrarProducto = async () => {
    try {
      const { error: insertError } = await supabase.from('deleted_books').insert([
        {
          id: productoEncontrado.id,
          name: productoEncontrado.name,
          price: productoEncontrado.price,
          image: productoEncontrado.image,
        },
      ]);

      if (insertError) throw insertError;

      const { error: deleteError } = await supabase
        .from('books')
        .delete()
        .eq('id', productoEncontrado.id);

      if (deleteError) throw deleteError;

      Alert.alert('Éxito', 'Producto eliminado y guardado en historial.');
      setProductoEncontrado(null);
      setSearchField('');
    } catch (error) {
      console.error('Error al eliminar producto:', error.message);
      Alert.alert('Error', 'No se pudo eliminar el producto.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Borrar Producto</Text>

        <Text style={styles.label}>Buscar por:</Text>
        <View style={styles.searchTypeContainer}>
          <TouchableOpacity
            onPress={() => setSearchType('id')}
            style={searchType === 'id' ? styles.searchTypeSelected : styles.searchTypeButton}
          >
            <Text>ID</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSearchType('name')}
            style={searchType === 'name' ? styles.searchTypeSelected : styles.searchTypeButton}
          >
            <Text>Nombre</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSearchType('price')}
            style={searchType === 'price' ? styles.searchTypeSelected : styles.searchTypeButton}
          >
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

        <TouchableOpacity style={styles.button} onPress={buscarProducto}>
          <Text style={styles.buttonText}>Buscar Producto</Text>
        </TouchableOpacity>

        {productoEncontrado && (
          <View style={styles.resultContainer}>
            <TextInput style={styles.input} value={productoEncontrado.id} editable={false} />
            <TextInput style={styles.input} value={productoEncontrado.name} editable={false} />
            <TextInput
              style={styles.input}
              value={productoEncontrado.price.toString()}
              editable={false}
            />
            <TextInput style={styles.input} value={productoEncontrado.image} editable={false} />

            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={confirmarBorrado}
            >
              <Text style={styles.buttonText}>Borrar Producto</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default BorrarProducto;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  input: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    backgroundColor: '#f2f2f2',
  },
  button: {
    backgroundColor: '#525FE1',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginVertical: 10,
    width: '90%',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#D00000',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  searchTypeContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    justifyContent: 'space-between',
    width: '90%',
  },
  searchTypeButton: {
    padding: 10,
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  searchTypeSelected: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#525FE1',
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
    borderColor: '#525FE1',
    borderWidth: 1,
  },
  resultContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
});
