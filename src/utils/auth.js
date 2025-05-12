import { create } from 'zustand';
import { supabase } from './supabaseConfig';

const useAuthStore = create((set) => ({
  isAuthenticated: false,
  token: null,
  isAdmin: false,
  login: (token, isAdmin) => set({ isAuthenticated: true, token, isAdmin }),
  logout: () => set({ isAuthenticated: false, token: null, isAdmin: false }),
}));

// Función para actualizar el rol de un usuario a admin (solo para el usuario con el email específico)
const updateUserRole = async (userId) => {
  try {
    if (userId !== null) {
      const { data, error } = await supabase.auth.admin.updateUserById(userId, {
        app_metadata: {
          role: ['admin'], // Asignar el rol 'admin'
        },
      });

      if (error) throw error;

      console.log(`Rol de admin asignado al usuario ${userId}:`, data);
      return { success: true, data };
    }
  } catch (error) {
    console.error('Error al actualizar el rol del usuario:', error.message);
    return { success: false, error: error.message };
  }
};

// Función para registrar un usuario
export const signUpUser = async (email, password, role = 'user') => {
  try {
    // Crear usuario en Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    const user = data.user;
    if (!user) throw new Error('Usuario no creado en Auth');

    console.log('User created in auth:', user);

    // Verificar si el usuario ya existe en la tabla 'users'
    const { data: existingUser, error: existingUserError } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single();

    if (existingUserError && existingUserError.code !== 'PGRST116') {
      throw existingUserError; // Si hay un error diferente al "No encontrado"
    }

    // Si el usuario no existe, insertarlo
    if (!existingUser) {
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
    } else {
      console.log('El usuario ya existe en la tabla users');
    }

    // Solo asignar el rol de admin al usuario con el email 'virutriluna6@gmail.com'
    if (email === 'virutriluna6@gmail.com') {
      // Primero actualizar el rol a 'admin' en los metadatos de Auth
      const { error: updateRoleError } = await supabase.auth.admin.updateUserById(user.id, {
        app_metadata: {
          role: 'admin', // Asignar el rol 'admin'
        },
      });

      if (updateRoleError) {
        console.error('Error al actualizar el rol del usuario:', updateRoleError.message);
      } else {
        console.log('Rol de admin asignado correctamente en los metadatos');
      }

      // Luego asegurarse de que el rol 'admin' también esté en la tabla 'users'
      const { error: updateUserRoleError } = await supabase
        .from('users')
        .upsert([
          {
            id: user.id,
            email: email,
            role: 'admin', // Aquí se asegura de que el rol 'admin' esté también en la tabla 'users'
          },
        ]);

      if (updateUserRoleError) {
        console.error('Error al actualizar el rol en la tabla users:', updateUserRoleError);
      } else {
        console.log('Rol de admin actualizado en la tabla users');
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error al registrar usuario:', error.message);
    return { success: false };
  }
};

// Función para iniciar sesión
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

// Función para cerrar sesión
export const logoutUser = async () => {
  try {
    await supabase.auth.signOut();
    useAuthStore.setState({ isAuthenticated: false, token: null, isAdmin: false });
  } catch (error) {
    console.error('Error al cerrar sesión:', error.message);
  }
};

// Función para comprobar si el usuario está autenticado
export const checkAuth = () => {
  return useAuthStore.getState().isAuthenticated;
};

export default useAuthStore;






