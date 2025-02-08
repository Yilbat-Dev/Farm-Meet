import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { router } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome'; // Icon library
import AntDesign from '@expo/vector-icons/AntDesign'; // Icon library


// Define the types for your navigation routes
type RootStackParamList = {
  SuccessPage: undefined; // Correctly using 'SuccessPage'
  SetupProfile: undefined;
  Home: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'SuccessPage'>;

export default function SuccessPage({ navigation }: Props) {
  return (
    <View style={styles.container}>
       <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 100,
              backgroundColor: '#529500', // Default border color
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,}}
             >
              <AntDesign name="check" size={35} color="#fff" />
          </View>
      {/* Welcome Text */}
      <Text style={styles.welcomeText}>All Done !</Text>

      {/* Subheading */}
      <Text style={styles.infoText}>
        Your password has been changed.
      </Text>
      <Text style={styles.infoText}>
        You can now log in with your new password.
      </Text>

      {/* Buttons */}
      <View style={styles.footer}>
      <TouchableOpacity 
        style={styles.loginButton} 
        onPress={() => router.push('/auth/login')}
      >
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    paddingTop:'50%',
    alignItems: 'center',
    padding: 20,
  },
  welcomeText: {
    fontFamily: 'SchibstedGrotesk-Medium',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  infoText: {
    fontFamily: 'SchibstedGrotesk-Regular',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 5,
  },
  loginButton: {
    backgroundColor: '#042D1F', // Dark green
    borderRadius: 10,
    paddingVertical: 15,
    // paddingHorizontal: 50,
    marginBottom: 15,
  },
  loginButtonText: {
    fontFamily: 'SchibstedGroteskBold',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },



  footer: {
    paddingTop: '90%', // Space between button and other elements
    paddingBottom: 30, // Avoid sticking to the very bottom
    width: '100%',
  },
});
