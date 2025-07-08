import { create } from 'zustand';
import { supabase } from './supabaseConfig';

// Zustand store
const useAuthStore = create((set) => ({
  isAuthenticated: false,
  token: null,
  isAdmin: false,
  login: (token, isAdmin) => set({ isAuthenticated: true, token, isAdmin }),
  logout: () => set({ isAuthenticated: false, token: null, isAdmin: false }),
}));

// Función para registrar un usuario
export const signUpUser = async (email, password, role = 'user') => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    const user = data.user;
    if (!user) throw new Error('No se pudo crear el usuario.');

    // Comprobamos si ya existe en la tabla 'users'
    const { data: existingUser, error: existingUserError } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single();

    if (existingUserError && existingUserError.code !== 'PGRST116') {
      throw existingUserError;
    }

    // Insertar si no existe
    if (!existingUser) {
      const insertRole = email === 'virutriluna6@gmail.com' ? 'admin' : role;

      const { error: insertError } = await supabase
        .from('users')
        .insert([
          {
            id: user.id,
            email,
            role: insertRole,
          },
        ]);

      if (insertError) throw insertError;
    }

    return { success: true };
  } catch (error) {
    console.error('Error al registrar usuario:', error.message);
    return { success: false, errorMessage: error.message };
  }
};

// Función para iniciar sesión
export const loginUser = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) throw error;

    const token = data.session.access_token;
    const userId = data.user.id;

    // Recuperar el rol del usuario desde la tabla 'users'
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    if (userError) throw userError;

    const isAdmin = userData.role === 'admin';

    useAuthStore.setState({ isAuthenticated: true, token, isAdmin });

    return { success: true, isAdmin };
  } catch (error) {
    console.error('Error al iniciar sesión:', error.message);
    return { success: false, errorMessage: error.message };
  }
};

// Cerrar sesión
export const logoutUser = async () => {
  try {
    await supabase.auth.signOut();
    useAuthStore.setState({ isAuthenticated: false, token: null, isAdmin: false });
  } catch (error) {
    console.error('Error al cerrar sesión:', error.message);
  }
};

// Verificar autenticación
export const checkAuth = () => {
  return useAuthStore.getState().isAuthenticated;
};

export default useAuthStore;
