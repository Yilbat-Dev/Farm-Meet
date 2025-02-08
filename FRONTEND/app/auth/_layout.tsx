import { Stack } from "expo-router";
// import { useFonts } from "expo-font";

const AuthLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="login" 
        options={{ 
          headerTitle:"Sign In", 
          headerShown: true, 
          headerBackVisible: false, 
          headerTitleAlign:"center", 
          headerShadowVisible: false,
          headerTitleStyle: {
            color: "#042D1F",
            fontFamily:"SchibstedGroteskBold",
            fontSize: 18,
          }, 
            }}/>
      <Stack.Screen name="forgotPassword" 
        options={{ 
          headerTitle:"Forgot Password?", 
          headerShown: true, 
          headerBackVisible: false, 
          headerTitleAlign:"center", 
          headerShadowVisible: false,
          headerTitleStyle: {
            color: "#042D1F",
            fontFamily:"SchibstedGroteskBold",
            fontSize: 18,
            }, 
          }}/>
      <Stack.Screen name="passwordChangeCode" 
          options={{ 
            headerTitle:"Password reset", 
          headerShown: true, 
          headerBackVisible: false, 
          headerTitleAlign:"center", 
          headerShadowVisible: false,
          headerTitleStyle: {
            color: "#042D1F",
            fontFamily:"SchibstedGroteskBold",
            fontSize: 18,
            }, 
          }}/>
      <Stack.Screen name="register" 
          options={{ 
            headerTitle:"Sign Up", 
          headerShown: true, 
          headerBackVisible: false, 
          headerTitleAlign:"center", 
          headerShadowVisible: false,
          headerTitleStyle: {
            color: "#042D1F",
            fontFamily:"SchibstedGroteskBold",
            fontSize: 18,
            }, 
          }} />
      <Stack.Screen name="otp" 
          options={{ 
            headerTitle:"Verify Code", 
          headerShown: true, 
          headerBackVisible: false, 
          headerTitleAlign:"center", 
          headerShadowVisible: false,
          headerTitleStyle: {
            color: "#042D1F",
            fontFamily:"SchibstedGroteskBold",
            fontSize: 18,
            }, 
          }} />
      <Stack.Screen name="resetPassword" 
          options={{ 
          headerTitle:"Reset Password", 
          headerShown: true, 
          headerBackVisible: false, 
          headerTitleAlign:"center", 
          headerShadowVisible: false,
          headerTitleStyle: {
            color: "#042D1F",
            fontFamily:"SchibstedGroteskBold",
            fontSize: 18,
            }, 
          }} />
      <Stack.Screen name="successReset" options={{ headerShown: false, }}/>
      <Stack.Screen name="success" options={{ headerShown: false, }}/>
    </Stack>
  );
};

export default AuthLayout;
