import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";


// SplashScreen.preventAutoHideAsync();

// Example Splash Screens
import SplashScreen1 from "./splash-1";
import LoginPage from "./auth/login";
import RegisterPage from "./auth/register";

// Home Layout (Tab Navigation)
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import DashboardScreen from "./screens/DashboardScreen";
// import OrdersScreen from "./screens/OrdersScreen";
// import ProduceScreen from "./screens/ProduceScreen";
// import ProfileScreen from "./screens/ProfileScreen";

const Tab = createBottomTabNavigator();

const HomeLayout = () => {
//   return (
//     <Tab.Navigator>
//       <Tab.Screen name="Dashboard" component={DashboardScreen} />
//       <Tab.Screen name="Orders" component={OrdersScreen} />
//       <Tab.Screen name="Produce" component={ProduceScreen} />
//       <Tab.Screen name="Profile" component={ProfileScreen} />
//     </Tab.Navigator>
//   );
};

const RootLayout = () => {
    // Load the font
    const router = useRouter();
    const [userInteracted, setUserInteracted] = useState(false);

  // Splash screen timeout to go to login after the last splash screen
                    // useEffect(() => {
                    //     if (!userInteracted) {
                    //     const timer = setTimeout(() => {
                    //         router.push("/auth/login"); // After splash screens, go to login
                    //     }, 300); // Adjust timeout duration here

                    //     return () => clearTimeout(timer); // Cleanup the timer
                    //     }
                    // }, [userInteracted]);

  useEffect(() => {
    if (!userInteracted) {
      const timer = setTimeout(() => {
        router.push('/splash-1'); // Ensure this points to the first splash screen
      }, 0); // No delay, immediate transition to splash
      return () => clearTimeout(timer);
    }
  }, [userInteracted]);

  const handleSignIn = () => {
    setUserInteracted(true); // Set the flag to true to stop the timeout navigation
    router.push("/auth/login"); // Go to login immediately if user clicks "Sign In"
  };

  const handleSignUp = () => {
    setUserInteracted(true); // Set the flag to true to stop the timeout navigation
    router.push("/auth/register"); // Go to register page if user clicks "Sign Up"
  };

  return (
    <Stack>
      {/* Splash Screens */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }}/>
        <Stack.Screen name="index" options={{ headerShown: false }}/>
        <Stack.Screen name="splash-1" options={{ headerShown: false }}/>
        <Stack.Screen name="auth" options={{ headerShown: false }}/>
        <Stack.Screen name="profile" options={{ headerShown: false }}/>
        <Stack.Screen name="wallet" options={{ headerShown: false }}/>
    </Stack>
  );
};

export default RootLayout;

{/* <Stack.Screen
    name="splash-2"
    component={() => (
      <SplashScreen2 onSignIn={handleSignIn} onSignUp={handleSignUp} />
    )}
    options={{ headerShown: false }}
/>
<Stack.Screen name="splash-3" options={{ headerShown: false }}/>
Login and Register Screens
<Stack.Screen
name="auth/login"
options={{ headerShown: false }}
/> */}