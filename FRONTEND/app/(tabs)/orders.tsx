import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import OrderCardOP from '../../components/orderCardOP'; // the orderCard component
import AntDesign from '@expo/vector-icons/AntDesign';

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

const OrderPage: React.FC = () => {
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
        <View style={styles.searchbar}>
            <AntDesign style={styles.searchIcon} name="search1" size={24} color="#dcdcdc" />
            <TextInput
                style={styles.textPart}
                placeholder='Search . . .'
                placeholderTextColor='#ccced0'
                />
        </View>
        {/* Scrollable Buttons */}
        <View style={styles.scrollOptions}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.scrollButton,
                selectedButton === 'Due' && styles.selectedButton,
              ]}
              onPress={() => setSelectedButton('Due')}
            >
              <Text
                style={[
                  styles.scrollButtonText,
                  selectedButton === 'Due' && styles.selectedButtonText,
                ]}
              >
                Due (0)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.scrollButton,
                selectedButton === 'Pending' && styles.selectedButton,
              ]}
              onPress={() => setSelectedButton('Pending')}
            >
              <Text
                style={[
                  styles.scrollButtonText,
                  selectedButton === 'Pending' && styles.selectedButtonText,
                ]}
              >
                Pending (0)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.scrollButton,
                selectedButton === 'Completed' && styles.selectedButton,
              ]}
              onPress={() => setSelectedButton('Completed')}
            >
              <Text
                style={[
                  styles.scrollButtonText,
                  selectedButton === 'Completed' && styles.selectedButtonText,
                ]}
              >
                Completed (0)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.scrollButton,
                selectedButton === 'Cancelled' && styles.selectedButton,
              ]}
              onPress={() => setSelectedButton('Cancelled')}
            >
              <Text
                style={[
                  styles.scrollButtonText,
                  selectedButton === 'Cancelled' && styles.selectedButtonText,
                ]}
              >
                Cancelled (0)
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Orders */}
        <View style={styles.orders}>
          {filteredOrders.map((order) => (
            <OrderCardOP key={order.id} order={order} />
          ))}
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
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  scrollOptions: {
    width: '90%',
    marginTop: 20,
    marginBottom: 20,
  },


  //search styles ---------------
  searchbar: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '90%',
        height: 50,
        borderWidth: 1,
        borderColor: '#CCCED0',
        borderRadius: 10,
        marginTop: 10,
        marginBottom:0,
    },
    searchIcon: {
        paddingLeft: 20,
    },
    textPart: {
        width: '80%',
        fontSize: 16,
        marginLeft: 10,
    },

  scrollButton: {
    paddingHorizontal: 16,
    // paddingVertical: 8,
    borderRadius: 5,
    backgroundColor: '#F5F4F4',
    marginRight: 10,
    justifyContent: 'center',
    height: 30
  },
  selectedButton: {
    backgroundColor: '#06402B', // Green background for selected button
  },
  scrollButtonText: {
    fontFamily: 'SchibstedGrotesk-SemiBold',
    fontSize: 14,
    color: '#4B4B4B',
  },
  selectedButtonText: {
    color: 'white', // White text for selected button
  },
  orders: {
    width: '90%',
  },
});

export default OrderPage;