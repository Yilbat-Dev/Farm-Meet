import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import OrderCardOP from '../../components/orderCardOP'; // the orderCard component
import AntDesign from '@expo/vector-icons/AntDesign';
import * as SecureStore from 'expo-secure-store'; // Import SecureStore

// Define the type for the order object
type Order =  {
  id: number;
  farmer : number;
  customer_name: string;
  produce : number;
  produce_name : string;
  produce_image : string;
  price: string;
  quantity: number;
  total: string;
  delivery_status: string;
  payment_status: string;
  created_at: string;
  delivery_date: string;
}

const OrderPage: React.FC = () => {
  const [selectedButton, setSelectedButton] = useState<string>('Due'); // State to track selected button
  const [orders, setOrders] = useState<Order[]>([]); // State to store fetched orders
  const [loading, setLoading] = useState<boolean>(true); // State to track loading status
  const [error, setError] = useState<string | null>(null); // State to track errors
  const [searchQuery, setSearchQuery] = useState<string>(''); // State to track search query

  useEffect(() => {
    const fetchOrderItems = async () => {
      try {
        const token = await SecureStore.getItemAsync('accessToken');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch('https://farm-meet-snj4.onrender.com/order/orderitems/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorResponse = await response.json();
          console.error('API Error:', response.status, errorResponse);
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log("API Response:", data);

        // Ensure the data is an array before updating the state
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          throw new Error('Received data is not an array');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to fetch orders. Please try again later.');
      } finally {
        setLoading(false);
      }

    };

    fetchOrderItems(); // Call the fetch function
  }, []); // Empty dependency array ensures this runs only once on mount

  // Filter orders based on the selected button
  const filteredOrders = Array.isArray(orders) ? orders.filter((order) => {
    const matchesStatus = order.delivery_status.toLowerCase() === selectedButton.toLowerCase();
    const matchesSearch = order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||  
      order.produce_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  }) : [];

  return (
    <ScrollView style={styles.scroller}>
      <View style={styles.container}>
        <View style={styles.searchbar}>
          <AntDesign style={styles.searchIcon} name="search1" size={24} color="#dcdcdc" />
          <TextInput
            style={styles.textPart}
            placeholder='Search . . .'
            placeholderTextColor='#ccced0'
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)} // Update search query as user types
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
                Due ({orders.filter((order) => order.delivery_status.toLowerCase() === 'due').length})
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
                Pending ({orders.filter((order) => order.delivery_status.toLowerCase() === 'pending').length})
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
                Completed ({orders.filter((order) => order.delivery_status.toLowerCase() === 'completed').length})
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
                Cancelled ({orders.filter((order) => order.delivery_status.toLowerCase() === 'cancelled').length})
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Orders */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size={60} color="#529500" style={{ marginTop: 50 }} />
          </View>
        ) : (
          <View style={styles.orders}>
            {/* Only show "No orders here" below the search bar */}
            {filteredOrders.length === 0 ? (
              <Text style={styles.noOrdersText}>No orders here</Text>
            ) : (
              filteredOrders.map((order) => (
                <OrderCardOP key={order.id} order={order} />
              ))
            )}
          </View>
        )}
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

  //added later
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  noOrdersText: {
    fontFamily : "SchibstedGrotesk-MediumItalic",
    fontSize : 16,
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
});

export default OrderPage;