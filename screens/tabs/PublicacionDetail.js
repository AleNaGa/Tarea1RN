import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity, Modal, TextInput, TouchableWithoutFeedback, Keyboard, FlatList } from 'react-native';
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
    const differenceInTime = now - createdAt;
    const differenceInDays = Math.floor(differenceInTime / (1000 * 60 * 60 * 24));
    return differenceInDays === 0 ? "Hoy" : `hace ${differenceInDays} días`;
  };

  const dioLike = async () => {
    const response = await fetch(`http://192.168.150.157:8080/proyecto01/publicaciones/check/${publicacion.id}/${userId}`);
    const data = await response.json();
    return data;
  }

  const fetchLikes = async () => {
    try {
      const response = await fetch(`http://192.168.150.157:8080/proyecto01/publicaciones/byId/${publicacion.id}`);
      const data = await response.json();
  
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
      setUsers((prevUsers) => ({ ...prevUsers, [userid]: userData }));
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
    }
  };

  const toggleLike = async () => {
    try {
      const response = await fetch(`http://192.168.150.157:8080/proyecto01/publicaciones/put/${publicacion.id}/${userId}`, {
        method: 'PUT',
      });

      if (response.ok) {
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

  const renderComment = ({ item }) => {
    const user = users[item.userid];
    if (!user) {
      return <Text>Cargando usuario...</Text>;
    }

    return (
      <View style={globalStyles.commentContainer}>
        <View style={globalStyles.commentUserPFP}>
            <Image source={{ uri: user.profile_picture }} style={globalStyles.commentUserImage} />
          <View style={globalStyles.commentUserContainer}>
            <Text style={globalStyles.commentUserNick}>{user.nick}</Text>
          <View style={globalStyles.commentText}>
            <Text style={globalStyles.likeText}>{item.comentario}</Text>
          </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <><ScrollView contentContainerStyle={globalStyles.scrollViewContainer}>
      <View style={globalStyles.userContainer2}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 10 }}>
          <Ionicons name="chevron-back" size={40} color="#9FC63B" />
        </TouchableOpacity>
        <Image source={{ uri: usuario.profile_picture }} style={globalStyles.profileImage} />
        <View style={globalStyles.userTextContainer}>
          <Text style={globalStyles.text}>Publicado por:</Text>
          <Text style={globalStyles.nickB}>{usuario?.nick || 'Usuario desconocido'}</Text>
        </View>
      </View>

      <Image source={{ uri: publicacion.image_url }} style={globalStyles.postImage} />
      <View style={globalStyles.postText2}>
        <TouchableOpacity style={globalStyles.likeContainer} onPress={toggleLike}>
          <Ionicons name={liked ? 'heart' : 'heart-outline'} size={28} color={liked ? 'red' : '#868686'} />
          <Text style={globalStyles.likeText}>   {numLikes} me gusta {"\n"}</Text>
        </TouchableOpacity>
      </View>


      <View style={globalStyles.postText2}>
        <Text style={globalStyles.title}>{publicacion.titulo}</Text>
        <Text style={globalStyles.text}>{publicacion.comentario}</Text>
        <View style={globalStyles.secContainer}>
          <Text style={globalStyles.secText}>{setDate()}</Text>
        </View>
      </View>
      <Modal visible={showCommentForm} transparent={true} animationType="fade" onRequestClose={() => setShowCommentForm(false)}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={globalStyles.modalBackground}>
            <View style={globalStyles.commentForm}>
              <Text style={globalStyles.modalTitle}>COMENTARIO: </Text>
              <TextInput
                style={globalStyles.commentInput}
                multiline
                placeholder="Max 500 Caracteres ... "
                value={comment}
                onChangeText={setComment} />
              <View style={globalStyles.formButtons}>
                <TouchableOpacity style={[globalStyles.formButton, globalStyles.cancelButton]} onPress={() => setShowCommentForm(false)}>
                  <Text style={globalStyles.buttonText2}>CANCELAR</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[globalStyles.formButton, globalStyles.submitButton]} onPress={submitComment}>
                  <Text style={globalStyles.buttonText2}>PUBLICAR</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <View style={globalStyles.commentsContainer}>
        <Text style={globalStyles.title}>Comentarios</Text>
        <FlatList
          data={comments}
          renderItem={renderComment}
          keyExtractor={(item) => item.id} />
      </View>
    </ScrollView><TouchableOpacity style={globalStyles.commentButton} onPress={() => setShowCommentForm(true)}>
        <Ionicons name="chatbubble-ellipses" size={30} color="black" />
      </TouchableOpacity></>
  );
};

const styles = StyleSheet.create({
  
});

export default PublicacionDetalleScreen;
