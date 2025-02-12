import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { auth } from '../../firebase'; // Asegúrate de que esta importación esté correcta.

const USER_URL = 'http://192.168.150.157:8080/proyecto01/users/';
const PUB_URL = 'http://192.168.150.157:8080/proyecto01/publicaciones/byUser/';
const LIKED_PUB_URL = 'http://192.168.150.157:8080/proyecto01/publicaciones/liked/';

const PerfilScreen = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [publications, setPublicaciones] = useState([]);
  const [likedPublications, setLikedPublications] = useState([]);
  const [showLiked, setShowLiked] = useState(false); // Estado para controlar qué publicaciones mostrar

  const user = auth.currentUser;

  const getPublications = async (userId) => {
    try {
      const response = await fetch(`${PUB_URL}${userId}`);
      const data = await response.json();
      setPublicaciones(data);
    } catch (error) {
      console.error("Error al obtener las publicaciones del usuario:", error);
    }
  };

  const getLikedPublications = async (userId) => {
    try {
      const response = await fetch(`${LIKED_PUB_URL}${userId}`);
      const data = await response.json();
      setLikedPublications(data);
    } catch (error) {
      console.error("Error al obtener las publicaciones que le gustan:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (user) {
        const fetchUserData = async () => {
          setLoading(true);
          try {
            const response = await fetch(`${USER_URL}${user.uid}`);
            const data = await response.json();
            setUserData(data);
            getPublications(data.userid);
            getLikedPublications(data.userid);
          } catch (error) {
            console.error("Error al obtener los datos del usuario:", error);
          } finally {
            setLoading(false);
          }
        };

        fetchUserData();
      } else {
        setLoading(false);
      }

      return () => setUserData(null); 
    }, [user])
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#9FC63B" />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No se encontró el usuario</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      z<Viw
      <Image source={{ uri: userData.profile_picture }} style={styles.profileImage} />
      <Text style={styles.nick}>{userData.nick}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, !showLiked && styles.activeButton]} 
          onPress={() => setShowLiked(false)}
        >
          <Text style={styles.buttonText}>Mis Publicaciones</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, showLiked && styles.activeButton]} 
          onPress={() => setShowLiked(true)}
        >
          <Text style={styles.buttonText}>Publicaciones que me gustan</Text>
        </TouchableOpacity>
      </View>

      
      <FlatList
        data={showLiked ? likedPublications : publications}
        renderItem={({ item }) => (
          <View style={styles.publicationContainer}>
            <Image source={{ uri: item.image_url }} style={styles.publicationImage} />
            <Text style={styles.nick}>{item.titulo}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  nick: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  publicationContainer: {
    marginBottom: 20,
  },
  publicationImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  loadingText: {
    fontSize: 16,
    color: '#9FC63B',
    marginTop: 10,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  button: {
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  activeButton: {
    backgroundColor: '#9FC63B',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default PerfilScreen;
