import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const GreenScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.whiteText}>FarmMeet</Text>
    </View>
  );
};

export default GreenScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#013220',
  },
  whiteText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
