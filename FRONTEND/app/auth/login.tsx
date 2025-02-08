import React, { useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { router, useRouter } from 'expo-router';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Modal,
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SignIn() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignIn = async () => {
    if (!phoneNumber || !password) {
      // Alert.alert('Error', 'Please enter your phone number and password.');
      // return;
      setErrorMessage('Please enter your phone number and password.');
      setErrorModalVisible(true);
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await fetch('https://farm-meet-snj4.onrender.com/users/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
        body: JSON.stringify({
          phone_number: phoneNumber,
          password: password,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Save tokens securely
        await SecureStore.setItemAsync('accessToken', data.access);
        await SecureStore.setItemAsync('refreshToken', data.refresh);
  
        // Alert.alert('Success', 'You are now signed in.');
        router.push('/auth/success'); // Navigate to the next screen
      } else {
        // Alert.alert('Error', data.detail || 'Invalid credentials.');
        setErrorMessage('Oops! Seems like the phone number or password entered is wrong.');
        setErrorModalVisible(true);
      }
    } catch (error) {
        setErrorMessage('Something went wrong. could be your network.');
        setErrorModalVisible(true);
        // Alert.alert('Error', 'Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const router = useRouter();

    
  return (
    <View style={styles.container}>
      {/* Heading */}
      {/* <Text style={styles.heading}>Sign In</Text> */}

      <Text style={styles.fieldTitle}>Phone Number *</Text>
      {/* Phone Number Input */}
            <TextInput
              style={styles.input}
              placeholder="e.g. 09066867674"
              placeholderTextColor='#a1a1a1'
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              />
      <Text style={styles.fieldTitle}>Password</Text>
      {/* Phone Number Input */}
      <View style={styles.passwordContainer}>
            <TextInput
               style={styles.passwordInput} 
               placeholder="8 characters minimum" 
               placeholderTextColor='#a1a1a1'
               secureTextEntry={!passwordVisible} // Hide the password
               value={password}
               onChangeText={setPassword}
               />
              <TouchableOpacity
                  onPress={() => setPasswordVisible(!passwordVisible)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={passwordVisible ? 'eye' : 'eye-off'}
                    size={24}
                    color="#a1a1a1"
                  />
              </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => router.push('/auth/forgotPassword')} >
        <Text style={styles.forgotPasswordInText}>
          Forgot your password?
        </Text>
      </TouchableOpacity>

      {/* Sign In Button */}
      <View style={styles.footer}>

      <TouchableOpacity 
        style={styles.signInButton} 
        onPress={handleSignIn}
        disabled={loading}
        >
        <Text style={styles.signInButtonText}>
          {loading ? 'Signing In...' : 'Sign In'}
        </Text>
      </TouchableOpacity>

      {/* Sign Up Redirect */}
        <View style={styles.redirectMessage}>
        <Text style={styles.redirectText}>New Here?</Text>
        <TouchableOpacity onPress={() => router.push('/auth/register')} >
          <Text style={styles.signUpText}>
            Sign Up
          </Text>
        </TouchableOpacity>
        </View>
      </View>
         {/* Error Modal */}
         <Modal
          visible={errorModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setErrorModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {/* Red bar on the left */}
              <View style={styles.modalRedBar} />
              {/* Message and close icon */}
              <View style={styles.modalMessageContainer}>
                <Text style={styles.modalMessage}>{errorMessage}</Text>
                <TouchableOpacity
                  onPress={() => setErrorModalVisible(false)}
                  style={styles.modalCloseIcon}
                >
                  <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 20,
    backgroundColor: 'white',
  },
  heading: {
    fontFamily: 'DarkerGrotesque_800ExtraBold',
    fontSize: 32,
    // fontWeight: 'bold',
    color: '#042D1F',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    fontFamily: "SchibstedGrotesk-Regular",
    borderWidth: 1,
    borderColor: '#F4F4F4',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 14,
  },
  signInButton: {
    backgroundColor: '#042D1F',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  signInButtonText: {
    fontFamily: "SchibstedGroteskBold",
    color: 'white',
    fontSize: 18,
  },
  redirectText: {
    fontFamily: "SchibstedGrotesk-Regular",
    fontSize: 14,
    textAlign: 'center',
    paddingRight: 5,
  },
  signUpText: {
    fontFamily: "SchibstedGrotesk-Regular",
    fontSize: 14,
    textAlign: 'center',
    color: '#529500',
    textDecorationLine: 'underline',
  },
  redirectMessage: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  forgotPasswordInText: {
    fontFamily: "SchibstedGrotesk-Regular",
    fontSize: 14,
    marginLeft: 16,
    textAlign: 'right',
    marginTop: 16,
    marginBottom:16,
    color: '#529500',
  },
  fieldTitle: {
    fontFamily: "SchibstedGrotesk-SemiBold",
    fontSize: 15,
    // fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },


//2nd part
  eyeIcon: {   //the password icon
    position: 'absolute',
    right: 10,
    // top: '35%', // Center the icon vertically
  },
  passwordContainer: {
    flexDirection: 'row', // Allows placing the icon beside the TextInput
    alignItems: 'center', // Vertically align the TextInput and the icon
    borderWidth: 1,
    borderColor: '#F4F4F4',
    borderRadius: 10,
    paddingHorizontal: 15, // Horizontal padding for consistent styling
    height: 50, // Match the visual height of the `input`
    marginBottom: 15,
  },
  passwordInput: {
    fontFamily: "SchibstedGrotesk-Regular",
    fontSize: 14,
  },

  //3rd part
  footer: {
    paddingTop: '80%', // Space between button and other elements
    paddingBottom: 30, 
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  modalContent: {
    top: '15%', // Center the modal
    flexDirection: 'row', // Align red bar and content side-by-side
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 5,
    overflow: 'hidden',
    elevation: 5, // For shadow on Android
    shadowColor: '#000', // For shadow on iOS
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  modalRedBar: {
    width: 8, // Thin red bar
    backgroundColor: 'red',
  },
  modalMessageContainer: {
    flex: 1,
    flexDirection: 'row', // Align message and close icon
    alignItems: 'center',
    justifyContent: 'space-between', // Space between message and icon
    padding: 15,
  },
  modalMessage: {
    flex: 1, // Allow the message to take up remaining space
    fontSize: 16,
    color: '#000',
  },
  modalCloseIcon: {
    marginLeft: 10, // Space between message and icon
  },
});



// try {
  //     const response = await fetch('https://farm-meet.onrender.com/login/', {
    //       method: 'POST',
    //       headers: {
      //         'Content-Type': 'application/json',
      //         'accept': 'application/json',
      //         'X-CSRF-TOKEN': 'h3eOpzuD463toQaw4JV0JsvkRVEKXmhtBodbeHOa7jcovg1bsucFMyRzIfXaD9rQ', // Ensure this token is valid
      //       },
  //       body: JSON.stringify({
  //         phone_number: phoneNumber,
  //         password: password,
  //       }),
  //     });

  //     const data = await response.json();

  //     if (response.ok) {
  //       // Redirect to the profile setup page
  //       router.push('/auth/success');
  //     } else {
  //       // Show error message from the backend or a generic one
  //       Alert.alert('Error', data.detail || 'Phone number or password is incorrect.');
  //     }
  //   } catch (error) {
  //     Alert.alert('Error', 'Something went wrong. Please try again later.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };



  // const handleSignIn = async () => {
  //   if (!phoneNumber || !password) {
  //     Alert.alert('Error', 'Please enter your phone number and password.');
  //     return;
  //   }

  //   setLoading(true);

  //   try {
  //     const response = await fetch('https://farm-meet.onrender.com/login/', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'accept': 'application/json',
  //         'X-CSRF-TOKEN': 'h3eOpzuD463toQaw4JV0JsvkRVEKXmhtBodbeHOa7jcovg1bsucFMyRzIfXaD9rQ', // Ensure this token is valid
  //       },
  //       body: JSON.stringify({
  //         phone_number: phoneNumber,
  //         password: password,
  //       }),
  //     });

  //     const data = await response.json();

  //     if (response.ok) {
  //       // Redirect to the profile setup page
  //       router.push('/auth/success');
  //     } else {
  //       // Show error message from the backend or a generic one
  //       Alert.alert('Error', data.detail || 'Phone number or password is incorrect.');
  //     }
  //   } catch (error) {
  //     Alert.alert('Error', 'Something went wrong. Please try again later.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };