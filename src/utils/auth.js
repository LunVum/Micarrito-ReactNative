import {create} from 'zustand';

// Tienda de Zustand para manejar el estado de autenticación
const useAuthStore = create((set) => ({
  isAuthenticated: false,
  token: null,
  login: (token) => set({ isAuthenticated: true, token }),  // Establece el estado de autenticación como verdadero
  logout: () => set({ isAuthenticated: false, token: null }), // Establece el estado de autenticación como falso
}));

// Función para simular un proceso de login
export const loginUser = async (email, password) => {
  // Simula el login con un usuario y contraseña predeterminadas
  if (email === 'virginia@example.com' && password === '1234Virginia') {
    // Si es exitoso, guarda el token en Zustand
    useAuthStore.getState().login('fake_token_123'); // Guarda un "token" simulado
    return true;
  }
  return false; // Si las credenciales son incorrectas
};

// Función para cerrar sesión
export const logoutUser = () => {
  useAuthStore.getState().logout();
};

// Función para comprobar si el usuario está autenticado
export const checkAuth = () => {
  return useAuthStore.getState().isAuthenticated;
};

// Exporta la tienda por defecto
export default useAuthStore;




