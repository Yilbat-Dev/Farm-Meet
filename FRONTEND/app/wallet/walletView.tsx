import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import NoTransactions from '@/components/noTransaction';
import TransactionCard from '@/components/transactionCard';
import { router } from 'expo-router';

const WalletView: React.FC = () => {

    const transactions = [
        { type: 'withdraw', amount: 'N 5,000', date: 'Oct 10, 2023', status: 'Success' },
        { type: 'deposit', amount: 'N 10,000', date: 'Nov 12, 2023', status: 'Pending' },
        { type: 'deposit', amount: 'N 1,000', date: 'Oct 2, 2023', status: 'Failed' },
        // Add more transactions here
    ];

    return (
        <ScrollView style={styles.scroll}>
             <View style={styles.container}>
                <View style={styles.boxHolder}>
                    <View style={styles.box1}>
                        <Text style={styles.boxHeadText1}>Total Balance</Text>
                        <Text style={styles.boxNumber1}>N 30,000</Text>
                    </View>
                    <View style={styles.box2}>
                        <Text style={styles.boxHeadText2}>Available Balance</Text>
                        <Text style={styles.boxNumber2}>N 25,000</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.button} onPress={()=>router.push('/wallet/withdraw')}>
                    <Text style={styles.buttonText}>Withdraw Money</Text>
                </TouchableOpacity>
                <View style={styles.transactionBox}>
                    <Text style={styles.transactionText}>
                        Transaction History
                    </Text>
                    <TouchableOpacity style={styles.filter}>
                        <Ionicons name="filter" size={22} color="#727272" />
                        <Text style={styles.transactionText}>Filter</Text>
                    </TouchableOpacity>
                </View>
                 {/* Rendering transactions or "No transactions" message */}
                 {transactions.length > 0 ? (
                    transactions.map((transaction, index) => (
                        <TransactionCard
                            key={index}
                            type={transaction.type}
                            amount={transaction.amount}
                            date={transaction.date}
                            status={transaction.status}
                        />
                    ))
                ) : (
                    <NoTransactions />
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({  
    //view containers --------
    scroll:{
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    boxHolder: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    box1 : {
        borderColor: 'rgba(6, 64, 43, 1)',
        borderWidth:1,
        borderRadius: 10,
        height: 125,
        width: '48%',
        justifyContent: 'center',
        paddingLeft: 30,

    },
    box2 : {
        backgroundColor: 'rgba(6, 64, 43, 1)',
        borderRadius: 10,
        height: 125,
        width: '48%',
        justifyContent: 'center',
        paddingLeft: 30,
    },
    transactionBox:{
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50,
        width: '90%',
        borderWidth: 1,
        borderTopColor: 'rgba(161, 161, 161, 1)',
        borderBottomColor: '#fff',
        borderLeftColor: '#fff',
        borderRightColor: '#fff',
        
    },
    filter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '18%',
    },

    //text ------------------------
    boxHeadText1: {
        fontSize: 14,
        color: '#333',
        fontFamily: 'SchibstedGrotesk-Medium'
    },
    boxHeadText2: {
        fontSize: 14,
        color: '#fff',
        fontFamily: 'SchibstedGrotesk-Medium'
    },
    boxNumber1: {
        fontSize: 22,
        color: '#333',
        fontFamily: 'SchibstedGrotesk-SemiBold'
    },
    boxNumber2: {
        fontSize: 22,
        color: '#fff',
        fontFamily: 'SchibstedGrotesk-SemiBold'
    },
    buttonText: {
        fontSize: 17,
        color: 'rgba(45, 49, 48, 1)',
        fontFamily: 'SchibstedGrotesk-Medium'

    },
    transactionText: {
        fontSize: 14,
        color: '#727272',
        fontFamily: 'SchibstedGrotesk-Medium'
    },

    //button
    button:{
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        backgroundColor: 'rgba(238, 238, 238, 1)',
        borderRadius: 10,
        marginBottom: 20
    }
});

export default WalletView;