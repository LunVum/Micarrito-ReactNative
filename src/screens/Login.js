import React, { useState } from 'react';
import { View, TextInput, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { loginUser } from '../utils/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true); // Nuevo estado
  const navigation = useNavigation();

  const handleLogin = async () => {
    const success = await loginUser(email, password);
    if (success) {
      navigation.replace('Home');
    } else {
      Alert.alert('Error', 'Error de autenticación');
    }
  };

  return (
    <View style={styles.padre}>
      <Image source={require("../../assets/Profile1.jpg")} style={styles.profile} />

      <View style={styles.tarjeta}>
        <View style={styles.cajaTexto}>
          <TextInput
            value={email}
            style={{ paddingHorizontal: 15 }}
            onChangeText={setEmail}
            placeholder="correo@gmail.com"
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.cajaTexto}>
          <View style={styles.passwordContainer}>
            <TextInput
              value={password}
              style={styles.passwordInput}
              onChangeText={setPassword}
              secureTextEntry={hidePassword} //  Aquí usamos el estado
              placeholder="Password"
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setHidePassword(!hidePassword)}>
              <Text style={styles.toggleText}>
                {hidePassword ? 'Mostrar' : 'Ocultar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.PadreBoton}>
          <TouchableOpacity style={styles.cajaBoton} onPress={handleLogin}>
            <Text style={styles.TextoBoton}>Iniciar sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  padre: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  profile: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: 'white',
    marginBottom: 20,
  },
  tarjeta: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    width: '90%',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  cajaTexto: {
    paddingVertical: 20,
    backgroundColor: '#cccccc40',
    borderRadius: 30,
    marginVertical: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  passwordInput: {
    flex: 1,
  },
  toggleText: {
    color: '#525FE1',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  PadreBoton: {
    alignItems: 'center',
  },
  cajaBoton: {
    backgroundColor: '#525FE1',
    borderRadius: 30,
    paddingVertical: 20,
    width: 150,
    marginTop: 20,
  },
  TextoBoton: {
    textAlign: 'center',
    color: 'white',
  },
});
