import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../utils/supabaseConfig';
import { v4 as uuidv4 } from 'uuid';

const AddProductos = () => {
  const navigation = useNavigation();
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [imagen, setImagen] = useState('');

  const handleGuardar = async () => {
    if (!nombre || !precio || !imagen) {
      Alert.alert('Error', 'Por favor, completa todos los campos');
      return;
    }

    try {
      const { error } = await supabase
        .from('books')
        .insert([
          {
            id: uuidv4(), // UUID único
            name: nombre,
            price: parseFloat(precio),
            image: imagen,
          },
        ]);

      if (error) throw error;

      Alert.alert('Éxito', `Libro añadido:\nNombre: ${nombre}\nPrecio: ${precio}\nImagen: ${imagen}`);
      setNombre('');
      setPrecio('');
      setImagen('');
    } catch (error) {
      console.error('Error al añadir libro:', error.message);
      Alert.alert('Error', 'No se pudo añadir el libro');
    }
  };

  const handleLimpiar = () => {
    setNombre('');
    setPrecio('');
    setImagen('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Añadir Nuevo Libro</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre del libro"
          value={nombre}
          onChangeText={setNombre}
        />

        <TextInput
          style={styles.input}
          placeholder="Precio"
          value={precio}
          onChangeText={setPrecio}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="Imagen (nombre o URL)"
          value={imagen}
          onChangeText={setImagen}
        />

        <TouchableOpacity style={styles.button} onPress={handleGuardar}>
          <Text style={styles.buttonText}>Guardar Producto</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={handleLimpiar}>
          <Text style={styles.buttonText}>Limpiar Campos</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddProductos;

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
  input: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
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
  clearButton: {
    backgroundColor: '#F29F05',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});



