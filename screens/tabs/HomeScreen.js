import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import PublicacionesScreen from './PublicacionesScreen';
import PerfilScreen from './PerfilScreen';
import AñadirPublicacionScreen from './AñadirPublicacionScreen';

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Publicaciones') {
            iconName = 'home';
          } else if (route.name === 'Ajustes') {
            iconName = 'settings';
          } else if (route.name === 'Add') {
            iconName = 'add-circle';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#9FC63B',
        tabBarInactiveTintColor: '#868686',
        tabBarStyle: {
          height: 55,
          backgroundColor: '#23272A',
        },
      })}
    >
      <Tab.Screen name="Publicaciones" component={PublicacionesScreen} />
      <Tab.Screen name="Add" component={AñadirPublicacionScreen} />
      <Tab.Screen name="Ajustes" component={PerfilScreen} />
    </Tab.Navigator>
  );
};

export default HomeScreen;
