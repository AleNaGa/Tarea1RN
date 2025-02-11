import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, TextInput, TouchableWithoutFeedback, Keyboard, FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { globalStyles } from '../../styles/styles.js';
import { auth } from '../../firebase';
import { useNavigation } from '@react-navigation/native';

const PublicacionDetalleScreen = ({ route }) => {
  const { publicacion, usuario } = route.params;
  const [liked, setLiked] = useState(false);  // Estado para verificar si el usuario ha dado like
  const [numLikes, setNumLikes] = useState(0);  // Contador de likes
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [comment, setComment] = useState(""); 
  const [comments, setComments] = useState([]); 
  const [users, setUsers] = useState({});

  const userId = auth.currentUser.uid;
  const navigation = useNavigation();

  // Obtener los comentarios de la publicación
  const fetchComments = async () => {
    try {
      const response = await fetch(`http://192.168.150.157:8080/proyecto01/comentarios/${publicacion.id}`);
      const data = await response.json();
      setComments(data);

      const userPromises = data.map(comment => fetchUser(comment.userid));
      await Promise.all(userPromises); 
    } catch (error) {
      console.error('Error al obtener comentarios:', error);
    }
  };

  const setDate = () => {
    const createdAt = new Date(publicacion.createdAt);
    const now = new Date();
    
    //conversion a milisegundos y dividir por 1000
    const differenceInTime = now - createdAt;
    const differenceInDays = Math.floor(differenceInTime / (1000 * 60 * 60 * 24));
  
    return differenceInDays === 0 ? "Hoy" : `${differenceInDays} días atrás`;
  };
  

  const dioLike = async () => {
    const response = await fetch(`http://192.168.150.157:8080/proyecto01/publicaciones/check/${publicacion.id}/${userId}`);
    const data = await response.json();
    console.log(data.liked);
    return data;
  }

  // Obtener los likes de la publicación y verificar si el usuario ha dado like
  const fetchLikes = async () => {
    try {
      const response = await fetch(`http://192.168.150.157:8080/proyecto01/publicaciones/byId/${publicacion.id}`);
      const data = await response.json();
      console.log(data.like.length);
  
      const likeData = await dioLike();
      if (likeData.liked) {
        setLiked(true);
      } else {
        setLiked(false);
      }

      setNumLikes(data.like ? data.like.length : 0);
    } catch (error) {
      console.error('Error al obtener likes:', error);
    }
  };
  

  useEffect(() => {
    fetchComments();
    fetchLikes(); 
  }, [publicacion.id]);

  const fetchUser = async (userid) => {
    try {
      const response = await fetch(`http://192.168.150.157:8080/proyecto01/users/${userid}`);
      const userData = await response.json();
      setUsers((prevUsers) => ({
        ...prevUsers,
        [userid]: userData, 
      }));
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
    }
  };

  // Función para dar o quitar like
  const toggleLike = async () => {
    try {
      // Mandar solicitud PUT para actualizar el like
      const response = await fetch(`http://192.168.150.157:8080/proyecto01/publicaciones/put/${publicacion.id}/${userId}`, {
        method: 'PUT',
      });

      if (response.ok) {
        // Act estado like
        if (liked) {
          setLiked(false);
          setNumLikes(numLikes - 1);
        } else {
          setLiked(true);
          setNumLikes(numLikes + 1);
        }
      } else {
        console.error('Error al dar like');
      }
    } catch (error) {
      console.error('Error en la petición de like:', error);
    }
  };

  // send Comentario
  const submitComment = async () => {
    const commentData = {
      id: new Date().getTime().toString(), 
      userid: userId,
      idPublicacion: publicacion.id,
      comentario: comment,
    };

    try {
      const response = await fetch(`http://192.168.150.157:8080/proyecto01/comentarios/put`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData),
      });
      if (response.ok) {
        setComment("");
        setShowCommentForm(false);
        fetchComments(); 
      } else {
        console.error('Error al enviar el comentario', response);
      }
    } catch (error) {
      console.error('Error al enviar el comentario:', error);
    }
  };

  // Renderizar cada comentario
  const renderComment = ({ item }) => {
    const user = users[item.userid];
    if (!user) {
      return <Text>Cargando usuario...</Text>;
    }

    return (
      <View style={styles.commentContainer}>
        <View style={styles.commentUserContainer}>
          <Image source={{ uri: user.profile_picture }} style={styles.commentUserImage} />
          <Text style={styles.commentUserNick}>{user.nick}</Text>
        </View>
        <Text style={styles.commentText}>{item.comentario}</Text>
      </View>
    );
  };

  return (
    <View style={globalStyles.container}>
      <View style={styles.userContainer}>
        <Image source={{ uri: usuario.profile_picture }} style={styles.profileImage} />
        <Text style={styles.nick}>{usuario.nick}</Text>
      </View>

      <Image source={{ uri: publicacion.image_url }} style={styles.postImage} />

      <TouchableOpacity style={styles.likeContainer} onPress={toggleLike}>
        <Ionicons name={liked ? 'heart' : 'heart-outline'} size={28} color={liked ? 'red' : 'black'} />
        <Text style={styles.likeText}>{numLikes} me gusta</Text>
      </TouchableOpacity>

      <Text style={globalStyles.title}>{publicacion.titulo}</Text>
      <Text style={globalStyles.text}>{publicacion.comentario}</Text>
      <Text style={globalStyles.text}>{setDate()}</Text>

      <TouchableOpacity style={styles.commentButton} onPress={() => setShowCommentForm(true)}>
        <Ionicons name="chatbubble-ellipses" size={30} color="black" />
      </TouchableOpacity>

      <Modal visible={showCommentForm} transparent={true} animationType="fade" onRequestClose={() => setShowCommentForm(false)}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalBackground}>
            <View style={styles.commentForm}>
              <Text style={styles.modalTitle}>Deja un comentario</Text>
              <TextInput
                style={styles.commentInput}
                multiline
                placeholder="Escribe tu comentario..."
                value={comment}
                onChangeText={setComment}
              />
              <View style={styles.formButtons}>
                <TouchableOpacity style={[styles.formButton, styles.cancelButton]} onPress={() => setShowCommentForm(false)}>
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.formButton, styles.submitButton]} onPress={submitComment}>
                  <Text style={styles.buttonText}>Enviar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <View style={styles.commentsContainer}>
        <Text style={globalStyles.title}>Comentarios</Text>
      <FlatList
        data={comments}
        renderItem={renderComment}
        keyExtractor={(item) => item.id}
        style={styles.commentsContainer}
      />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  nick: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  postImage: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 15,
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  likeText: {
    fontSize: 16,
    marginLeft: 5,
  },
  commentButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#9FC63B',
    padding: 15,
    borderRadius: 30,
    elevation: 5,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  commentForm: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  commentInput: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    padding: 10,
    textAlignVertical: 'top',
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formButton: {
    padding: 10,
    borderRadius: 5,
    width: '45%',
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  submitButton: {
    backgroundColor: '#9FC63B',
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
  commentsContainer: {
    marginTop: 20,
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  commentUserContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  commentUserImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 5,
  },
  commentUserNick: {
    fontWeight: 'bold',
  },
  commentText: {
    flex: 1,
  },
});

export default PublicacionDetalleScreen;
