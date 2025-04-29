import { View, Image, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Octicons from '@expo/vector-icons/Octicons';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store'; // Import SecureStore
import { Buffer } from 'buffer';



const dashprofilePage: React.FC = () => {
 const handleLogout = async () => {
  try {
    // Retrieve the refresh token from SecureStore
    const refreshToken = await SecureStore.getItemAsync('refreshToken');
    console.log('Refresh Token:', refreshToken); // Debugging

    if (!refreshToken) {
      Alert.alert('Error', 'No refresh token found. Please login again.');
      return;
    }

    // Retrieve the access token from SecureStore (or wherever it's stored)
    const accessToken = await SecureStore.getItemAsync('accessToken');
    console.log('Access Token:', accessToken); // Debugging

    if (!accessToken) {
      Alert.alert('Error', 'No access token found. Please login again.');
      return;
    }

    // Make the logout request
    const response = await fetch('https://farm-meet-snj4.onrender.com/users/logout/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`, // Include the access token in the headers
      },
      body: JSON.stringify({
        refresh: refreshToken, // Send the refresh token in the request body
      }),
    });

    // Handle the response
    if (response.ok) {
         // Clear tokens from SecureStore (optional)
         await SecureStore.deleteItemAsync('refreshToken');
         await SecureStore.deleteItemAsync('accessToken');
   
      Alert.alert('Logout Successful', 'You have been logged out.');
      router.replace('/auth/login'); // Redirect to the login screen
    } else {
      const errorData = await response.json();
      console.error('Logout Failed:', errorData); // Debugging
      Alert.alert('Logout Failed', errorData.detail || 'Invalid refresh token. Please try again.');
    }
  } catch (error) {
    console.error('Logout error:', error); // Debugging
    Alert.alert('Logout Failed', error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.');  }
};

  
  return (
    <ScrollView style={styles.scroller}>
      <View style={styles.container}>
        <View style={styles.profileBox}>
            <View style={styles.userLetter}>
                <Text style={styles.capitalLetter}>
                    F
                </Text>
            </View>
            <Text style={styles.farmName}>
                FreshVegi Farm Shop
            </Text>
            <Text style={styles.farmAddress}>
                Farm Street, 123, Abuja, Lagos, Nigeria           
            </Text>
        </View>
        <View style={styles.lowerBox}>
            <TouchableOpacity style={styles.option}>
                <View style={styles.iconBox}>
                    <Octicons name="person" size={24} color="rgba(45, 49, 48, 1)" />                
                </View>
                <Text style={styles.optionText}>Personal Details</Text>
                <Feather name="chevron-right" size={24} color="rgba(45, 49, 48, 1)" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={() => router.push('/profile/setUpProfile1')}>
                <View style={styles.iconBox}>
                    <MaterialCommunityIcons name="home-city-outline" size={23} color="rgba(45, 49, 48, 1)" />
                </View>
                <Text style={styles.optionText}>Farm Details</Text>
                <Feather name="chevron-right" size={24} color="rgba(45, 49, 48, 1)" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.option}>
                <View style={styles.iconBox}>
                    <FontAwesome5 name="tractor" size={20} color="rgba(45, 49, 48, 1)" />    
                </View>
                <Text style={styles.optionText}>Farm Operations</Text>
                <Feather name="chevron-right" size={24} color="rgba(45, 49, 48, 1)" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={() => router.push('/wallet/walletView')}>
                <View style={styles.iconBox}>
                    <Ionicons name="wallet-outline" size={24} color="rgba(45, 49, 48, 1)" />
                </View>
                <Text style={styles.optionText}>Wallet</Text>
                <Feather name="chevron-right" size={24} color="rgba(45, 49, 48, 1)" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.option}>
                <View style={styles.iconBox}>
                  <MaterialCommunityIcons name="bank-outline" size={24} color="rgba(45, 49, 48, 1)" />
                </View>
                <Text style={styles.optionText}>Bank</Text>
                <Feather name="chevron-right" size={24} color="rgba(45, 49, 48, 1)" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.option}>
                <View style={styles.iconBox}>
                  <SimpleLineIcons name="lock" size={24} color="rgba(45, 49, 48, 1)" />
                </View>
                <Text style={styles.optionText}>Change password</Text>
                <Feather name="chevron-right" size={24} color="rgba(45, 49, 48, 1)" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.option}>
                <View style={styles.iconBox}>
                  <SimpleLineIcons name="question" size={24} color="rgba(45, 49, 48, 1)" />
                </View>
                <Text style={styles.optionText}>Get help</Text>
                <Feather name="chevron-right" size={24} color="rgba(45, 49, 48, 1)" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.option}>
                <View style={styles.iconBox}>
                  <Octicons name="law" size={24} color="rgba(45, 49, 48, 1)" />
                </View>
                <Text style={styles.optionText}>Legal</Text>
                <Feather name="chevron-right" size={24} color="rgba(45, 49, 48, 1)" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={handleLogout}>
                <View style={styles.iconBox}>
                  <SimpleLineIcons name="logout" size={22} color="rgba(255, 61, 0, 1)" />
                </View>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>


     
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // ScrollView container
  scroller: {
    flexGrow: 1,
    backgroundColor: 'white',
  },
  //------------------------------------



  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  profileBox :{
    width: '100%',
    backgroundColor:'rgba(247, 247, 247, 1)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    height: 250,
    marginBottom:5,
  },
  userLetter :{
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom:5,
    backgroundColor: 'rgba(4, 45, 31, 1)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  farmName:{
    fontFamily: 'SchibstedGroteskBold',
    fontSize: 20,
  },
  farmAddress:{
    fontFamily: 'SchibstedGrotesk-Medium',
    fontSize: 15
  },
  capitalLetter:{
    fontFamily: 'SchibstedGrotesk-Bold',
    fontSize: 75,
    color: 'rgb(255, 255, 255)',
    textAlign: 'center'
  },

  lowerBox: {
    height:200,
    width: '95%',
    padding: 20,
    justifyContent: 'space-between',
  },

  option: {
    height: 50,
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRightColor: '#fff',
    borderLeftColor: '#fff',
    borderTopColor: '#fff',
    borderBottomColor: 'rgba(247, 247, 247, 1)',
  },
  optionText: {
    width: '80%',
    fontFamily: 'SchibstedGrotesk-Medium',
    fontSize: 14,
  },
  logoutText: {
    width: '80%',
    fontFamily: 'SchibstedGrotesk-SemiBold',
    fontSize: 14,
    color: 'rgba(255, 61, 0, 1)'
  },
  iconBox: {
    height: 25,
    width: 25,
    marginRight: 20
  }
});

export default dashprofilePage;