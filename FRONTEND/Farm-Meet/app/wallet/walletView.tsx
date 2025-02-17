import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import NoTransactions from '@/components/noTransaction';
import TransactionCard from '@/components/transactionCard';
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store'; // Import SecureStore
import { ActivityIndicator } from 'react-native-paper';

interface WalletData {
    id: number;
    farmer: string;
    pending_balance: string;
    usable_balance: string;
  }

const WalletView: React.FC = () => {

    // State to store wallet data
    const [walletData, setWalletData] = useState<WalletData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);

    const transactions = [
        { type: 'Withdraw', amount: 'N 5,000', date: 'Oct 10, 2023', status: 'Success' },
        { type: 'Withdraw', amount: 'N 10,000', date: 'Nov 12, 2023', status: 'Pending' },
        { type: 'Withdraw', amount: 'N 1,000', date: 'Oct 2, 2023', status: 'Failed' },
    ];

    
    // Function to fetch wallet data using auth token
    const fetchWalletData = async () => {
        try {
            // Get the token from SecureStore
            const token = await SecureStore.getItemAsync('accessToken');

            if (!token) {
                throw new Error('Authentication token is missing');
            }

            // Set up timeout for the fetch request
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

            try {
                const response = await fetch('https://farm-meet-snj4.onrender.com/wallet/', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    if (response.status === 401) {
                        router.push('/login');
                        throw new Error('Session expired. Please login again.');
                    }
                    throw new Error('Failed to fetch wallet data');
                }

                const data: WalletData = await response.json();
                setWalletData(data);
                setIsLoading(false);
                setRetryCount(0); // Reset retry count on success

            } catch (fetchError: any) {
                if (fetchError.name === 'AbortError') {
                    if (retryCount < 3) {
                        setRetryCount(prev => prev + 1);
                        fetchWalletData();
                    } else {
                        setError('Request timed out. Please check your connection.');
                        setIsLoading(false);
                    }
                } else {
                    throw fetchError;
                }
            }

        } catch (error: any) {
            setError(error.message || 'An error occurred');
            setIsLoading(false);
        }
    };
    // Initialize wallet data when component mounts
    useEffect(() => {
        fetchWalletData();
    }, []);

    // if (isLoading) {
    //     return (
    //         <View style={styles.container}>
    //             <ActivityIndicator size={55} color="#529500" />
    //             <Text>Loading your wallet Balance...</Text>
    //             {retryCount > 0 && (
    //                 <Text>
    //                     Retrying... ({retryCount})
    //                 </Text>
    //             )}
    //         </View>
    //     );
    // }


    return (
        <ScrollView style={styles.scroll}>
             <View style={styles.container}>

                {isLoading ? (
                    <View style={styles.loadBoxHolder}>
                        <ActivityIndicator size={55} color="#529500" style={{marginBottom:20}}/>
                        <Text style={styles.loadText}>Loading your wallet Balance...</Text>
                        {retryCount > 0 && (
                            <Text style={styles.loadText}>
                                Retrying... ({retryCount})
                            </Text>
                        )}
                    </View>
                ) : (
                <View style={styles.boxHolder}>
                    <View style={styles.box1}>
                        <Text style={styles.boxHeadText1}>Total Balance</Text>
                        <Text style={styles.boxNumber1}>N {walletData?.pending_balance || '0'}</Text>
                    </View>
                    <View style={styles.box2}>
                        <Text style={styles.boxHeadText2}>Available Balance</Text>
                        <Text style={styles.boxNumber2}>N {walletData?.usable_balance || '0'}</Text>
                    </View>
                </View>
                )}

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
    loadBoxHolder: {
        width: '90%',
        // flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    loadText: {
        fontFamily : "SchibstedGrotesk-MediumItalic",
        fontSize : 16,
        textAlign: 'center',
        color: '#529500',
        marginTop: 20,
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