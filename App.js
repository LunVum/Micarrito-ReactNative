import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { supabase } from './src/utils/supabaseConfig';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      // Comprobamos el estado inicial de la sesión
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error al obtener la sesión:", error.message);
      } else {
        setIsAuthenticated(!!session);
      }

      // Nos suscribimos a los cambios en el estado de la sesión
      const unsubscribe = supabase.auth.onAuthStateChange((event, session) => {
        setIsAuthenticated(!!session);
      });

      return () => {
        unsubscribe(); // Limpiamos la suscripción al cambiar de pantalla o desmontar el componente
      };
    };

    checkSession();

  }, []);

  return (
    <NavigationContainer>
      <AppNavigator isAuthenticated={isAuthenticated} />
    </NavigationContainer>
  );
}



