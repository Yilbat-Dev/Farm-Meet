import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, BackHandler, Image, Dimensions } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';

SplashScreen.preventAutoHideAsync();

const GreenScreen: React.FC = () => {
  const router = useRouter();
  const currentPath = usePathname(); // Get the current pathname here

  useEffect(() => {
    // if (loaded || error) {
    //   SplashScreen.hideAsync();
    // }
    const timeout = setTimeout(() => {
      router.push('/splash-1');
    }, 3000);

    return () => clearTimeout(timeout);
  }, [
    // loaded, 
    // error, 
    router]);

  useEffect(() => {
    const backAction = () => {
      if (currentPath === '/') { 
        BackHandler.exitApp();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [currentPath]);

  const handleTap = () => {
    router.replace('/splash-1');
  };

  // if (!loaded && !error) {
  //   return null;
  // }

  const { width, height } = Dimensions.get('window');

  return (
    <View style={styles.container}>
      <View style={styles.logoHolder}>
        <Image source={require('../assets/icon.png')} style={styles.logoImage} />
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
    width: 70,
    height: 73, 
    resizeMode: 'contain',
    marginBottom: 5,
  },
});

export default GreenScreen;
