import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity,BackHandler, Image } from 'react-native';
import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen'
import { useEffect, useCallback } from 'react';
import { useFonts } from 'expo-font';
import { useFocusEffect } from 'expo-router';

SplashScreen.preventAutoHideAsync();

const GreenScreen: React.FC = () => {
  const router = useRouter();

    const [loaded, error] = useFonts({
      "SchibstedGrotesk-Medium": require("../assets/fonts/SchibstedGrotesk-Medium.otf"), 
      "SchibstedGrotesk-Regular": require("../assets/fonts/SchibstedGrotesk-Regular.otf"),
      "SchibstedGrotesk-MediumItalic": require("../assets/fonts/SchibstedGrotesk-MediumItalic.otf"), 
      "SchibstedGrotesk-BoldItalic": require("../assets/fonts/SchibstedGrotesk-BoldItalic.otf"),   
      "SchibstedGrotesk-SemiBold": require("../assets/fonts/SchibstedGrotesk-SemiBold.otf"), 
      "SchibstedGrotesk-ExtraBold": require("../assets/fonts/SchibstedGrotesk-ExtraBold.otf"),   
      "SchibstedGroteskBold": require("../assets/fonts/SchibstedGroteskBold.otf"),   
      "Montserrat": require("../assets/fonts/Montserrat-Bold.ttf"),  
      "Schibsted_Variable": require("../assets/fonts/SchibstedGrotesk-VariableFont_wght.ttf"),
      "SchibstedItalic_Variable": require("../assets/fonts/SchibstedGrotesk-Italic-VariableFont_wght.ttf"),
    });

      // Prevent back navigation to this screen
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        router.replace('/splash-1'); // Redirect to the initial splash screen
        return true; // Prevent default behavior
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [router])
  );

    useEffect(() => {
      // Hide the splash screen once `loaded` or `error` is true
      if (loaded || error) {
        SplashScreen.hideAsync();
      }
  
      // Navigate to the next screen after 3 seconds or on tap
      const timeout = setTimeout(() => {
        router.push('/splash-1');
      }, 6000); // Adjusted to 3 seconds
  
      // Cleanup the timeout when the component unmounts
      return () => clearTimeout(timeout);
    }, [loaded, error, router]);
  
    // Handle tapping the screen to navigate immediately
    const handleTap = () => {
      router.push('/splash-1');
    };
  
    // Early return if `loaded` is not true and there’s no error
    if (!loaded && !error) {
      return null;
    }

  return (
    <View style={styles.container}>
      <View style={styles.logoHolder}>
        <Image
        source={require('../assets/icon.png')}
        style={styles.logoImage}
      />
      </View>
      <TouchableOpacity onPress={handleTap}>
        <Text style={styles.whiteText}>FarmMeet</Text>
      </TouchableOpacity>
      <Text style={styles.smallWhiteText}>An online farmers market</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#013220',
  },
  whiteText: {
    fontFamily: 'SchibstedGrotesk-ExtraBold',
    fontSize: 35,
    color: '#FFFFFF',
  },
  smallWhiteText:{
    fontFamily: 'SchibstedGrotesk-Regular',
    fontSize: 13,
    color: '#FFFFFF',
  },
  logoHolder : {
    width:'auto',
    height: 'auto',
  },

  //logo -------------
  logoImage: {
    height: 70,
    width: 73,
    marginBottom: 5
  }
});

export default GreenScreen;
