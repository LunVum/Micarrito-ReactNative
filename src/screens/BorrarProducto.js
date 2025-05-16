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


const isWeb = Platform.OS === 'web';

const mostrarAlerta = (titulo, mensaje, botones) => {
  if (isWeb) {
    window.alert(`${titulo}\n\n${mensaje}`);
  } else {
    Alert.alert(titulo, mensaje, botones);
  }
};

const BorrarProducto = () => {
  const [searchField, setSearchField] = useState('');
  const [searchType, setSearchType] = useState('id');
  const [productoEncontrado, setProductoEncontrado] = useState(null);
  const [resetTrigger, setResetTrigger] = useState(0);

  const buscarProducto = async () => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq(searchType, searchType === 'price' ? parseFloat(searchField) : searchField);

      if (error) throw error;

      if (data.length === 0) {
        mostrarAlerta('No encontrado', 'No se encontró ningún producto con ese criterio.');
        setProductoEncontrado(null);
        if (isWeb) setResetTrigger(prev => prev + 1);
        return;
      }

      setProductoEncontrado(data[0]);
    } catch (error) {
      console.error('Error al buscar producto:', error.message);
      mostrarAlerta('Error', 'No se pudo buscar el producto.');
    }
  };

  const confirmarBorrado = () => {
    if (isWeb) {
      const confirmado = window.confirm("¿Está seguro de borrar este libro? Esta acción eliminará el producto permanentemente.");
    if (confirmado) guardarYBorrarProducto();
    } else {
      mostrarAlerta(
        '¿Está seguro de borrar este libro?',
        'Esta acción eliminará el producto permanentemente.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Aceptar', onPress: guardarYBorrarProducto, style: 'destructive' },
        ]
      );
    };
  }
  const guardarYBorrarProducto = async () => {
     console.log("Iniciando proceso de borrado..."); 
    try {
      // 1. Insertar en la tabla deleted_books
      const { error: insertError } = await supabase.from('deleted_books').insert([{
        id: productoEncontrado.id,
        name: productoEncontrado.name,
        price: productoEncontrado.price,
        image: productoEncontrado.image,
        deleted_at: new Date().toISOString(), // Campo opcional para fecha de eliminación
      }]);

      if (insertError) throw insertError;

      // 2. Borrar de la tabla books
      const { error: deleteError } = await supabase
        .from('books')
        .delete()
        .eq('id', productoEncontrado.id);

      if (deleteError) throw deleteError;

      // 3. Eliminar la imagen del bucket de Supabase Storage
      const imagePath = productoEncontrado.image;
      const { error: storageError } = await supabase
        .storage
        .from('book-images')
        .remove([imagePath]);

      if (storageError) {
        console.warn('Advertencia: No se pudo eliminar la imagen del storage:', storageError.message);
      }

      // 4. Actualizar estado local (lista de productos)
      setProductoEncontrado(null);
      setSearchField('');
      mostrarAlerta('Éxito', 'Producto eliminado y guardado en historial.');
    } catch (error) {
      console.error('Error al eliminar producto:', error.message);
      mostrarAlerta('Error', 'No se pudo eliminar el producto.');
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
          <View key={isWeb ? resetTrigger : undefined} style={styles.resultContainer}>
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
    minHeight: '100%',
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
    width: '100%',
    maxWidth: 400, // para evitar alargamiento en web
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12, // padding vertical ligeramente aumentado
    marginBottom: 15,
    backgroundColor: '#f2f2f2',
  },
  button: {
    backgroundColor: '#525FE1',
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 30,
    marginVertical: 10,
    width: '100%',
    maxWidth: 400, // límite para web
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
    width: '100%',
    maxWidth: 400, // evita que se vea muy extendido
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
    maxWidth: 400, // mejora presentación web
    alignItems: 'center',
  },
});

