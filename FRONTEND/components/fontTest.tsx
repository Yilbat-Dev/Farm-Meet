import React, { ReactNode } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import AppLoading from 'expo-app-loading';
// import { useFonts } from '@expo-google-fonts/darker-grotesque';
import {
    useFonts,
    DarkerGrotesque_300Light,
    DarkerGrotesque_400Regular,
    DarkerGrotesque_500Medium,
    DarkerGrotesque_600SemiBold,
    DarkerGrotesque_700Bold,
    DarkerGrotesque_800ExtraBold,
    DarkerGrotesque_900Black
  } from '@expo-google-fonts/darker-grotesque';

// Define component with typed props
const FontTest: React.FC = () => {
  let [fontsLoaded] = useFonts({
    DarkerGrotesque_300Light,
    DarkerGrotesque_400Regular,
    DarkerGrotesque_500Medium,
    DarkerGrotesque_600SemiBold,
    DarkerGrotesque_700Bold,
    DarkerGrotesque_800ExtraBold,
    DarkerGrotesque_900Black,
  });

  if (!fontsLoaded) {
    return <AppLoading />; // Wait for fonts to load
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { fontFamily: 'DarkerGrotesque_300Light' }]}>
        Darker Grotesque Light
      </Text>
      <Text style={[styles.text, { fontFamily: 'DarkerGrotesque_400Regular' }]}>
        Darker Grotesque Regular
      </Text>
      <Text style={[styles.text, { fontFamily: 'DarkerGrotesque_500Medium' }]}>
        Darker Grotesque Medium
      </Text>
      <Text style={[styles.text, { fontFamily: 'DarkerGrotesque_600SemiBold' }]}>
        Darker Grotesque Semi Bold
      </Text>
      <Text style={[styles.text, { fontFamily: 'DarkerGrotesque_700Bold' }]}>
        Darker Grotesque Bold
      </Text>
      <Text style={[styles.text, { fontFamily: 'DarkerGrotesque_800ExtraBold' }]}>
        Darker Grotesque Extra Bold
      </Text>
      <Text style={[styles.text, { fontFamily: 'DarkerGrotesque_900Black' }]}>
        Darker Grotesque Black
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    paddingVertical: 6,
  },
});

export default FontTest;
