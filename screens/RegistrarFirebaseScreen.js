import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase.js'; 
import { globalStyles } from '../styles/styles.js';
import formBG from '../assets/formBG.png';

const Register = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nick, setNick] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName1, setLastName1] = useState('');
  const [lastName2, setLastName2] = useState('');

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (!email || !password || !nick || !firstName || !lastName1 || !lastName2) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      Alert.alert('Éxito', 'Usuario registrado exitosamente');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={globalStyles.container}>
      <ImageBackground
        source={formBG} 
        style={globalStyles.imageBackground} 
      ></ImageBackground>

      <Text style={[globalStyles.title, { marginTop: -120, marginBottom: 50 }]}>Completar los siguientes campos</Text>

      <View style={globalStyles.inputsContainer}>
        <TextInput
          placeholder="Introduzca su correo"
          value={email}
          onChangeText={setEmail}
          style={globalStyles.input}
          keyboardType="email-address"
          placeholderTextColor="#868686"  
        />
        <TextInput
          placeholder="Introduzca su contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={globalStyles.input}
          placeholderTextColor="#868686"  
        />
        <TextInput
          placeholder="Repita contraseña"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={globalStyles.input}
          placeholderTextColor="#868686"  
        />
        <TextInput
          placeholder="Introduzca su Nick"
          value={nick}
          onChangeText={setNick}
          style={globalStyles.input}
          placeholderTextColor="#868686"  
        />
        <TextInput
          placeholder="Introduzca su Nombre"
          value={firstName}
          onChangeText={setFirstName}
          style={globalStyles.input}
          placeholderTextColor="#868686"  
        />
        <TextInput
          placeholder="Introduzca su primer apellido"
          value={lastName1}
          onChangeText={setLastName1}
          style={globalStyles.input}
          placeholderTextColor="#868686"  
        />
        <TextInput
          placeholder="Introduzca su segundo apellido"
          value={lastName2}
          onChangeText={setLastName2}
          style={globalStyles.input}
          placeholderTextColor="#868686"  
        />
      </View>

      <TouchableOpacity style={[globalStyles.button, { marginTop: 50}]} onPress={handleRegister}>
        <Text style={globalStyles.buttonText}>FINALIZAR</Text>
      </TouchableOpacity>
      
    </View>
  );
};

export default Register;
