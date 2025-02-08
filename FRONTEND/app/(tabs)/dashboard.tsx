import { View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native'
import React from 'react'
import OrderCard from '../../components/orderCard'; // the orderCard component

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

const DashboardPage: React.FC = () => {
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

    const percentage = 4.3; // for dynamic coloring

    return(
        <ScrollView style={styles.scroller}>
            <View style={styles.container}>
                <View style={styles.statistics}>
                    <Text style={styles.header1}>Stats</Text>
                    <TouchableOpacity style={styles.past7drop}>
                        <Text style={{
                            color: 'white',
                        }}>Past 7 days</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.infoBox1}>
                    <View style={styles.infoBox1_1}>
                        <Text style={styles.bigNumberDisp}>13,192</Text>
                        <Text style={styles.infoPrimaryText}>Total orders</Text>
                        <View style={styles.totalInfoDisp}>
                            <Text style={styles.percentageText}>30.5%</Text>
                            <Text style={styles.infoPrimaryText}>Past 7 days</Text>
                        </View>
                    </View>
                    <View style={styles.infoBox1_1}>
                        <Text style={styles.bigNumberDisp}>189</Text>
                        <Text style={styles.infoPrimaryText}>Total products listed</Text>
                        <View style={styles.totalInfoDisp}>
                            <Text style={[styles.percentageText, { color: percentage < 5 ? 'red' : '#427300' }]}>4.3%</Text>
                            <Text style={styles.infoPrimaryText}>Past 7 days</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.infoBox2}>
                    <Text style={styles.bigNumberDisp}>58,700</Text>
                    <Text style={styles.infoPrimaryText}>Total amount earned</Text>
                    <View style={styles.totalInfoDisp}>
                        <Text style={styles.percentageText}>50.5%</Text>
                        <Text style={styles.infoPrimaryText}>Past 7 days</Text>
                    </View>
                </View>
                <View style={styles.orderHeaderBox}>
                    <Text style={styles.header1}>Due orders</Text>
                    <TouchableOpacity>
                        <Text style={{
                            color: '#529500',
                            fontFamily: 'SchibstedGrotesk-Medium',
                            fontSize: 16
                        }}>See all</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.orders}>
                {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
                ))}
                </View>
                
            </View>
        </ScrollView>
    )};

    const styles = StyleSheet.create({
    
        //views-------------------
        scroller :{
            flexGrow: 1,
            backgroundColor: 'white'
        },
        container: {
            flex: 1,
            justifyContent: 'flex-start',
            alignItems: 'center',
        },
        statistics: {
            width: '90%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        past7drop: {
            backgroundColor: '#427300',
            width: '30%',
            height: 30,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 4,
            marginTop: 20,
            marginBottom: 20,
        },
        infoBox1: {
            width: '90%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 15,
        },
    
        infoBox2: {
            backgroundColor: '#F5F4F4',
            borderColor: '#D3D3D3',
            borderWidth: 1,
            borderRadius: 10,
            width: '90%',
            justifyContent: 'center',
            paddingLeft: 20,
            height: 100,
            marginBottom: 15,
        },
        infoBox1_1: {
            backgroundColor: '#F5F4F4',
            borderColor: '#D3D3D3',
            borderWidth: 1,
            borderRadius: 10,
            width: '48%',
            alignContent: 'center',
            paddingLeft: 20,
            height: 100,
        },
        totalInfoDisp:{
            flexDirection: 'row',
            alignItems: 'center',
        },
        orderHeaderBox : {
            width: '90%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 15,
        },
        orders:{
            width:'90%',
        },
    
        //text-------------------------
        header1: {
            fontFamily: 'SchibstedGrotesk-SemiBold',
            fontSize: 19,
        },
        bigNumberDisp : {
            fontFamily: 'SchibstedGrotesk-Medium',
            fontSize: 30,
        },
        infoPrimaryText: {
            fontFamily: 'SchibstedGrotesk-Regular',
            fontSize: 14,
        },
        percentageText: {
            fontFamily: 'SchibstedGrotesk-Regular',
            fontSize: 14,
            color: "#427300",
            marginRight: 10
        }
    });
export default DashboardPage;
