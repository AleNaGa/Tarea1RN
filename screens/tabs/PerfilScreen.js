import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { auth } from '../../firebase'; 
import { getAuth } from 'firebase/auth';
import { globalStyles } from '../../styles/styles';
import Ionicons from 'react-native-vector-icons/Ionicons';



const USER_URL = 'http://192.168.150.157:8080/proyecto01/users/';
const PUB_URL = 'http://192.168.150.157:8080/proyecto01/publicaciones/byUser/';
const LIKED_PUB_URL = 'http://192.168.150.157:8080/proyecto01/publicaciones/liked/';

const PerfilScreen = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [publications, setPublicaciones] = useState([]);
  const [likedPublications, setLikedPublications] = useState([]);
  const [showLiked, setShowLiked] = useState(false); 
  const [userEmail, setUserEmail] = useState('');

  const user = auth.currentUser;


  const getCurrentUserEmail = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (user) {
      console.log('Correo electrónico del usuario:', user.email);
      return user.email; 
    } else {
      console.log('No hay un usuario autenticado');
    }
  };
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
        setUserEmail(getCurrentUserEmail());
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
    <View style={globalStyles.container}>
      <View style={styles.containerPFP}>
      <View style={styles.profileContainer}>
        <Image source={{ uri: userData.profile_picture }} style={styles.profileImage} />
        <View style={styles.followers}>
          <Text style={styles.followersText}>      {publications.length}</Text>
          <Text style={styles.followersText2}>Publicaciones</Text>
        </View>
        <View style={styles.followers}>
          <Text style={styles.followersText}>   10</Text>
          <Text style={styles.followersText2}>  Seguidores</Text>
        </View>
        <View style={styles.followers}>
          <Text style={styles.followersText}>40</Text>
          <Text style={styles.followersText2}>Seguidos</Text>
        </View>
      </View>
      <Text></Text>
      <View style={styles.nickContainer}>
        <Text style={globalStyles.title}>{userData.nick}</Text>
        <Text style={globalStyles.likeText}>{userEmail}</Text>
      </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[!showLiked && styles.activeButton]} 
          onPress={() => setShowLiked(false)}
        >
          <Ionicons name="grid" size={60} color="#868686"/>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[showLiked && styles.activeButton]} 
          onPress={() => setShowLiked(true)}
        >
          <Ionicons name="heart" size={60} color="#868686"/>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={showLiked ? likedPublications : publications}
        numColumns={4}
        renderItem={({ item }) => (
          <View style={styles.publicationContainer}>
            <Image source={{ uri: item.image_url }} style={styles.publicationImage} />
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  followers: {
    width: 90,
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'center',
    
  },
  followersText: {
    marginLeft: 20,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFF',
  },
  followersText2: {
    fontSize: 15,
    color: 'grey',
  },
  containerPFP:{
    padding:40,
  },
  profileContainer: {
    flexDirection: 'row',
  },
  container: {
    padding: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 80,
    borderWidth: 3,
    borderColor: '#9FC63B',
    marginRight: 10,
    resizeMode: 'cover',
    aspectRatio:1,
  },
  nick: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  publicationContainer: {
    width: '25%',
    aspectRatio: 1,

  },
  publicationImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
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
    justifyContent: 'center',
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
