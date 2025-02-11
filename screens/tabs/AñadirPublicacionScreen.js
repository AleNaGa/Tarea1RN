import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; 
import { auth } from '../../firebase'; 
import { globalStyles } from '../../styles/styles'; 

const AñadirPublicacionScreen = () => {
  const [titulo, setTitulo] = useState('');
  const [comentario, setComentario] = useState('');
  const [imageUrl, setImageUrl] = useState(null);

  const uploadImageToCloudinary = async (imageUri) => {
    const data = new FormData();
    data.append('file', {
      uri: imageUri,
      type: 'image/jpeg',  
      name: 'image.jpg',  
    });
    data.append('upload_preset', 'mi_upload_preset');
  
    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/db8jrvk1o/image/upload', {
        method: 'POST',
        body: data,
      });
  
      const responseData = await res.json();
      if (responseData.secure_url) {
        setImageUrl(responseData.secure_url);
      } else {
        Alert.alert('Error', 'Error al subir la imagen: ' + responseData.message);
      }
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      Alert.alert('Error', 'Hubo un problema al subir la imagen');
    }
  };
  
  const selectImage = async () => {
    console.log('Solicitando permisos para acceder a la galería...');
    
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('Estado del permiso:', status);

      if (status !== 'granted') {
        Alert.alert('Error', 'Debes conceder permisos para seleccionar imágenes.');
        return;
      }

      console.log('Permisos concedidos');

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      });

      if (!result.assets || result.assets.length === 0) {
        console.log('El usuario canceló la selección de imagen');
        return;
      }

      const selectedImageUri = result.assets[0].uri;
      console.log('Imagen seleccionada:', selectedImageUri);
      setImageUrl(selectedImageUri);

      await uploadImageToCloudinary(selectedImageUri);
    } catch (error) {
      console.log('Error al solicitar permisos o abrir galería:', error);
      Alert.alert('Error', 'Ocurrió un problema al acceder a la galería.');
    }
  };

  const handleSubmit = async () => {
    const user = auth.currentUser;

    if (user) {
      console.log("UID de Firebase:", user.uid);
    } else {
      console.log("No hay usuario autenticado");
    }
    
    if (!user) {
      Alert.alert('Error', 'No estás autenticado. Por favor inicia sesión.');
      return;
    }
  
    const userId = user.uid;
  
    if (!titulo || !comentario || !imageUrl) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }
  
    const newPost = {
      id: new Date().getTime().toString(), 
      userid: userId, 
      image_url: imageUrl, 
      titulo: titulo,
      comentario: comentario,
      like: [],  
      createdAt: new Date().toISOString(), 
    };
  
    try {
      const response = await fetch('http://192.168.150.157:8080/proyecto01/publicaciones/insert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      });
  
      if (response.ok) {
        Alert.alert('Éxito', 'Publicación creada con éxito');
  
        setTitulo('');
        setComentario('');
        setImageUrl(null);
      } else {
        Alert.alert('Error', 'No se pudo crear la publicación ' + response.status);
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema con la conexión');
    }
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Añadir Publicación</Text>
      <TextInput
        placeholder="Título"
        value={titulo}
        onChangeText={setTitulo}
        style={globalStyles.input}
      />
      <TextInput
        placeholder="Comentario"
        value={comentario}
        onChangeText={setComentario}
        style={globalStyles.input}
      />
      <TouchableOpacity style={globalStyles.button} onPress={selectImage}>
        <Text style={globalStyles.buttonText}>Seleccionar Imagen</Text>
      </TouchableOpacity>
      <Text>{imageUrl ? 'Imagen seleccionada' : 'No se ha seleccionado ninguna imagen'}</Text>

      <TouchableOpacity style={globalStyles.button} onPress={handleSubmit}>
        <Text style={globalStyles.buttonText}>Publicar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AñadirPublicacionScreen;
