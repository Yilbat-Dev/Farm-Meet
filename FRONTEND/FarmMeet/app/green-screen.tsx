import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const GreenScreen = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.push('/splash-1')}>
        <Text style={styles.whiteText}>FarmMeet</Text>
      </TouchableOpacity>
      
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
