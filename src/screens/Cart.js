import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import useCartStore from '../store/cartStore'; // Importamos Zustand para manejar el carrito

const Cart = ({ navigation }) => {
  const cart = useCartStore((state) => state.cart); // Obtener los productos en el carrito
  const removeFromCart = useCartStore((state) => state.removeFromCart); // Función para eliminar productos del carrito

  // Usamos un estado local para almacenar el total
  const [total, setTotal] = useState(0);

  // Actualizamos el total solo cuando el carrito cambia
  useEffect(() => {
    const currentTotal = cart.reduce((sum, product) => sum + (product.price || 0), 0);
    setTotal(currentTotal);
  }, [cart]); // Dependemos de "cart" para recalcular el total

  // Función para eliminar productos
  const handleRemoveFromCart = (productId) => {
    removeFromCart(productId);
  };

  return (
    <View style={styles.padre}>
      <Text style={styles.title}>Tu carrito de compras</Text>

      {/* Aquí manejamos el caso cuando el carrito está vacío */}
      {cart.length === 0 ? (
        <Text style={styles.emptyCartText}>No hay productos en el carrito</Text> // Aplicamos el nuevo estilo aquí
      ) : (
        <FlatList
          data={cart}
          renderItem={({ item, index }) => {
            // Aseguramos que 'name' y 'price' sean siempre válidos
            const itemName = item.name ? String(item.name) : 'Producto sin nombre';
            const itemPrice = item.price ? String(item.price.toFixed(2)) : '0.00'; // Aseguramos que sea un string

            return (
              <View style={styles.productContainer}>
                <Text style={styles.productName}>{itemName}</Text>
                <Text style={styles.productPrice}>{itemPrice} €</Text>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveFromCart(item.id)}
                >
                  <Text style={styles.TextoBoton}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            );
          }}
          keyExtractor={(item, index) => `${item.id}-${index}`} // Asegura que la clave sea única
        />
      )}

      {/* Mostrar el total actualizado con formato */}
      <View style={styles.totalContainer}>
        <Text style={styles.total}>Total: {String(total.toFixed(2))} €</Text>
        <TouchableOpacity
          style={styles.cajaBoton}
          onPress={() => navigation.goBack()} // Volver a la pantalla de productos
        >
          <Text style={styles.TextoBoton}>Seguir comprando</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  padre: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
    justifyContent: 'space-between', // Asegura que el contenido esté distribuido en la pantalla
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  productContainer: {
    marginBottom: 16,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    width: '100%',
    backgroundColor: '#f9f9f9',
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 16,
    marginBottom: 8,
  },
  removeButton: {
    backgroundColor: '#FF6347',
    borderRadius: 30,
    paddingVertical: 10,
    width: '100%',
    marginTop: 10,
    alignItems: 'center',
  },
  totalContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center', // Asegura que el total y el botón estén centrados
  },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  cajaBoton: {
    backgroundColor: '#525FE1',
    borderRadius: 30,
    paddingVertical: 15,
    width: '80%',
    marginTop: 15,
    alignItems: 'center',
  },
  TextoBoton: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
  //cuando el carrito está vacío
  emptyCartText: {
    fontSize: 18,
    color: '#888', 
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 20,
  },
});

export default Cart;

