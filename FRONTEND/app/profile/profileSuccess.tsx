import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
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

export default function profilePage({ navigation }: Props) {
  const router = useRouter();
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
            {/* <Icon
              name="check"
              size={30}
              color='white' // Dynamic tick color
              /> */}
              <AntDesign name="check" size={35} color="#fff" />
          </View>
      {/* Welcome Text */}
      <Text style={styles.welcomeText}>Profile Updated Successfully!</Text>

      {/* Subheading */}
      <Text style={styles.infoText}>
        Your information has been saved. Let’s get you started on your farm-to-table journey!
      </Text>

      {/* Buttons */}
      <View style={styles.footer}>

      <TouchableOpacity 
        style={styles.setupButton} 
        onPress={() => router.push('dashboard')}
      >
        <Text style={styles.setupButtonText}>Go to Dashboard</Text>
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
    marginBottom: 40,
  },
  setupButton: {
    backgroundColor: '#042D1F', // Dark green
    borderRadius: 10,
    paddingVertical: 15,
    // paddingHorizontal: 50,
    marginBottom: 15,
  },
  setupButtonText: {
    fontFamily: 'SchibstedGroteskBold',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  skipButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#696969', // Dark green border
    borderRadius: 10,
    paddingVertical: 15,
    // paddingHorizontal: 50,
  },
  skipButtonText: {
    fontFamily: 'SchibstedGrotesk-Medium',
    color: '#042D1F', // Dark green text
    fontSize: 16,
    textAlign: 'center',
  },


  footer: {
    paddingTop: '80%', // Space between button and other elements
    paddingBottom: 30, // Avoid sticking to the very bottom
    width: '100%',
  },
});
