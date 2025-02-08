import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  FlatList,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For the arrow icon
import { router } from 'expo-router';
import DropdownMenu, { MenuOption } from '../../components/DropdownMenu'; 
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';



export default function FarmOperationsPage() {
  const [farmSize, setFarmSize] = useState<string[]>([]);
  const [maxOrders, setMaxOrders] = useState('');
  const [deliveryDays, setDeliveryDays] = useState<string[]>([]);
  const [farmSizeModalVisible, setFarmSizeModalVisible] = useState(false);
  // const [deliveryDaysModalVisible, setDeliveryDaysModalVisible] = useState(false);
  //-----dropdowns
  const [farmSizeDrop, setFarmSizeDrop] = useState<string[]>([]);
  const [deliveryDaysDrop, setDeliveryDaysDrop] = useState<string[]>([]);
  const [visible, setVisible] = useState(false);
  // const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [statusvisible, setstatusVisible] = useState(false);
  const [firstPageData, setFirstPageData] = useState<any>(null); // To store data from setupProfile1

  
  // const [selectedstatusItems, setSelectedstatusItems] = useState<string[]>([]);
  // const farmSizeOptions = ['Small', 'Medium', 'Large', 'Enterprise'];
  // const deliveryDaysOptions = [
  //   'Monday',
  //   'Tuesday',
  //   'Wednesday',
  //   'Thursday',
  //   'Friday',
  //   'Saturday',
  //   'Sunday',
  // ];

  // Fetch data from AsyncStorage when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const savedData = await AsyncStorage.getItem('firstPageFormData');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setFirstPageData(parsedData);
          console.log('Retrieved first page data:', parsedData);
        }
      } catch (error) {
        console.error('Error retrieving data:', error);
      }
    };

    fetchData();
  }, []);

  const farmoptions = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
    { value: 'enterprise', label: 'Enterprise' },
  ];

  const dayoptions = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' },
  ];

  const toggleSelection = (item: string, setSelected: React.Dispatch<React.SetStateAction<string[]>>, selected: string[]) => {
    setSelected(selected.includes(item) ? selected.filter((i) => i !== item) : [...selected, item]);
  };

  //  Handle saving and submitting the form _______________________________________________________________________
  const handleSaveAndContinue = async () => {
    try {
      // Combine data from setupProfile1 and FarmOperationsPage
      const combinedData = {
        ...firstPageData,
        farmSize: farmSizeDrop.length > 0 ? farmSizeDrop[0] : null,
        maxOrders,
        deliveryDays: deliveryDaysDrop.length > 0 ? deliveryDaysDrop : null,
      };
  
      // Create FormData without extra JSON.stringify()
      const formData = new FormData();
      formData.append('farm_name', combinedData.farmName);
      formData.append('description', combinedData.farmDescription);
      formData.append('farm_category', JSON.stringify(combinedData.farmCatDrop)); // Keep array as JSON
      formData.append('farm_address', combinedData.farmAddress);
      formData.append('email', combinedData.email);
      formData.append('farm_size', combinedData.farmSize);
      formData.append('max_orders', combinedData.maxOrders.toString()); // Convert number to string
      formData.append('delivery_days', JSON.stringify(combinedData.deliveryDays)); // Keep array as JSON
  
      // Handle profile picture
      // if (combinedData.profilePicture) {
      //   const uriParts = combinedData.profilePicture.split('.');
      //   const fileType = uriParts[uriParts.length - 1];
      //   formData.append('farmer_image', {
      //     uri: combinedData.profilePicture,
      //     name: 'profile.' + fileType,
      //     type: 'image/' + fileType,
      //   } as any);
      // }
  
      // Log FormData as a regular object with proper formatting
      const formDataObj: { [key: string]: any } = {};
      formData.forEach((value, key) => {
        // Parse JSON strings back to objects/arrays where needed
        if (key === 'farm_category' || key === 'delivery_days') {
          formDataObj[key] = JSON.parse(value as string);
        } else if (key === 'max_orders') {
          formDataObj[key] = parseInt(value as string, 10);
        } else {
          formDataObj[key] = value;
        }
      });
      console.log('FormData (as JSON):', JSON.stringify(formDataObj, null, 2));
  
      const makeAuthenticatedRequest = async (url: string, method: string, body: FormData) => {
        const token = await AsyncStorage.getItem('authToken');
        console.log('Retrieved Token:', token); // addedd ---------------

        if (!token) {
          throw new Error('Authentication token is missing.');
        }
  
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
          body,
        });
  
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP Error ${response.status}: ${errorText}`);        }
  
        return await response.json();
      };
  
      // Make the API request
      const responseData = await makeAuthenticatedRequest(
        'https://farm-meet-snj4.onrender.com/farmer/farmer-profiles/',
        'POST',
        formData
      );
  
      if (responseData.success) {
        await AsyncStorage.removeItem('firstPageFormData');
        Alert.alert('Success', 'Profile saved successfully!');
        router.push('/profile/farmProduce');
      } else {
        Alert.alert('Error', responseData.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      Alert.alert('Error', 'An error occurred while submitting the form');
    }
  };
  
  
  
  //  const handleSaveAndContinue = async () => {
  //   // if (!farmSize.length || !maxOrders || !deliveryDays.length) {
  //   //   Alert.alert('Error', 'Please fill out all fields.');
  //   //   return;
  //   // }

  //   try {
  //     // Combine data from setupProfile1 and FarmOperationsPage
  //     const combinedData = {
  //       ...firstPageData,
  //       farmSize: farmSizeDrop.length > 0 ? farmSizeDrop[0] : null, // Ensure it's not undefined
  //       maxOrders,
  //       deliveryDays: deliveryDaysDrop.length > 0 ? deliveryDaysDrop : null,
  //       // farmCategory: firstPageData?.dropdown1Selection || null, // Ensure farm category is included
  //     };

  //     // Log the combined data for debugging
  //     console.log('Combined Form Data:', combinedData);

  //     // // Submit the combined data to the API
  //     // const formData = new FormData();      
  //     // formData.append('farm_name', JSON.stringify(combinedData.farmName));
  //     // formData.append('description', JSON.stringify(combinedData.farmDescription));
  //     // formData.append('farm_category', JSON.stringify(combinedData.farmCatDrop));
  //     // formData.append('farm_address', JSON.stringify(combinedData.farmAddress));
  //     // formData.append('email', JSON.stringify(combinedData.email));
  //     // formData.append('farm_size', JSON.stringify(combinedData.farmSize));
  //     // // if (farmSizeDrop.length > 0) {
  //     // //   formData.append('farm_size', JSON.stringify(combinedData.farmSizeDrop)); // Send as JSON array
  //     // // }
  //     // formData.append('max_orders', combinedData.maxOrders);
  //     // formData.append('delivery_days', JSON.stringify(combinedData.deliveryDays));
  //     // // if (deliveryDaysDrop.length > 0) {
  //     // //   formData.append('delivery_days', JSON.stringify(combinedData.deliveryDaysDrop)); // Send as JSON array
  //     // // }

  //     const formData = new FormData();
  //         formData.append('farm_name', combinedData.farmName); // No JSON.stringify!
  //         formData.append('description', combinedData.farmDescription);
  //         formData.append('farm_category', JSON.stringify(combinedData.farmCatDrop)); // Array → JSON
  //         formData.append('farm_address', combinedData.farmAddress);
  //         formData.append('email', combinedData.email);
  //         formData.append('farm_size', combinedData.farmSize);
  //         formData.append('max_orders', combinedData.maxOrders.toString()); // Ensure it's a string
  //         formData.append('delivery_days', JSON.stringify(combinedData.deliveryDays)); // Array → JSON

  //     if (combinedData.profilePicture) {
  //       const uriParts = combinedData.profilePicture.split('.');
  //       const fileType = uriParts[uriParts.length - 1];
  //       formData.append('farmer_image', {
  //         uri: combinedData.profilePicture,
  //         name: `profile.${fileType}`,
  //         type: `image/${fileType}`,
  //       } as any);
  //     }

  //     // Log form data before submission
  //     console.log('Submitting FormData:');
  //     formData.forEach((value, key) => {
  //       console.log(`${key}:`, value);
  //     });

  //         // Log the FormData as a regular object
  //   console.log('FormData (as JSON):');
  //   const formDataObj: { [key: string]: any } = {};
  //   formData.forEach((value, key) => {
  //     formDataObj[key] = value;
  //   });
  //   console.log(JSON.stringify(formDataObj, null, 2));

  //     const makeAuthenticatedRequest = async (url: string, method: string, body: FormData) => {
  //       try {
  //         const token = await AsyncStorage.getItem('authToken'); // Retrieve the stored token
  //         if (!token) {
  //           Alert.alert('Error', 'Authentication token is missing.');
  //           return;
  //         }
      
  //         const response = await fetch(url, {
  //           method,
  //           headers: {
  //             'Content-Type': 'multipart/form-data',
  //             'Authorization': `Bearer ${token}`,
  //           },
  //           body,
  //         });

  //        // Log the entire response
  //         console.log('Raw API Response:', response);

  //         if (!response.ok) {
  //           const errorText = await response.text(); // Handle non-JSON responses
  //           throw new Error(`HTTP Error ${response.status}: ${errorText}`);
  //         }
            


  //         const responseData = await response.json();
  //         console.log('Parsed API Response:', responseData); // Log parsed response
  //         return responseData;
  //       } catch (error) {
  //         console.error('Error making authenticated request:', error);
  //         throw error;
  //       }
  //     };

  //     // Make the API request
  //     const responseData = await makeAuthenticatedRequest(
  //       'https://farm-meet-snj4.onrender.com/farmer/farmer-profiles/',
  //       'POST',
  //       formData
  //     );

  //     if (responseData.success) {
  //       Alert.alert('Success', 'Profile saved successfully!');
  //       console.log('API Response:', responseData);

  //       // Clear the locally saved data after successful submission
  //       await AsyncStorage.removeItem('firstPageFormData');

  //       // Redirect to the next page
  //       router.push('/profile/farmProduce');
  //     } else {
  //       Alert.alert('Error', responseData.message || 'Registration failed');
  //       console.error('Error response:', responseData);
  //     }
  //   } catch (error) {
  //     console.error('Error submitting form:', error);
  //     Alert.alert('Error', 'An error occurred while submitting the form');
  //   }
  // };
  // ____________________________________________________________________________________ end of handle profile
  
  return (
    <View style={styles.container}>

      {/* Farm Size Dropdown */}
      <Text style={styles.label}>Farm Size</Text>

      <View>
        <DropdownMenu
          visible={visible}
          handleClose={() => setVisible(false)}
          handleOpen={() => setVisible(true)}
          options={farmoptions}
          selectedValues={farmSizeDrop}
          onSelectionChange={(newSelection) => setFarmSizeDrop(newSelection)}
          trigger={
            <TouchableOpacity onPress={() => setVisible(true)} style={styles.row}>


              <Text style={[styles.dropTriggerStyle, { color: farmSizeDrop.length > 0 ? '#000' : '#A1A1A1',},]}>
                {farmSizeDrop.length > 0 ? farmSizeDrop.join(',  ') : 'Select Farm category'}
              </Text>


              <AntDesign style={[styles.icon1, { transform: [{ scaleX: 1.0 }, { scaleY: 0.8 }] }]} name="down" size={15} color="#696969" />
            </TouchableOpacity>
          }
          multiple={false}
          isSingleSelect={true}
        />
      </View>

      {/* Maximum Orders */}
       <Text style={styles.label}>Maximum Orders</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Maximum Orders"
        placeholderTextColor="#a1a1a1"
        keyboardType="numeric"
        value={maxOrders}
        onChangeText={setMaxOrders}
      />

      {/* Delivery Days Dropdown */}
      <Text style={styles.label}>Delivery days</Text>

      <View>
        <DropdownMenu
          // style={styles.dropContainer}
          visible={statusvisible}
          handleClose={() => setstatusVisible(false)}
          handleOpen={() => setstatusVisible(true)}
          options={dayoptions}
          selectedValues={deliveryDaysDrop}
          onSelectionChange={(newSelection) => setDeliveryDaysDrop(newSelection)}
          trigger={
            <TouchableOpacity onPress={() => setstatusVisible(true)} style={styles.row}>


              <Text style={[styles.dropTriggerStyle, { color: deliveryDaysDrop.length > 0 ? '#000' : '#A1A1A1',},]}>
                {deliveryDaysDrop.length > 0 ? deliveryDaysDrop.join(',  ') : 'Select Status'}
              </Text>


              <AntDesign style={[styles.icon1, { transform: [{ scaleX: 1.0 }, { scaleY: 0.8 }] }]} name="down" size={15} color="#696969" />
            </TouchableOpacity>
          }
          multiple={true}
        />
      </View>
      {/* <TouchableOpacity style={styles.input} onPress={() => setDeliveryDaysModalVisible(true)}>
        <Text style={styles.text}>
          {deliveryDays.length ? deliveryDays.join(', ') : 'Select Delivery Days'}
        </Text>
      </TouchableOpacity>
      <Modal
        transparent={true}
        animationType="slide"
        visible={deliveryDaysModalVisible}
        onRequestClose={() => setDeliveryDaysModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Delivery Days</Text>
            <FlatList
              data={deliveryDaysOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => toggleSelection(item, setDeliveryDays, deliveryDays)}
                  style={styles.checkboxContainer}
                >
                  <Ionicons
                    name={deliveryDays.includes(item) ? 'checkbox' : 'square-outline'}
                    size={24}
                    color="#042D1F"
                  />
                  <Text style={styles.checkboxLabel}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <Pressable
              style={styles.saveButton}
              onPress={() => setDeliveryDaysModalVisible(false)}
            >
              <Text style={styles.saveButtonText}>Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal> */}

      {/* Save and Continue Button */}
      <View style={styles.footer}> 

      <TouchableOpacity style={styles.saveButton} 
      onPress={handleSaveAndContinue}>
      {/* // onPress={() => router.push('/profile/farmProduce')}> */}
        <Text style={styles.saveButtonText}>Save And Continue</Text>
      </TouchableOpacity>

      
      <TouchableOpacity style={styles.DButton} onPress={()=>router.push('/profile/farmProduce')}>
        <Text style={styles.DButtonText}>Dev Check</Text>
      </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  label: {
    fontFamily: "SchibstedGrotesk-SemiBold",
    fontSize: 15,
    marginBottom: 10,
    color:"#000"
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#042D1F',
    marginLeft: 10,
  },
  input: {
    fontFamily: "SchibstedGrotesk-Regular",
    borderWidth: 1,
    borderColor: '#f4f4f4',
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
    fontSize: 14,
    height:40,
  },
  text: {
    fontSize: 16,
    color: '#555',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  checkboxLabel: {
    fontSize: 16,
    marginLeft: 10,
  },
  saveButton: {
    backgroundColor: '#042D1F',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 80,
  },
  saveButtonText: {
    fontFamily: 'SchibstedGroteskBold',
    color: 'white',
    fontSize: 16,
  },

  // --------------------------dropdown
  row: {
    flexDirection: 'row',
    alignItems: 'center', // Align items vertically in the center
    justifyContent: 'space-between', // Ensure space between the text and the icon
    height: 40,
    borderColor: '#F4F4F4',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 5,
  },
  dropContainer: {
    height: 40,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: '#f5f5f5',
  },
  dropTriggerStyle: {
    fontFamily: 'SchibstedGrotesk-Regular',
    // backgroundColor: '#ccc',
    // padding: 10,
    color: '#a1a1a1',
    borderRadius: 5,
    width: '85%',
  },
  dropTriggerText: { //nothing much here
    color: '#ff8f',
    fontSize: 16,
    fontWeight: 'bold',
  },
  menuOptionText: {
    fontSize: 16,
    color: '#333',
    paddingVertical: 5,
  },
  icon1: {
    paddingRight: 10,
  },

  DButton: {
    backgroundColor: '#f4f4f4',
    borderRadius: 10,
    padding:15,
    alignItems: 'center',
    width: 150,
    marginBottom:50,
  },
  DButtonText: {
    fontFamily: "SchibstedGrotesk-Bold",
    color: '#a1a1a1',
    fontSize: 12,
  },

  footer: {
    paddingTop: '70%', // Space between button and other elements
    paddingBottom: 30, // Avoid sticking to the very bottom
    width: '100%',
  },

});


