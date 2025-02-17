import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome'; // Icon library
import AntDesign from '@expo/vector-icons/AntDesign'; // Icon library


export default function Register() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [fullName, setFullName] = useState('');
  const [userName, setUserName] = useState(''); //*****to be added when  the data structur is resolved
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');  

  const router = useRouter();

  const handleSignUp = async () => {
    if (!fullName || !phoneNumber || !password || !selectedRole) {
      // Alert.alert('Error', 'Please fill out all fields.');
      setErrorMessage('Please fill out all fields.');
      setErrorModalVisible(true);
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      setErrorModalVisible(true);
      return;
    }
    setIsSubmitting(true);

    const user = {
      full_name: fullName,
      role: selectedRole.toLowerCase(),
      phone_number: phoneNumber,
      password: password,
    };

    try {
      const response = await fetch(
        'https://farm-meet-snj4.onrender.com/users/register-generate-pin/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(user),
        }
      );

      console.log('Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Registration response:', data);

        // Navigate to OTP verification page and pass response data
        router.push({
          pathname: '/auth/otp',
          params: { phoneNumber: user.phone_number, message: data.message },
        });
      } else {
        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        // Alert.alert('Error', errorData.message || 'Registration failed');
        setErrorMessage(errorData.message || 'Registration failed');
        console.error('Error response:', errorData);
        } else {
        const errorText = await response.text();
        // Alert.alert('Error', 'Unexpected response from server');
        setErrorMessage('Unexpected response from server: ' + errorText);
        console.error('Unexpected response:', errorText);
        }
      }
    } catch (error) {
      setErrorMessage('Something went wrong. Please try again later.');
      // Alert.alert('Error', 'Something went wrong. Please try again later.');
      console.error('Error:', error);
    }finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
 
      <View style={styles.formContainer}>
          <View style={styles.choiceFormContainer}>
            {/* Radio Buttons for Role */}
            <View style={styles.choiceContainer}>
              <TouchableOpacity
                style={styles.choiceButtonContainer}
                onPress={() => setSelectedRole('Farmer')}
              >
                <View
                  style={[
                    styles.choiceButton,
                    { backgroundColor: selectedRole === 'Farmer' ? '#DCF3BF' : '#f4f4f4' }, // Dynamic background color
                  ]}
                >
                  {selectedRole === 'Farmer' && <View style={styles.innerCircle} />}
                </View>
                <Text style={styles.radioLabel}>Farmer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.choiceButtonContainer}
                onPress={() => setSelectedRole('Consumer')}
              >
                <View
                  style={[
                    styles.choiceButton,
                    { backgroundColor: selectedRole === 'Consumer' ? '#DCF3BF' : '#f4f4f4' }, // Dynamic background color
                  ]}
                >
                  {selectedRole === 'Consumer' && <View style={styles.innerCircle} />}
                </View>
                <Text style={styles.radioLabel}>Consumer</Text>
              </TouchableOpacity>
            </View>
          </View>



        {/* Input Fields */}
        <Text style={styles.fieldTitle}>Full Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. John Unique"
          placeholderTextColor='#a1a1a1'
          value={fullName}
          onChangeText={setFullName}
        />

        {/* ------removed the field here after review for coinciding values */}
      

        <Text style={styles.fieldTitle}>Phone Number *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. +2349066867674 "
          placeholderTextColor='#a1a1a1'
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />

        <Text style={styles.fieldTitle}>Password</Text>
        {/* <TextInput
          style={styles.input}
          placeholder="Enter Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        /> */}

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


        {/* Terms and Conditions */}
        <TouchableOpacity style={styles.termsContainer} onPress={() => setIsChecked((prev) => !prev)}>
        <View
          style={[
            styles.checkCircle,
            { backgroundColor: isChecked ? '#3e502d' : '#fff' }, // Dynamic background color
          ]}
        >
          <Icon
            name="check"
            size={10}
            color={isChecked ? '#fff' : '#3e502d'} // Dynamic tick color
          />
        </View>
          <Text style={styles.termsText}>
            Agree with Terms & Conditions and Privacy Policy
          </Text>
        </TouchableOpacity>

        {/* Signup Button */}
        <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
          <Text style={styles.signupButtonText}>Sign Up</Text>
        </TouchableOpacity>

        {/* Sign In Redirect */}
        <View style={styles.redirectMessage}>
        <Text style={styles.redirectText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.push('/auth/login')} >
              <Text style={styles.signInText}>
                  Sign In
              </Text>
          </TouchableOpacity>
          </View>        
      </View>

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
    backgroundColor: 'white',
  },
  header: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: 'black',
    fontSize: 32,
    fontWeight: 'bold',
  },
  formContainer: {
    flex: 8,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  signUpText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'black',
  },
  redirectText: {
    fontFamily: "SchibstedGrotesk-Regular",
    fontSize: 14,
    textAlign: 'center',
    paddingRight: 5,
  },
  redirectMessage: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
  termsContainer: {
    marginBottom: 35,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  termsText: {
    fontSize: 14,
    textAlign: 'center',
    color: 'black',
  },
  signupButton: {
    backgroundColor: '#042D1F',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    textAlignVertical: 'center',
    height: 55,
  },
  signupButtonText: {
    fontFamily: "SchibstedGroteskBold",
    color: 'white',
    // textAlignVertical: 'center',
    padding:10,
    fontSize: 18,
  },
  signInText: {
    fontFamily: "SchibstedGrotesk-Regular",
    fontSize: 14,
    textAlign: 'center',
    color: '#529500',
    textDecorationLine: 'underline',
  },




  choiceFormContainer: {
    alignItems: 'flex-start',
  },
  choiceContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  choiceButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 2,
  },
  choiceButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    // marginLeft:30,
  },
  radioLabel: {
    fontFamily: 'SchibstedGrotesk-SemiBold',
    marginRight:35,
    fontSize: 16,
    color: '#000',
  },
  innerCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#529500', // Green fill
  },



  fieldTitle: {
    fontFamily: "SchibstedGroteskBold",
    fontSize: 15,
    color: '#000',
    marginBottom: 10,
  },
  passwordContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 1,
    borderColor: '#F4F4F4',
    borderRadius: 10,
    paddingHorizontal: 15, // Horizontal padding for consistent styling
    height: 50, 
    marginBottom: 15,
  },
  passwordInput: {
    fontFamily: "SchibstedGrotesk-ggweweeessRegular",
    fontSize: 14,
  },
  eyeIcon: {   
    position: 'absolute',
    right: 10,
  },

  //low area
  footer: {
    paddingTop: '80%', // Space between button and other elements
    paddingBottom: 30, // Flexible space to keep it from sticking to the very bottom
  },

  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#3e502d', // Default border color
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  //error modal
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

