// OrderCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';

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
  
  // Define the props for the OrderCard component
  type OrderCardProps = {
    order: Order;
  };

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  return (
    <View style={styles.card}>
        <View style={styles.upperRow}>
            <View>
                <Image
                    source={require('../assets/onion.jpg')} // Use require for local image
                    style={styles.productImage}
                />
            </View>
            <View>
                <Text style= {styles.productName}>
                    Green Lettuce
                </Text>
                <Text style={styles.productQuantity}>
                    2
                </Text>
            </View>
            <Text style={styles.productPrice}>
                1000
            </Text>
            <TouchableOpacity style={styles.icon1}>
                <SimpleLineIcons name="options-vertical" size={14} color="#4B4B4B" />
            </TouchableOpacity>
        </View>
        <View style={styles.lowerRow}>
            <View style={styles.viewButton}>
            <Text style={[styles.buttonText, { color: order.status === 'Pending'? 'red' : 'black' }]}>Pending</Text>
            </View>
            <View style={styles.viewButton}>
            <Text style={styles.buttonText}>Paulina Gayoso</Text>
            </View>
            <View style={styles.viewButton}>
            <Text style={styles.buttonText}>Abuja - 602020</Text>
            </View>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // View Styles
    card: {
        backgroundColor: '#F5F4F4',
        borderRadius: 10,
        padding: 10,
        marginBottom: 15,
        height: 100,
        justifyContent: 'center',
    },
    upperRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    lowerRow: {
        flexDirection: 'row',
    },

      // Image Styles
  productImage: {
    width: 45,
    height: 45,
    borderRadius: 8,
  },

    // Text Styles
    productName: {
        fontSize: 15,
        fontFamily: 'SchibstedGrotesk-SemiBold',
    },
    productQuantity: {
        fontFamily: 'SchibstedGrotesk-SemiBold',
        fontSize: 10,
        color: '#616161',
    },
    productPrice: {
        fontFamily: 'SchibstedGrotesk-SemiBold',
        fontSize: 18,
        marginLeft: 60,
    },

    // Button Styles
    viewButton: {
        backgroundColor: '#fff',
        padding: 2,
        marginRight: 10,
        borderRadius: 20,
        alignItems: 'center',
        marginTop: 5,
        height: 25,
        width: 100,
    },
    buttonText: {
        color: 'black',
        fontFamily: 'SchibstedGrotesk-Medium',
        fontSize: 11,
    },
    icon1 : {
        marginTop: 8,
    }
    //touchableOpacity

});

export default OrderCard;

        {/* <Text style={styles.orderId}>Order ID: {order.id}</Text>
        <Text style={styles.orderDetails}>{order.details}</Text>
        <TouchableOpacity style={styles.viewButton}>
        <Text style={styles.buttonText}>View Details</Text>
      </TouchableOpacity> */}

//   orderId: {
//     fontFamily: 'SchibstedGrotesk-SemiBold',
//     fontSize: 16,
//   },
//   orderDetails: {
//     fontFamily: 'SchibstedGrotesk-Regular',
//     fontSize: 14,
//     marginTop: 5,
//   },