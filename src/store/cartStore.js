import { create } from 'zustand';

// Definir la tienda de Zustand
const useCartStore = create((set) => ({
  cart: [], // Estado inicial del carrito

  // Función para agregar productos al carrito
  addToCart: (product) => set((state) => ({ cart: [...state.cart, product] })),

  // Función para eliminar un producto del carrito
  removeFromCart: (productId) => set((state) => ({
    cart: state.cart.filter((product) => product.id !== productId), // Filtramos el producto por ID
  })),

  // Función para calcular el total del carrito (solo ejecuta cuando se obtiene)
  getTotal: () => {
    return (state) => state.cart.reduce((total, product) => total + product.price, 0);
  },
}));

export default useCartStore;

