import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import OTPPage from '../app/auth/passwordChangeCode'

const ForgotPasswordScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleResetPassword = () => {
    // Add your reset password logic here
    alert(`Instructions sent to ${phoneNumber}`);
    // navigation.navigate("OTP");
    router.push({
      pathname: '../app/auth/passwordChangeCode',
      // params: { phoneNumber: user.phone_number, message: data.message },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.subText}>
      No worries, we’ll send you reset instructions.
      </Text>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your phone number"
          placeholderTextColor='#a1a1a1'
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
      </View>
      <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.button} 
      // onPress={handleResetPassword}
      onPress={()=>router.push('/auth/passwordChangeCode')}
      >
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>
       <View style={styles.redirectMessage}>
              <Text style={styles.redirectText}>Just Remembered?</Text>
              <TouchableOpacity onPress={() => router.push('/auth/login')} >
                <Text style={styles.signUpText}>
                  Login
                </Text>
              </TouchableOpacity>
              </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    justifyContent: "flex-start",
  },
  subText: {
    fontFamily: "SchibstedGrotesk-Regular",
    fontSize: 14,
    color: "#7D7D7D", // Grey
    textAlign: "center",
    marginBottom: 60,
  },
  inputContainer: {
    marginBottom: 40,
  },
  inputLabel: {
    fontFamily: "SchibstedGroteskBold",
    fontSize: 16,
    color: "#000000",
    marginBottom: 5,
  },
  input: {
    fontFamily: "SchibstedGrotesk-Regular",
    borderWidth: 1,
    borderColor: "#f4f4f4",
    height:50,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
  },
  button: {
    backgroundColor: "#013220", // Dark green
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#FFFFFF", // White
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonContainer: {
    paddingTop: '100%', // Space between button and other elements
    paddingBottom: 30,
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
});

export default ForgotPasswordScreen;
