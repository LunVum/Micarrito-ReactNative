import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { checkAuth } from '../utils/auth';

const Middleware = ({ navigation }) => {
  useEffect(() => {
    const checkUserAuth = async () => {
      const isAuthenticated = await checkAuth();
      if (isAuthenticated) {
        navigation.replace('Home');
      } else {
        navigation.replace('Login');
      }
    };
    checkUserAuth();
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

