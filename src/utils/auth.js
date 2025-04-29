import { create } from 'zustand';
import { supabase } from './supabaseConfig';

const useAuthStore = create((set) => ({
  isAuthenticated: false,
  token: null,
  isAdmin: false,
  login: (token, isAdmin) => set({ isAuthenticated: true, token, isAdmin }),
  logout: () => set({ isAuthenticated: false, token: null, isAdmin: false }),
}));

export const signUpUser = async (email, password, role = 'user') => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    const user = data.user;
    if (!user) throw new Error('Usuario no creado en Auth');

    console.log('User created in auth:', user);

    // Intentamos insertar el usuario en la tabla 'users'
    console.log('Intentando insertar en users con estos datos:', {
      id: user.id,
      email: email,
      role: role,
    });

    const { error: insertError } = await supabase
      .from('users')
      .insert([
        {
          id: user.id,
          email: email,
          role: role,
        },
      ]);

    if (insertError) {
      console.error('Error al insertar en la tabla users:', insertError);
      throw insertError;
    } else {
      console.log('Usuario insertado correctamente');
    }

    return { success: true };
  } catch (error) {
    console.error('Error al registrar usuario:', error.message);
    return { success: false };
  }
};

export const loginUser = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) throw error;

    const token = data.session.access_token;
    const userId = data.user.id;

    // Buscar el rol por el ID del usuario
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    if (userError) throw userError;

    const isAdmin = userData.role === 'admin';

    // Guardamos en zustand
    useAuthStore.setState({ isAuthenticated: true, token, isAdmin });

    return { success: true, isAdmin };
  } catch (error) {
    console.error('Error al iniciar sesión:', error.message);
    return { success: false };
  }
};


export const logoutUser = async () => {
  try {
    await supabase.auth.signOut();
    useAuthStore.setState({ isAuthenticated: false, token: null, isAdmin: false });
  } catch (error) {
    console.error('Error al cerrar sesión:', error.message);
  }
};

export const checkAuth = () => {
  return useAuthStore.getState().isAuthenticated;
};

export default useAuthStore;



