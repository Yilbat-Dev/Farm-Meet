import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

interface TransactionCardProps {
    type: string; // e.g., 'withdraw', 'deposit'
    amount: string; // e.g., 'N 5,000'
    date: string; // e.g., 'Oct 10, 2023'
    status: string; // e.g., 'Success', 'Pending'
}

const TransactionCard: React.FC<TransactionCardProps> = ({ type, amount, date, status }) => {
    const iconName = type === 'withdraw' ? 'return-down-back' : 'return-up-forward';
    const iconColor = type === 'withdraw' ? '#fff' : '#fff';
    const statusColor = status === 'Success' ? '#4CAF50' : status === 'Pending' ? '#FFBC7C' : '#FF3B30';

    return (
        <View style={styles.card}>
            <View style={styles.iconContainer}>
                {/* <Ionicons name={iconName} size={24} color={iconColor} /> */}
                {/* <MaterialIcons name="keyboard-return" size={24} color="black" /> */}
                <Ionicons name={iconName} size={24} color={iconColor}/>
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.transactionType}>You {type}</Text>
                <Text style={styles.transactionDate}>{date}</Text>
            </View>
            <Text style={styles.amount}>{amount}</Text>
            <View style={styles.statusBox}>
                <Text style={[styles.statusText, { color: statusColor }]}>{status}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        width: '90%',
        height: 65,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        marginVertical: 8,
        backgroundColor: '#EEEEEE',
        borderRadius: 10,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#042D1F',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
        marginLeft: 16,
    },
    transactionType: {
        fontSize: 16,
        color: '#333',
        fontFamily: 'SchibstedGrotesk-Medium',
    },
    transactionDate: {
        fontSize: 11,
        color: '#727272',
        fontFamily: 'SchibstedGrotesk-Medium',
    },
    amount: {
        fontSize: 16,
        color: '#FF5D5E',
        fontFamily: 'SchibstedGrotesk-SemiBold',
        marginRight: 16,
    },
    statusBox: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: '#fff',
    },
    statusText: {
        fontSize: 12,
        color: '#fff',
        fontFamily: 'SchibstedGrotesk-Medium',
    },
});

export default TransactionCard;