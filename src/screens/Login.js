import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  BackHandler,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { loginUser, signUpUser } from '../utils/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const navigation = useNavigation();

  const showAlert = (title, message) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleLogin = async () => {
    const result = await loginUser(email, password);

    if (result.success) {
      if (result.isAdmin) {
        navigation.replace('AdminHome');
      } else {
        navigation.replace('Home');
      }
    } else {
      showAlert('Error', 'Credenciales incorrectas');
    }
  };

  const handleRegister = async () => {
    if (!email || !password) {
      showAlert('Error', 'Por favor, rellena correo y contraseña.');
      return;
    }

    const result = await signUpUser(email, password);

    if (result.success) {
      showAlert('Éxito', 'Usuario creado correctamente. Por favor inicia sesión.');
      setEmail('');
      setPassword('');
    } else {
      showAlert('Error', result.errorMessage || 'Error al crear usuario');
    }
  };

  const handleExitApp = () => {
    BackHandler.exitApp();
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
              secureTextEntry={hidePassword}
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

          <TouchableOpacity onPress={handleRegister}>
            <Text style={styles.linkText}>¿No tienes cuenta? Crear una</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.cajaBoton, { marginTop: 10, backgroundColor: '#e63946' }]}
            onPress={handleExitApp}
          >
            <Text style={styles.TextoBoton}>Salir de la aplicación</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  padre: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profile: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 30,
  },
  tarjeta: {
    width: '100%',
    maxWidth: 400,
    padding: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    alignSelf: 'center',
  },
  cajaTexto: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  passwordContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  toggleText: {
    color: '#2f9e44',
    marginLeft: 10,
  },
  PadreBoton: {
    marginTop: 20,
    gap: 10,
  },
  cajaBoton: {
    backgroundColor: '#525FE1',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  TextoBoton: {
    color: '#fff',
    fontWeight: 'bold',
  },
  linkText: {
    color: '#2f80ed',
    marginTop: 15,
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
});

export default Login;


