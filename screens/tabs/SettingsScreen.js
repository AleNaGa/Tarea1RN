import React, { useState, useEffect } from 'react';
import { Image, View, Text, FlatList, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { globalStyles } from '../../styles/styles.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { auth } from '../../firebase';
import imagene from '../../assets/selectImage.png';

const TICKETS_URL = 'http://192.168.150.157:8080/proyecto01/tikets';

const SettingsScreen = () => {
  const [tickets, setTickets] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTicket, setNewTicket] = useState({ team: '', title: '', comment: '' });

  const userId = auth.currentUser.uid;

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await fetch(`${TICKETS_URL}/byUser/${userId}`);
      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const handleAddTicket = async () => {
    const ticketData = {
      id: new Date().getTime().toString(),
      userid: userId,
      team: newTicket.team,
      title: newTicket.title,
      comment: newTicket.comment,
      state: 'EN TRAMITE', 
    };

    try {
      const response = await fetch(`${TICKETS_URL}/post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketData),
      });

      if (response.ok) {
        setTickets([...tickets, ticketData]); 
        setModalVisible(false); 
        setNewTicket({ team: '', title: '', comment: '' }); 
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
    }
  };
  const getStateStyle = (state) => {
    if (state === 'EN TRAMITE') {
      return styles.inProgress;
    } else if (state === 'SOLUCIONADO') {
      return styles.solved;
    } else {
      return styles.denied;
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={globalStyles.title}>{item.title}</Text>
      <Text style={getStateStyle(item.state)}>{item.state}</Text>
    </View>
  );

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.titleCentered}>INCIDENCIAS</Text>

      <FlatList data={tickets} keyExtractor={(item) => item.id} renderItem={renderItem} />

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={globalStyles.titleCentered}>INCIDENCIA</Text>
            <View>
            <Text style={globalStyles.title}>Nº Equipo / clase</Text>
            <Text></Text>
            <TextInput
              style={globalStyles.titleInput}
              placeholder=""
              value={newTicket.team}
              onChangeText={(text) => setNewTicket({ ...newTicket, team: text })}
            />
            <Text style={globalStyles.title}>Titulo</Text>
            <Text></Text>
            <TextInput
              style={globalStyles.titleInput}
              placeholder="Max. 40 caracteres"
              value={newTicket.title}
              onChangeText={(text) => setNewTicket({ ...newTicket, title: text })}
            />
            <Text style={globalStyles.title}>Descripción del problema:</Text>
            <Text></Text>
            <TextInput
              style={globalStyles.commentInput}
              placeholder="Max. 250 caracteres"
              value={newTicket.comment}
              onChangeText={(text) => setNewTicket({ ...newTicket, comment: text })}
            />
            </View>
            <View style={styles.formButtons}>
              <TouchableOpacity style={[globalStyles.formButton, globalStyles.cancelButton]} onPress={() => setModalVisible(false)}>
                <Text style={globalStyles.buttonText2}>CANCELAR</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[globalStyles.formButton, globalStyles.submitButton]} onPress={handleAddTicket}>
                <Text style={globalStyles.buttonText2}>PUBLICAR</Text>
              </TouchableOpacity>
              <Text></Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  formButtons:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    marginHorizontal: 20,
  },
  card: {
    backgroundColor: '#23272A',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 20,
    borderRadius: 10,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  state: {
    marginTop: 5,
    fontStyle: 'italic',
    color: 'gray',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#9FC63B',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#00000080',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#23272A',
    width: '80%',
    padding: 0,
    borderRadius: 10,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 10,
  },
  cancelButtonText: {
    color: 'red',
    fontSize: 16,
  },
  inProgress: {
    color: 'orange',
  },
  solved: {
    color: 'green',
  },
  denied: {
    color: 'red',
  },
});

export default SettingsScreen;
