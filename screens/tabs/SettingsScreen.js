import React from 'react';
import { View, Text } from 'react-native';
import { globalStyles } from '../../styles/styles.js';

const SettingsScreen = () => {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Ajustes</Text>
    </View>
  );
};

export default SettingsScreen;
