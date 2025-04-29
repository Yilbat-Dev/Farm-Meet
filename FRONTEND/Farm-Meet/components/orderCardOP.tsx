// OrderCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';

// Define the type for the order object
type Order = {
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
  };
  
  // Define the props for the OrderCard component
  type OrderCardProps = {
    order: Order;
  };

const OrderCardOP: React.FC<OrderCardProps> = ({ order }) => {
  return (
    <View style={styles.card}>
        <View style={styles.upperRow}>
            <View>
                <Image
                    // source={require('../assets/cabbage.jpg')} // Use require for local image
                    style={styles.productImage}
                />
            </View>
            <View style= {styles.midHolder}>
                <Text style= {styles.productName}>
                    {order.produce_name}
                </Text>
                <Text style={styles.producttext}>
                   {order.quantity}
                </Text>
            </View>
            <View style={styles.priceHolder}>
                <Text style={styles.productPrice}>
                    {order.price}
                </Text>
            </View>
            <TouchableOpacity style={styles.icon1}>
                <SimpleLineIcons name="options-vertical" size={14} color="#4B4B4B" />
            </TouchableOpacity>
        </View>
        <View style={styles.lowerRow}>
            <View style={styles.viewButton}>
                <Text style={[styles.buttonText, { color: order.delivery_status === 'pending'? 'rgb(228, 125, 7)' : order.delivery_status === 'completed'? '#529500' : 'black' }]}>{order.delivery_status}</Text>
            </View>
            <View style={styles.viewButton}>
                <Text style={styles.buttonText}>{order.customer_name}</Text>
            </View>
            {/* <View style={styles.viewButton}>
            <Text style={styles.buttonText}>{order.created_at}</Text>
            </View> */}
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
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    lowerRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    midHolder: {
        marginLeft: 5,
        width: '40%',
    },
    priceHolder:{
        marginRight: 10,
        width: '35%',
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
    producttext: {
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
        width: '30%',
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

export default OrderCardOP;

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