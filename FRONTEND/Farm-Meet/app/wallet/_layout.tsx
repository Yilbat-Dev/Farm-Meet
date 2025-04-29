import { router, Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';

const walletLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="walletView" 
      options={{ 
        headerTitle:"Wallet", 
          headerShown: true, 
          headerBackVisible: false, 
          headerTitleAlign:"left", 
          headerShadowVisible: false,
          headerTitleStyle: {
            fontSize: 20,
            fontFamily:"SchibstedGroteskBold",
            },  
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/dashProfile")} // Explicitly route to "walletView"
              style={{ marginRight: 15 }}
            >
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          ),
            }}/>
      <Stack.Screen name="withdraw" 
      options={{ 
        headerTitle:"Withdraw", 
          headerShown: true, 
          headerBackVisible: false, 
          headerTitleAlign:"left", 
          headerShadowVisible: false,
          headerTitleStyle: {
            fontSize: 20,
            fontFamily:"SchibstedGroteskBold",
            }, 
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.push("/wallet/walletView")} // Explicitly route to "walletView"
              style={{ marginRight: 15 }}
            >
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          ),
            }}/>
    
    </Stack>
  );
};

export default walletLayout;
