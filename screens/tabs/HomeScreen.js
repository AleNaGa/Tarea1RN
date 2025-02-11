import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import PublicacionesStack from './PublicacionesStack'; 
import PerfilScreen from './PerfilScreen';
import AñadirPublicacionScreen from './AñadirPublicacionScreen';
import SettingsScreen from './SettingsScreen';
import {auth} from '../../firebase';

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  const user = auth.currentUser;
  const userId = user ? user.uid : null;
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Publicaciones') iconName = 'home';
          else if (route.name === 'Ajustes') iconName = 'settings';
          else if (route.name === 'Add') iconName = 'add-circle';
          else if (route.name === 'Perfil') iconName = 'person-circle-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#9FC63B',
        tabBarInactiveTintColor: '#868686',
        tabBarStyle: { height: 55, backgroundColor: '#23272A' },
      })}
    >
      <Tab.Screen name="Publicaciones" component={PublicacionesStack} />  
      <Tab.Screen name="Add" component={AñadirPublicacionScreen} />
      <Tab.Screen name="Ajustes" component={SettingsScreen} /> 
      <Tab.Screen name="Perfil" component={PerfilScreen} initialParams={{ user: userId }} /> 
    </Tab.Navigator>
  );
};

export default HomeScreen;
