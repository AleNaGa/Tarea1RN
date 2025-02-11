import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import PublicacionesScreen from './PublicacionesScreen';
import PublicacionDetail from './PublicacionDetail';
import PerfilScreen from './PerfilScreen'; // Importa PerfilScreen

const Stack = createStackNavigator();

const PublicacionesStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="PublicacionesHome" 
        component={PublicacionesScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="PublicacionDetail" 
        component={PublicacionDetail} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="PerfilScreen"  // Agrega la pantalla Perfil aquí
        component={PerfilScreen}
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>
  );
};

export default PublicacionesStack;
