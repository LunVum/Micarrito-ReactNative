import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { supabase } from '../utils/supabaseConfig';

const Middleware = ({ navigation }) => {
  useEffect(() => {
    const unsubscribe = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigation.replace('Home');
      } else {
        navigation.replace('Login');
      }
    });

    return () => {
      unsubscribe();
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Verificando tu sesión...</Text>
      <ActivityIndicator size="large" color="#525FE1" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  text: {
    marginBottom: 10,
    fontSize: 18,
    color: '#525FE1',
  },
});

export default Middleware;


