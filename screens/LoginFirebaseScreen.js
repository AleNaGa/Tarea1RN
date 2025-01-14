import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase.js'; 
import { globalStyles } from '../styles/styles.js'; 
import vedrunaBG from '../assets/vedrunaBG.png';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Inicio de sesión correcto");
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', 'Credenciales incorrectas');
    }
  };

  return (
    <View style={globalStyles.container}>
      <ImageBackground source={vedrunaBG} style={[globalStyles.imageBackground, { width: '100%', height: 300, marginBottom: 150 }]}></ImageBackground>
      <View style={globalStyles.inputsContainer}>
          <Text style={[globalStyles.title, { marginTop: -150, color: '#FFFFFF', fontSize: 50, position: 'absolute', justifyContent: 'center' }]}>VEDRUNA EDUCACION</Text>
        <TextInput
          placeholder="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          style={[globalStyles.inputLogin, { color: '#FFFFFF' }]}
          keyboardType="email-address"
          placeholderTextColor="#868686"  
        />
        <TextInput
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={[globalStyles.inputLogin, { color: '#FFFFFF' }]}
          placeholderTextColor="#868686"  
        />
        <View style={{ alignItems: 'flex-end', paddingRight: 9 }}>
            <Text style={[globalStyles.text, { color: '#9FC63B' }]}>¿Olvidaste tu contraseña?</Text>
        </View>


    </View>
        <TouchableOpacity style={[globalStyles.buttonLogin, { marginTop: 50, width: '100%' }]} onPress={handleLogin}>
            <Text style={[globalStyles.text, { color: '#23272A', fontWeight: 'bold' }]}>Log In</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
            <Text style={[globalStyles.text, { marginTop: 20 }]}>
                ¿No tienes una cuenta?
                <TouchableOpacity onPress={() => navigation.navigate('Register')}> 
                    <Text style={[globalStyles.text, { color: '#9FC63B' }]}> Crear cuenta</Text> 
                </TouchableOpacity>
            </Text>
        </View>
    </View>
  );
};

export default Login;
