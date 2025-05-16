// AddProductos.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../utils/supabaseConfig';
import { v4 as uuidv4 } from 'uuid';

/**
 * Añadir productos con imagen a Supabase Storage ("book-images")
 * y guardar solo el nombre de archivo + extensión en la tabla "books".
 */
export default function AddProductos() {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [imagen, setImagen] = useState(null); // { uri, base64 } en móvil; { uri, file } en web

  const mostrarAlerta = (titulo, mensaje) => {
    if (Platform.OS === 'web') {
      window.alert(`${titulo}\n\n${mensaje}`);
    } else {
      Alert.alert(titulo, mensaje);
    }
  };

  const generarNombreArchivo = (nombreLibro) => {
    return (
      nombreLibro
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/\s+/g, '') + '.png'
    );
  };

  const handleGuardar = async () => {
    if (!nombre || !precio || !imagen) {
      mostrarAlerta('Error', 'Por favor, completa todos los campos e incluye una imagen.');
      return;
    }

    // Verificar usuario y rol actual
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();
    console.log('🔍 Usuario autenticado:', user, userError);

    try {
      const fileName = generarNombreArchivo(nombre);
      let fileData;
      let contentType = 'image/png';

      if (Platform.OS === 'web') {
        // En web, subimos directamente el File
        fileData = imagen.file;
        contentType = imagen.file.type;
      } else {
        // En móvil, convertimos la base64 a ArrayBuffer
        // Supabase Storage no admite Blob en RN
        const blob = await fetch(imagen.uri).then(res => res.blob());
        fileData = await new Response(blob).arrayBuffer();
      }

      console.log('🟢 Subiendo imagen a Supabase...');

      const { error: uploadError } = await supabase.storage
        .from('book-images')
        .upload( fileName, fileData, {
          contentType,
          upsert: true,
        });

      if (uploadError) {
        console.error('❌ Error subiendo imagen:', uploadError.message, uploadError);
        mostrarAlerta('Error', 'Error subiendo la imagen al servidor.');
        return;
      }

      console.log('🟢 Imagen subida. Obteniendo URL pública...');

      const { data: publicUrlData, error: urlError } = await supabase.storage
        .from('book-images')
        .getPublicUrl(`public/${fileName}`);

      if (urlError || !publicUrlData?.publicUrl) {
        console.error('❌ Error obteniendo URL pública:', urlError?.message);
        mostrarAlerta('Error', 'No se pudo obtener la URL pública.');
        return;
      }

      const publicURL = publicUrlData.publicUrl;

      const priceFloat = parseFloat(precio);
      if (isNaN(priceFloat)) {
        mostrarAlerta('Error', 'El precio no es válido.');
        return;
      }

      console.log('🟢 Insertando libro en la base de datos...');
      const { error: insertError } = await supabase
        .from('books')
        .insert([{
          id: uuidv4(),
          name: nombre,
          price: priceFloat,
          image: fileName,
        }]);

      if (insertError) {
        console.error('❌ Error insertando libro:', insertError.message);
        mostrarAlerta('Error', 'No se pudo insertar el libro en la base de datos.');
        return;
      }

      mostrarAlerta('Éxito', 'Libro guardado correctamente.');
      setNombre('');
      setPrecio('');
      setImagen(null);
    } catch (error) {
      console.error('Error al guardar libro:', error);
      mostrarAlerta('Error', 'No se pudo guardar el libro. Revisa tu conexión o configuración.');
    }
  };

  const handleSeleccionarImagen = async (event) => {
    if (Platform.OS === 'web') {
      const file = event.target.files[0];
      if (!file) return;
      const uri = URL.createObjectURL(file);
      setImagen({ uri, file });
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        mostrarAlerta('Permiso denegado', 'Se necesita acceso a la galería.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
        base64: true,  // necesario para ArrayBuffer en móvil
      });

      if (!result.canceled && result.assets.length > 0) {
        const asset = result.assets[0];
        setImagen({
          uri: asset.uri,
          base64: asset.base64,
        });
      }
    }
  };

  return (
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

      {Platform.OS === 'web' ? (
        <input
          type="file"
          accept="image/*"
          onChange={handleSeleccionarImagen}
          style={{ marginVertical: 10 }}
        />
      ) : (
        <TouchableOpacity onPress={handleSeleccionarImagen}>
          <Text style={[styles.buttonText, styles.linkText]}>Seleccionar Imagen</Text>
        </TouchableOpacity>
      )}

      {imagen && (
        <View style={styles.imagePreview}>
          <Image
            source={{ uri: imagen.uri }}
            style={{ width: 150, height: 150, borderRadius: 10 }}
            resizeMode="contain"
          />
          <Text style={{ marginTop: 10 }}>{generarNombreArchivo(nombre)}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={handleGuardar}>
        <Text style={styles.buttonText}>Guardar Libro</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
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
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  linkText: {
    color: '#525FE1',
    textDecorationLine: 'underline',
    marginVertical: 10,
    fontSize: 16,
  },
  imagePreview: {
    marginTop: 20,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
});

