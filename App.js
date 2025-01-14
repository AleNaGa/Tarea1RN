import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginFirebaseScreen from './screens/LoginFirebaseScreen';
import RegistrarFirebaseScreen from './screens/RegistrarFirebaseScreen';
import HomeScreen from './screens/tabs/HomeScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login" >
        <Stack.Screen name="Login" component={LoginFirebaseScreen} />
        <Stack.Screen name="Register" component={RegistrarFirebaseScreen} />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
