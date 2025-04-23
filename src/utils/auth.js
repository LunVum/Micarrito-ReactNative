// utils/auth.js
import { create } from 'zustand';
import { auth } from './firebaseConfig'; // Importa desde firebaseConfig.js
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

// Tienda de Zustand para manejar el estado de autenticación
const useAuthStore = create((set) => ({
  isAuthenticated: false,
  token: null,
  isAdmin: false, 
  login: (token, isAdmin) => set({ isAuthenticated: true, token, isAdmin }),
  logout: () => set({ isAuthenticated: false, token: null, isAdmin: false }),
}));

// Función para hacer login real con Firebase
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();

    const isAdmin = email === 'virginia@example.com'; // email del admin
    useAuthStore.getState().login(token, isAdmin);

    return { success: true, isAdmin };
  } catch (error) {
    console.error('Error al iniciar sesión:', error.code, error.message);
    return { success: false };
  }
};

// Función para cerrar sesión usando Firebase y limpiar Zustand
export const logoutUser = async () => {
  try {
    await signOut(auth); // Cierra sesión en Firebase
    useAuthStore.getState().logout(); // Limpia Zustand
  } catch (error) {
    console.error('Error al cerrar sesión:', error.code, error.message);
  }
};

// Función para comprobar si el usuario está autenticado
export const checkAuth = () => {
  return useAuthStore.getState().isAuthenticated;
};

// Exporta la tienda por defecto
export default useAuthStore;





