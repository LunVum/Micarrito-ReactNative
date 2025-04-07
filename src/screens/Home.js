import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { logoutUser } from '../utils/auth';

const Home = () => {
  const navigation = useNavigation();

  const handleLogout = () => {
    logoutUser();
    navigation.replace('Login');
  };

  return (
    <View>
      <Text>Bienvenido a la aplicación!</Text>
      <Button title="Cerrar sesión" onPress={handleLogout} />
    </View>
  );
};

export default Home;
