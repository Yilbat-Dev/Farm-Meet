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
import { red } from 'react-native-reanimated/lib/typescript/Colors';

export default function resetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [password1Visible, setPassword1Visible] = useState(false);
    const [password2Visible, setPassword2Visible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorModalVisible, setErrorModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    
const handleResetPassword = () => {
  if (password !== confirmPassword) {
    setErrorMessage('Passwords do not match. Please try again.');
    setErrorModalVisible(true);
    return;
  }
  if (password.length < 8) {
    setErrorMessage('Password must be at least 8 characters long.');
    setErrorModalVisible(true);
    return;
  }

  setLoading(true);
  // Simulating password reset and navigation
  setTimeout(() => {
    setLoading(false);
    router.push('/auth/successReset');
  }, 1500); // Simulating an async operation
};   



return (
    <View style={styles.container}>

      {/* new password */}
      <Text style={styles.fieldTitle}>Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
            style={styles.passwordInput} 
            placeholder="8 characters minimum" 
            placeholderTextColor='#a1a1a1'
            secureTextEntry={!password1Visible} // Hide the password
            value={password}
            onChangeText={setPassword}
            />
          <TouchableOpacity
              onPress={() => setPassword1Visible(!password1Visible)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={password1Visible ? 'eye' : 'eye-off'}
                size={24}
                color="#a1a1a1"
              />
          </TouchableOpacity>
      </View>

      {/* confirm password */}
      <Text style={styles.fieldTitle}>Confirm Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
            style={styles.passwordInput} 
            placeholder="8 characters minimum" 
            placeholderTextColor='#a1a1a1'
            secureTextEntry={!password2Visible} // Hide the password
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            />
          <TouchableOpacity
              onPress={() => setPassword2Visible(!password2Visible)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={password2Visible ? 'eye' : 'eye-off'}
                size={24}
                color="#a1a1a1"
              />
          </TouchableOpacity>
      </View>
  

      {/* Reset Button */}
      <View style={styles.footer}>

      <TouchableOpacity 
        style={styles.resetButton} 
        // onPress={handleResetPassword}
        onPress={()=>router.push('/auth/successReset')}
        disabled={loading}
        >
        <Text style={styles.resetButtonText}>
          {loading ? 'Redirecting...' : 'Reset Password'}
        </Text>
      </TouchableOpacity>
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

  resetButton: {
    backgroundColor: '#042D1F',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  resetButtonText: {
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
    flexDirection: 'row', 
    alignItems: 'center',
    borderWidth:1,
    borderColor: '#F4F4F4',
    borderRadius: 10,
    paddingHorizontal: 15, // Horizontal padding for consistent styling
    height: 50, // Match the visual height of the `input`
    marginBottom: 20,
  },
  passwordInput: {
    fontFamily: "SchibstedGrotesk-ggweweeessRegular",
    fontSize: 14,// Add space for the eye icon
  },

  //3rd part
  footer: {
    paddingTop: '100%',
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
