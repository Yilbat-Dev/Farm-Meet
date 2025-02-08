import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useGlobalSearchParams, useRouter } from "expo-router";

const OTPPage = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputs = useRef<(TextInput | null)[]>([]);
  const router = useRouter();

  // Get query parameters
  const { message, phoneNumber } = useGlobalSearchParams();

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);
  // Move to the next empty input automatically
    const nextIndex = newOtp.findIndex((digit) => digit === "");
    if (nextIndex !== -1 && inputs.current[nextIndex]) {
      inputs.current[nextIndex].focus();
    }
  };

    const handleBackspace = (value: string, index: number) => {
      if (!value && index > 0) {
        // If the current box is empty, shift focus to the previous box
        const previousInput = inputs.current[index - 1];
        if (previousInput) {
          previousInput.focus();
        }
      } else if (value && index < otp.length) {
        // If the current box has a value and backspace is pressed, clear the value
        const newOtp = [...otp];
        newOtp[index] = ""; // Clear the current input
        setOtp(newOtp);
    
        // Focus on the previous box
        const previousInput = inputs.current[index - 1];
        if (previousInput) {
          previousInput.focus();
        }
      }
    };

  const handleSubmit = async () => {
    const otpCode = otp.join(""); // Combine the digits into a single string

    if (otpCode.length !== 6) {
      Alert.alert("Error", "Please enter the complete 6-digit OTP.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        "https://farm-meet.onrender.com/users/register-pin-validate/",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-CSRFToken": "h3eOpzuD463toQaw4JV0JsvkRVEKXmhtBodbeHOa7jcovg1bsucFMyRzIfXaD9rQ",
          },
          body: JSON.stringify({ pin_code: otpCode }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // If code validation is successful
        // Alert.alert("Success", "code verified successfully.");
        router.push("/auth/register"); // Redirect to login page
      } else {
        // Handle error response
        Alert.alert("Error", data.message || `Invalid OTP. Please try again: ${response.status}`);
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while verifying the OTP");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        {/* <Text style={styles.header}>OTP Verification</Text> */}
        {/* Display the message and phone number */}
        <Text style={styles.subText}>{message}</Text>
        <Text style={styles.subText}>
          We sent a code to {phoneNumber}
        </Text>

        {/* OTP Input Boxes */}
        <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                style={[
                  styles.otpBox,
                  otp[index] ? styles.otpBoxFilled : styles.otpBoxEmpty, // Apply dynamic styling
                  { paddingLeft: digit === "" ? 0 : 10 }, // Move the cursor to the left if input is empty
                ]}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={({ nativeEvent }) =>
                  nativeEvent.key === "Backspace" && handleBackspace(digit, index)
                }
                ref={(ref) => (inputs.current[index] = ref)}
                placeholder={digit === "" ? "-" : ""} // Show dash when input is empty
                placeholderTextColor="#7D7D7D" // Optional: gray color for the dash placeholder
                textAlign="center" // Ensure the text (dash) is centered
                pointerEvents="none" // Disable pointer events to hide the cursor
              />
            ))}
        </View>

        {/* Submit Button */}
        <View style={styles.footer}> 
        <TouchableOpacity
          style={styles.continueButton}
          // onPress={handleSubmit}
          onPress={()=>router.push('/auth/resetPassword')}
          disabled={isSubmitting}
        >
          <Text style={styles.continueButtonText}>
            {isSubmitting ? "Verifying..." : "Continue"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.resendButton}>
          <Text style={styles.resendButtonText}>Resend Code</Text>
        </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#013220", // Dark green
    marginBottom: 16,
  },
  subText: {
    fontFamily: "SchibstedGrotesk-Medium",
    fontSize: 14,
    color: "#7D7D7D", // Gray
    textAlign: "center",
    marginBottom: 16,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 40,
  },
  otpBox: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: "#013220", // Dark green
    borderRadius: 10,
    textAlign: "center",
    fontSize: 20,
    marginHorizontal: 5,
  },
  continueButton: {
    backgroundColor: "#013220", // Dark green
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  continueButtonText: {
    color: "#FFFFFF", // White
    fontSize: 16,
    fontFamily: "SchibstedGroteskBold",
  },
  resendButton: {
    borderWidth: 1,
    borderColor: "#696969", // Dark green
    paddingVertical: 15,
    height: 55,
    borderRadius: 10,
    alignItems: "center",
  },
  resendButtonText: {
    fontFamily: "SchibstedGrotesk-Medium",
    color: "#696969", // Dark green
    fontSize: 16,
  },
  otpBoxFilled: {
    borderColor: "#013220",
  },
  footer: {
    paddingTop: '100%',
    paddingBottom: 30,
    width: '100%',
  },
  otpBoxEmpty: {
    borderColor: "#D3D3D3",
  },
});

export default OTPPage;
