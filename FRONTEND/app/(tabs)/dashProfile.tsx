import { View, Image, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Octicons from '@expo/vector-icons/Octicons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';

// Define the type for the order object
type Order = {
  id: string;
  imageUrl: string; // URL for the product image
  productName: string;
  productQuantity: string;
  productPrice: string;
  status: string;
  customerName: string;
  location: string;
};

const dashprofilePage: React.FC = () => {
  const [selectedButton, setSelectedButton] = useState<string>('Due'); // State to track selected button

  const orders = [
    {
      id: '1',
      imageUrl: '../assets/onion.jpg',
      productName: 'Green Lettuce',
      productQuantity: '2',
      productPrice: '1000',
      status: 'Pending',
      customerName: 'Paulina Gayoso',
      location: 'Abuja - 602020',
    },
    {
      id: '2',
      imageUrl: '../assets/onion.jpg',
      productName: 'Green Lettuce',
      productQuantity: '2',
      productPrice: '1000',
      status: 'Pending',
      customerName: 'Paulina Gayoso',
      location: 'Abuja - 602020',
    },
    {
      id: '3',
      imageUrl: '../assets/onion.jpg',
      productName: 'Green Lettuce',
      productQuantity: '2',
      productPrice: '1000',
      status: 'Pending',
      customerName: 'Paulina Gayoso',
      location: 'Abuja - 602020',
    },
    {
      id: '4',
      imageUrl: '../assets/onion.jpg',
      productName: 'Green Lettuce',
      productQuantity: '2',
      productPrice: '1000',
      status: 'Pending',
      customerName: 'Paulina Gayoso',
      location: 'Abuja - 602020',
    },
    // Add more orders here
  ];

  // Filter orders based on the selected button
  const filteredOrders = orders.filter((order) => order.status === selectedButton);

  return (
    <ScrollView style={styles.scroller}>
      <View style={styles.container}>
        <View style={styles.profileBox}>
            <Image
                source={require('../../assets/logoFM.png')} // Use require for local image
                style={styles.userImage}
            />
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
                    <MaterialCommunityIcons name="home-city-outline" size={23} color="rgba(75, 75, 75, 1)" />
                </View>
                <Text style={styles.optionText}>Farm Details</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option}>
                <View style={styles.iconBox}>
                    <FontAwesome5 name="tractor" size={20} color="rgba(75, 75, 75, 1)" />    
                </View>
                <Text style={styles.optionText}>Farm Operations</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option}>
                <View style={styles.iconBox}>
                    <Octicons name="person" size={24} color="rgba(75, 75, 75, 1)" />                
                </View>
                <Text style={styles.optionText}>Personal Details</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={() => router.push('/wallet/walletView')}>
                <View style={styles.iconBox}>
                    <Ionicons name="wallet-outline" size={24} color="rgba(75, 75, 75, 1)" />
                </View>
                <Text style={styles.optionText}>Your Wallet</Text>
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
    width: '90%',
    backgroundColor:'rgba(4, 45, 31, 0.13)',
    padding: 40,
    marginTop: 20,
    height: 180,
    borderRadius: 10,
    marginBottom:20,
  },
  userImage:{
    width: 60,
    height: 60,
    borderRadius: 10,
    marginBottom:5,
    marginTop:5,
  },
  farmName:{
    fontFamily: 'SchibstedGroteskBold',
    fontSize: 20
  },
  farmAddress:{
    fontFamily: 'SchibstedGrotesk-Medium',
    fontSize: 12
  },

  lowerBox: {
    height:200,
    width: '90%',
    padding: 20,
    justifyContent: 'space-between',
    borderTopColor: 'rgba(161, 161, 161, 1)',
    borderLeftColor: '#fff',
    borderRightColor: '#fff',
    borderBottomColor: '#fff',
    borderWidth: 1
  },

  option: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center'
  },
  optionText: {
    fontFamily: 'SchibstedGrotesk-Medium',
    fontSize: 14,
  },
  iconBox: {
    height: 25,
    width: 25,
    marginRight: 20
  }
});

export default dashprofilePage;