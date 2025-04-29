import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import DropdownMenu, { MenuOption } from '../../components/DropdownMenu'; 
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';



const Withdraw: React.FC = () => {
    const [bankName, setbankName] = useState('');
    const [accountNumber, setAccountNumber] =useState('');
    const [amount, setAmount] =useState('');
    const [statusvisible, setstatusVisible] = useState(false);
    const [dropdown2Selection, setDropdown2Selection] = useState<string[]>([]);
    
    
    const bankOptions = [
        { value: 'Bank A', label: 'Bank A' },
        { value: 'Bank B', label: 'Bank B' },
        { value: 'Bank C', label: 'Bank C' },
        { value: 'Bank D', label: 'Bank D' },
      ];
    
    return (
        <View style={styles.fullScreenContainer}>
            <ScrollView style={styles.scroll}>
                <View style={styles.container}>
                    <View style={styles.boxHolder1}>
                            <Text style={styles.boxHeadText1}>Total Balance</Text>
                            <Text style={styles.balanceText}>₦ 30,000</Text>
                    </View>
                    <Text style={styles.amountText}>Amount</Text>
                    <View style={styles.boxHolder2}>
                        {/* <Text>25,000</Text> */}
                        <TextInput
                            style={styles.amountInput}
                            placeholder="25,000"
                            placeholderTextColor='#a1a1a1'
                            keyboardType="phone-pad"
                            value={amount}
                            onChangeText={setAmount}
                        />
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>₦</Text>
                        </TouchableOpacity>

                    </View>
                    <Text style={styles.inputHeader}>Bank Account</Text>
                    <DropdownMenu
                        // style={styles.dropContainer}
                        visible={statusvisible}
                        handleClose={() => setstatusVisible(false)}
                        handleOpen={() => setstatusVisible(true)}
                        options={bankOptions}
                        selectedValues={dropdown2Selection}
                        onSelectionChange={(newSelection) => setDropdown2Selection(newSelection)}
                        trigger={
                            <TouchableOpacity onPress={() => setstatusVisible(true)} style={styles.row}>


                            <Text style={[styles.dropTriggerStyle, { color: dropdown2Selection.length > 0 ? '#000' : '#A1A1A1',},]}>
                                {dropdown2Selection.length > 0 ? dropdown2Selection.join(',  ') : 'e.g. Zenith Bank Limited'}
                            </Text>


                            <AntDesign style={[styles.icon1, { transform: [{ scaleX: 1.0 }, { scaleY: 0.8 }] }]} name="down" size={15} color="#696969" />
                            </TouchableOpacity>
                        }
                        multiple={false}
                        isSingleSelect={true}
                    />
                    <Text style={styles.inputHeader}>Account Number</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. 121212121212"
                        placeholderTextColor='#a1a1a1'
                        keyboardType="phone-pad"
                        value={accountNumber}
                        onChangeText={setAccountNumber}
                    />
                </View>
            </ScrollView>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.withdrawButton} 
                    //   onPress={handleSaveAndContinue}
                        onPress={() => router.push('/wallet/walletView')}>
                        <Text style={styles.withdrawButtonText}>Withdraw Money</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({  
    //view containers --------
    fullScreenContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scroll:{
        flex: 1
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    boxHolder1: {
        backgroundColor: '#042D1F',
        height: 65,
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        padding: 15,
        borderRadius: 10,
    },
    boxHolder2: {
        backgroundColor: '#F0F0F0',
        height: 65,
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        // alignItems: 'center',
        marginBottom: 15,
        // padding: 15,
        borderRadius: 10,
    },
    buttonContainer: {
        paddingHorizontal: 20,
        marginBottom: 15,
    },

    //text ------------------------
    boxHeadText1: {
        fontSize: 13,
        color: '#fff',
        fontFamily: 'SchibstedGrotesk-Medium'
    },
    balanceText: {
        fontSize: 23,
        color: '#fff',
        fontFamily: 'SchibstedGrotesk-SemiBold'
    },
    amountText: {
        fontSize: 13,
        color: '#000',
        fontFamily: 'SchibstedGrotesk-Medium',
        width: '90%',
        marginBottom: 10,
    },
    buttonText: {
        fontSize: 17,
        color: 'rgba(45, 49, 48, 1)',
        fontFamily: 'SchibstedGrotesk-Medium'
    },
    inputHeader:{
        fontSize: 15,
        color: '#000',
        fontFamily: 'SchibstedGrotesk-Medium',
        width: '90%',
        marginBottom: 10,
    },
    withdrawButtonText: {
        fontFamily: 'SchibstedGrotesk-Medium',
        color: 'white',
        fontSize: 16,
    },


    //input fields ---------------------
    input: {
        fontFamily: "SchibstedGrotesk-Regular",
        borderWidth: 1,
        borderColor: '#F4F4F4',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        fontSize: 14,
        width: '90%',
      },
    amountInput: {
        fontFamily: "SchibstedGrotesk-SemiBold",
        padding: 15,
        fontSize: 23,
        width: '80%'
      },


    //dropdown -------------------
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 50,
        borderColor: '#F4F4F4',
        borderWidth: 1,
        marginBottom: 15,
        paddingLeft: 10,
        borderRadius: 5,
      },
      dropTriggerStyle: {
        fontFamily: 'SchibstedGrotesk-Regular',
        color: '#a1a1a1',
        borderRadius: 5,
        width: '85%',
      },
      icon1: {
        paddingRight: 10,
      },

    //button -----------
    button:{
        width: '20%',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        backgroundColor: '#D8D8D8',
        borderRadius: 10,
        marginBottom: 20
    },
    withdrawButton: {
        backgroundColor: '#042D1F',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 80,
        // width: '90%'
      },
});

export default Withdraw;