import { Stack, useLocalSearchParams } from "expo-router";

const ProfileLayout = () => {
  const params = useLocalSearchParams();
  const isEditing = !!params.product; // Check if we're editing


  return (
    <Stack>
      <Stack.Screen name="setUpProfile1" options={{ 
          headerTitle:"Farmer's Details", 
          headerShown: true, 
          headerBackVisible: true, 
          headerTitleAlign:"left", 
          headerShadowVisible: false,
          headerTitleStyle: {
            fontSize: 20,
            fontFamily:"SchibstedGroteskBold",
            // fontWeight: 900,
            }, 
          
            }} />
      <Stack.Screen name="setUpProfile2" options={{ headerShown: false, }} />
      <Stack.Screen name="setUpProfile3" options={{ headerShown: false, }}/>
      <Stack.Screen name="profileSuccess" options={{ headerShown: false, }}/>
      <Stack.Screen name="farmProduce" 
      options={{ 
        headerTitle: isEditing? 'Edit Produce' : 'Produce', 
          headerShown: true, 
          headerBackVisible: true, 
          headerTitleAlign:"left", 
          headerShadowVisible: false,
          headerTitleStyle: {
            fontSize: 20,
            fontFamily:"SchibstedGroteskBold",
            // fontWeight: 900,
            },  }}
          />
      <Stack.Screen name="farmOperations" 
      options={{ 
        headerTitle:"Farm Operations", 
          headerShown: true, 
          headerBackVisible: true, 
          headerTitleAlign:"left", 
          headerShadowVisible: false,
          headerTitleStyle: {
            fontSize: 20,
            fontFamily:"SchibstedGroteskBold",
            // fontWeight: 900,
            },  }}/>
      <Stack.Screen name="editProduce" 
      options={{ 
        headerTitle:"Edit Produce", 
          headerShown: true, 
          headerBackVisible: true, 
          headerTitleAlign:"left", 
          headerShadowVisible: false,
          headerTitleStyle: {
            fontSize: 20,
            fontFamily:"SchibstedGroteskBold",
            // fontWeight: 900,
            },  }}/>
      <Stack.Screen name="farmSuccesss" 
      options={{ 
        headerTitle:"Successful Profile setup", 
          headerShown: false, 
          headerBackVisible: true, 
          // headerTitleAlign:"left", 
          // headerShadowVisible: false,
          // headerTitleStyle: {
          //   fontSize: 20,
          //   fontFamily:"SchibstedGroteskBold",
          //   // fontWeight: 900,
          //   },  
            }}/>
    </Stack>
  );
};

export default ProfileLayout;
