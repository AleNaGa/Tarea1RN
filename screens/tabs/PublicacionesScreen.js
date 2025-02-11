import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { globalStyles } from '../../styles/styles.js';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { auth } from '../../firebase';

const PUBLI_URL = 'http://192.168.150.157:8080/proyecto01/publicaciones';
const USER_URL = 'http://192.168.150.157:8080/proyecto01/users/';
const LIKE_URL = 'http://192.168.150.157:8080/proyecto01/publicaciones';

const PublicacionesScreen = ({ navigation }) => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [usuarios, setUsuarios] = useState({});
  const [loading, setLoading] = useState(true);
  const userId = auth.currentUser.uid;

  const fetchPublicaciones = async () => {
    setLoading(true);
    try {
      const response = await fetch(PUBLI_URL);
      const data = await response.json();

      // Para cada publicación, verificamos si el usuario ha dado like
      const publicacionesConLikes = await Promise.all(
        data.map(async (post) => {
          const likeResponse = await fetch(`${LIKE_URL}/check/${post.id}/${userId}`);
          const likeData = await likeResponse.json();
          return { ...post, likedByUser: likeData.liked };
        })
      );

      setPublicaciones(publicacionesConLikes);

      const usuariosData = {};
      await Promise.all(
        data.map(async (post) => {
          if (!usuarios[post.userid]) {
            const userResponse = await fetch(`${USER_URL}${post.userid}`);
            const userData = await userResponse.json();
            usuariosData[post.userid] = userData;
          }
        })
      );

      setUsuarios((prevUsuarios) => ({ ...prevUsuarios, ...usuariosData }));
    } catch (error) {
      console.error('Error al cargar publicaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchPublicaciones();
    }, [])
  );

  const toggleLike = async (postId, isLiked) => {
    try {
      const response = await fetch(`http://192.168.150.157:8080/proyecto01/publicaciones/put/${postId}/${userId}`, {
        method: 'PUT',
      });
      console.log(response);

      setPublicaciones((prevPublicaciones) =>
        prevPublicaciones.map((post) =>
          post.id === postId
            ? {
                ...post,
                likedByUser: !isLiked, // Actualizar el estado de like
                like: isLiked
                  ? post.like.filter((like) => like !== userId) // Eliminar el like del usuario
                  : [...post.like, userId],
              }
            : post
        )
      );
    } catch (error) {
      console.error('Error al dar/quitar like:', error);
    }
  };

  const renderItem = ({ item }) => {
    const usuario = usuarios[item.userid];

    return (
      <View style={globalStyles.card}>
        <View style={styles.userContainer}>
          <Image source={{ uri: usuario?.profile_picture }} style={styles.profileImage} />
          <Text style={styles.nick}>{usuario?.nick || 'Usuario desconocido'}</Text>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('PublicacionDetail', { publicacion: item, usuario })}>
          <Image source={{ uri: item.image_url }} style={styles.postImage} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.likeContainer} onPress={() => toggleLike(item.id, item.likedByUser)}>
          <Ionicons name={item.likedByUser ? 'heart' : 'heart-outline'} size={28} color={item.likedByUser ? 'red' : 'black'} />
          <Text style={styles.likeText}>{item.like?.length || 0} me gusta</Text>
        </TouchableOpacity>

        <Text style={globalStyles.title}>{item.titulo}</Text>
        <Text style={globalStyles.text}>{item.comentario}</Text>
      </View>
    );
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Publicaciones</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList data={publicaciones} keyExtractor={(item) => item.id} renderItem={renderItem} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  nick: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: 5,
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  likeText: {
    fontSize: 16,
    marginLeft: 5,
  },
});

export default PublicacionesScreen;
