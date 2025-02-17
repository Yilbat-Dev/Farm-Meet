import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const NoTransactions: React.FC = () => {
    return (
        <View style={styles.container}>
            <Ionicons name="wallet-outline" size={50} color="#727272" />
            <Text style={styles.text}>No transactions yet</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    text: {
        fontSize: 16,
        color: '#727272',
        fontFamily: 'SchibstedGrotesk-Medium',
        marginTop: 10,
    },
});

export default NoTransactions;