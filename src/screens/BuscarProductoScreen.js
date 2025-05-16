import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { supabase } from '../utils/supabaseConfig';

// Función para mostrar alertas de manera diferente según el entorno
const mostrarAlerta = (titulo, mensaje) => {
  const isWeb = Platform.OS === 'web'; // Detectamos si es la web

  if (isWeb) {
    window.alert(`${titulo}\n\n${mensaje}`); // Para la web, usamos window.alert
  } else {
    Alert.alert(titulo, mensaje); // Para dispositivos móviles, usamos Alert.alert
  }
};

const BuscarProductoScreen = () => {
  const [searchField, setSearchField] = useState('');
  const [searchType, setSearchType] = useState('id');
  const [productoEncontrado, setProductoEncontrado] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [editedProduct, setEditedProduct] = useState({
    name: '',
    price: '',
    image: '',
  });

  const buscarProducto = async () => {
    try {
      let { data, error } = await supabase
        .from('books')
        .select('*')
        .eq(searchType, searchType === 'price' ? parseFloat(searchField) : searchField);

      if (error) throw error;

      if (data.length === 0) {
        mostrarAlerta('No encontrado', 'No se encontró ningún producto con ese criterio.'); // Usamos mostrarAlerta
        setProductoEncontrado(null);
        return;
      }

      setProductoEncontrado(data[0]);
      setModoEdicion(false); // Por si estaba activo antes
    } catch (error) {
      console.error('Error al buscar producto:', error.message);
      mostrarAlerta('Error', 'No se pudo buscar el producto.'); // Usamos mostrarAlerta
    }
  };

  const limpiarBusqueda = () => {
    setSearchField('');
    setProductoEncontrado(null);
    setModoEdicion(false);
    setEditedProduct({
      name: '',
      price: '',
      image: '',
    });
  };

  const activarEdicion = () => {
    setModoEdicion(true);
    setEditedProduct({
      name: productoEncontrado.name,
      price: productoEncontrado.price.toString(),
      image: productoEncontrado.image,
    });
  };

  const cancelarEdicion = () => {
    setModoEdicion(false);
    setEditedProduct({
      name: productoEncontrado.name,
      price: productoEncontrado.price.toString(),
      image: productoEncontrado.image,
    });
  };

  const guardarCambios = async () => {
    try {
      const { error } = await supabase
        .from('books')
        .update({
          name: editedProduct.name,
          price: parseFloat(editedProduct.price),
          image: editedProduct.image,
        })
        .eq('id', productoEncontrado.id);

      if (error) throw error;

      mostrarAlerta('Éxito', 'Producto actualizado correctamente.'); // Usamos mostrarAlerta
      setProductoEncontrado((prev) => ({
        ...prev,
        name: editedProduct.name,
        price: parseFloat(editedProduct.price),
        image: editedProduct.image,
      }));
      setModoEdicion(false);
    } catch (error) {
      console.error('Error al actualizar producto:', error.message);
      mostrarAlerta('Error', 'No se pudo actualizar el producto.'); // Usamos mostrarAlerta
    }
  };

  const vaciarCampo = (campo) => {
    if (modoEdicion) {
      setEditedProduct((prev) => ({
        ...prev,
        [campo]: '',
      }));
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

        <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={limpiarBusqueda}>
          <Text style={styles.buttonText}>Limpiar</Text>
        </TouchableOpacity>

        {productoEncontrado && (
          <View style={styles.resultContainer}>
            <TextInput
              style={styles.input}
              value={productoEncontrado.id}
              editable={false}
              placeholder="ID"
            />

            <TextInput
              style={styles.input}
              value={modoEdicion ? editedProduct.name : productoEncontrado.name}
              editable={modoEdicion}
              placeholder="Nombre"
              onChangeText={(text) =>
                setEditedProduct((prev) => ({ ...prev, name: text }))
              }
              onFocus={() => vaciarCampo('name')}
            />

            <TextInput
              style={styles.input}
              value={modoEdicion ? editedProduct.price : productoEncontrado.price.toString()}
              editable={modoEdicion}
              placeholder="Precio"
              keyboardType="numeric"
              onChangeText={(text) =>
                setEditedProduct((prev) => ({ ...prev, price: text }))
              }
              onFocus={() => vaciarCampo('price')}
            />

            <TextInput
              style={styles.input}
              value={modoEdicion ? editedProduct.image : productoEncontrado.image}
              editable={modoEdicion}
              placeholder="Imagen"
              onChangeText={(text) =>
                setEditedProduct((prev) => ({ ...prev, image: text }))
              }
              onFocus={() => vaciarCampo('image')}
            />

            {productoEncontrado.quantity !== undefined && (
              <TextInput
                style={styles.input}
                value={productoEncontrado.quantity.toString()}
                editable={false}
                placeholder="Cantidad"
                keyboardType="numeric"
              />
            )}

            {!modoEdicion ? (
              <TouchableOpacity style={styles.button} onPress={activarEdicion}>
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity style={styles.button} onPress={guardarCambios}>
                  <Text style={styles.buttonText}>Guardar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={cancelarEdicion}>
                  <Text style={styles.buttonText}>Anular</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default BuscarProductoScreen;

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
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
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
    maxWidth: 400,
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: '#F29F05',
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
    maxWidth: 400,
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
    maxWidth: 400,
    alignItems: 'center',
  },
});
