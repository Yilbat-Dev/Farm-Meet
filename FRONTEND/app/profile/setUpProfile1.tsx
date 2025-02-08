import React, { useState, useEffect, ReactNode} from 'react';
import { MultiSelect } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import * as SecureStore from 'expo-secure-store';
import DropdownMenu, { MenuOption } from '../../components/DropdownMenu'; 
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';


import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Modal,
  FlatList,
  Pressable,
} from 'react-native';
import { Checkbox } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScrollView } from 'react-native';

interface ApiResponse {
  success: boolean;
  message: string;
  data: any; // Adjust this based on the actual response data structure
}

export default function ProfilePage() {
  const [farmName, setFarmName] = useState('');
  const [farmDescription, setFarmDescription] = useState('');
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  // const [produceCategory, setProduceCategory] = useState<string[]>([]);
  
  // const [farmCategory, setFarmCategory] = useState<string[]>([]);
  const [farmAddress, setFarmAddress] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]); //dropdow
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');  
  const [farmCatDrop, setFarmCatDrop] = useState<string[]>([]);
  const [visible, setVisible] = useState(false);
  
  // const [value, setValue] = useState<string | null>(null); // dropdown with defined type : explicitl
  

  const options = [
    { value: 'vegetable', label: 'Vegetables' },
    { value: 'meat_and_seafood', label: 'Meat and Seafood' },
    { value: 'dairy_and_eggs', label: 'Dairy and Eggs' },
    { value: 'root_and_tubers', label: 'Root and Tubers' },
  ];

  // const categories = [
  //   'Fruits And Vegetables',
  //   'Meat And Seafood',
  //   'Dairy And Eggs',
  //   'Root And Tubers',
  // ];

  // const toggleCategorySelection = (category: string) => {
  //   setProduceCategory((prev) =>
  //     prev.includes(category)
  //       ? prev.filter((item) => item !== category)
  //       : [...prev, category]
  //   );
  // };

  useEffect(() => {
    const fetchTokens = async () => {
      const access = await SecureStore.getItemAsync('accessToken');
      const refresh = await SecureStore.getItemAsync('refreshToken');
      if (!access || !refresh) {
        // Alert.alert('Error', 'You must be logged in to access this page.');
        setErrorMessage('You must be logged in to access this page.');
        setErrorModalVisible(true);
        router.push('/login');
      } else {
        setAccessToken(access);
        setRefreshToken(refresh);
      }
    };
    fetchTokens();
  }, []);

  // const toggleCategory = (category: string) => {
  //   setSelectedItems((prev) =>
  //     prev.includes(category)
  //       ? prev.filter((item) => item !== category)
  //       : [...prev, category]
  //   );
  // };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePicture(result.assets[0].uri);
    }
  };

  // const renderLabel = () => {
  //   if (isFocus || (value && value.trim() !== '')) {
  //     return (
  //       <Text style={[styles.label, isFocus && { color: 'blue' }]}>
  //         Dropdown label
  //       </Text>
  //     );
  //   }
  //   return null;
  // };

  const refreshAccessToken = async () => {
    try {
      const response = await fetch('https://farm-meet.onrender.com/token/refresh/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': 'h3eOpzuD463toQaw4JV0JsvkRVEKXmhtBodbeHOa7jcovg1bsucFMyRzIfXaD9rQ',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });
      const data: ApiResponse = await response.json();
      if (data.success) {
        const newAccessToken = data.data.access;
        await SecureStore.setItemAsync('accessToken', newAccessToken);
        setAccessToken(newAccessToken);
        return newAccessToken;
      } else {
        throw new Error('Failed to refresh token');
      }
    } catch (error) {
      console.error('Error refreshing access token:', error);
      // Alert.alert('Error', 'Session expired. Please log in again.');
      setErrorMessage('Session expired. Please log in again.');
      setErrorModalVisible(true);
      router.push('/login');
    }
  };

  // const makeAuthenticatedRequest = async (
  //   url: string,
  //   method: string,
  //   data: any = null
  // ) => {
  //   try {
  //     let token = accessToken;
  //     if (!token) {
  //       token = await refreshAccessToken();
  //     }

  //     const response = await fetch(url, {
  //       method,
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         'Content-Type': 'multipart/form-data',
  //       },
  //       body: data ? data : undefined,
  //     });

  //     const responseData: ApiResponse = await response.json();
  //     return responseData;
  //   } catch (error) {
  //     if (error instanceof Error && error.message === 'Failed to fetch') {
  //       // Retry on token expiry
  //       const newToken = await refreshAccessToken();
  //       if (newToken) {
  //         const retryResponse = await fetch(url, {
  //           method,
  //           headers: {
  //             Authorization: `Bearer ${newToken}`,
  //             'Content-Type': 'multipart/form-data',
  //           },
  //           body: data ? data : undefined,
  //         });

  //         const retryData: ApiResponse = await retryResponse.json();
  //         return retryData;
  //       }
  //     }
  //     throw error;
  //   }
  // };

  const handleSaveProfile = async () => {
    // if (
    //   !farmName ||
    //   !farmDescription ||
    //   // !produceCategory.length ||
    //   !selectedItems.length ||
    //   !farmAddress
    //   // !fullName ||
    //   // !email
    //   // !phoneNumber
    // ) {
    //   // Alert.alert('Error', 'Please fill out all fields.');
    //   setErrorMessage('Please fill out all fields.');
    //   setErrorModalVisible(true);
    //   return;
    // }

    try {
      const formData = new FormData();

      formData.append('farm_name', JSON.stringify(farmName));
      formData.append('description', JSON.stringify(farmDescription));
      // selectedItems.forEach((category) =>
      //     formData.append('farm_category', category)
      //   );
      // formData.append('farm_category', JSON.stringify(selectedItems));
      // formData.append('farm_category', selectedItems.join(', '));
      if (farmCatDrop.length > 0) {
        formData.append('farm_category', JSON.stringify(farmCatDrop)); // Send as JSON array
      }
      formData.append('farm_address', JSON.stringify(farmAddress));
      formData.append('email', JSON.stringify(email));
      // formData.append('farm_size', 'large');
      // formData.append('max_orders', '56');
      // formData.append('delivery_days', 'monday');


      if (profilePicture) {
        const uriParts = profilePicture.split('.');
        const fileType = uriParts[uriParts.length - 1];
        formData.append('farmer_image', {
          uri: profilePicture,
          name: `profile.${fileType}`,
          type: `image/${fileType}`,
        } as any);
      }


       // Prepare the form data for local saving
    const localFormData = {
      farmName,
      farmDescription,
      farmCatDrop,
      farmAddress,
      email,
      profilePicture,
    };

    // Save the form data locally using AsyncStorage
    await AsyncStorage.setItem('firstPageFormData', JSON.stringify(localFormData));

    // Log the saved data for debugging
    console.log('Saved locally:', localFormData);

    // Redirect to the second page
    router.push('/profile/farmOperations');
      
    
    
    
    
      //   // ✅ Log form data before submission ************************* new entry
      //   console.log('Submitting FormData:');
      //   formData.forEach((value, key) => {
      //     console.log(`${key}:`, value);
      //   });

      // const responseData = await makeAuthenticatedRequest(
      //   'https://farm-meet-snj4.onrender.com/farmer/farmer-profiles/',
      //   'POST',
      //   formData
      // );

      // if (responseData.success) {
      //   Alert.alert('Success', 'Profile saved successfully!');
      //   ///////////////////////////////////////
      //   console.log('API Response:', responseData);
      //   router.push('/setUpProfile2');
      // } else {
      //   // Alert.alert('Error', responseData.message);
      //   setErrorMessage(responseData.message || 'Registration failed');
      //   console.error('Error response:', responseData);
      //   setErrorModalVisible(true);
      // }
    } catch (error) {
      setErrorMessage('An error occurred while saving the profile.');
      console.error('Error saving profile:', error);
      // Alert.alert('Error', 'An error occurred while saving the profile.');
    }
  };


  return (
    <ScrollView style={styles.container}>
      {/* <Text style={styles.title}>Farmer's Profile</Text> */}
      <Text style={styles.sectionHeader}>GENERAL INFORMATION</Text>
      <Text style={styles.fieldTitle}>Profile Picture</Text>

      <View style={styles.imagePickerHolder}>
      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        {profilePicture ? (
          <Image source={{ uri: profilePicture }} style={styles.profileImage} />
        ) : (
          <Ionicons name="person-circle-outline" size={80} color="#DFE1E6" />
        )}
      </TouchableOpacity>
        <MaterialIcons style= {{
          position: 'absolute',
          top: 15,
          right: 260,
          backgroundColor: '#427300',
          borderRadius: 50,
          padding: 5,
        }} name="add-a-photo" size={15} color="#fff" />
      </View>

      {/* <AntDesign name="camerao" size={24} color="#042D1F" /> */}
      {/* <Ionicons name="camera-outline" size={24} color="black" /> */}

      {/* Inputs */}
      <Text style={styles.fieldTitle}>Farm Name *</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Farm Name"
        placeholderTextColor="#a1a1a1"
        value={farmName}
        onChangeText={setFarmName}
      />
      <Text style={styles.fieldTitle}>Description</Text>
      <TextInput
        style={styles.farmDescInput}
        placeholder="Tell us about your farm"
        placeholderTextColor="#a1a1a1"
        value={farmDescription}
        onChangeText={setFarmDescription}
        multiline
      />
      <Text style={styles.fieldTitle}>Farm Category</Text>
      
      <View>
        <DropdownMenu
          visible={visible}
          handleClose={() => setVisible(false)}
          handleOpen={() => setVisible(true)}
          options={options}
          selectedValues={farmCatDrop}
          onSelectionChange={(newSelection) => setFarmCatDrop(newSelection)}
          trigger={
            <TouchableOpacity onPress={() => setVisible(true)} style={styles.row}>


              <Text style={[styles.dropTriggerStyle, { color: farmCatDrop.length > 0 ? '#000' : '#A1A1A1',},]}>
                {farmCatDrop.length > 0 ? farmCatDrop.join(',  ') : 'Select Farm category'}
              </Text>


              <AntDesign style={[styles.icon1, { transform: [{ scaleX: 1.0 }, { scaleY: 0.8 }] }]} name="down" size={15} color="#696969" />
            </TouchableOpacity>
          }
          multiple={true}
        />
      </View>

      <Text style={styles.fieldTitle}>Farm Address</Text>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        {/* Modal Content */}
      </Modal>
      <TextInput
        style={styles.input}
        placeholder="Enter Farm Address"
        placeholderTextColor="#a1a1a1"
        value={farmAddress}
        onChangeText={setFarmAddress}
      />
      <Text style={styles.sectionHeader}>CONTACT INFORMATION</Text>
      {/* <Text style={styles.fieldTitle}>Full Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Full Name"
        placeholderTextColor="#a1a1a1"
        value={fullName}
        onChangeText={setFullName}
      /> */}
      <Text style={styles.fieldTitle}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Email Address"
        placeholderTextColor="#a1a1a1"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      {/* <Text style={styles.fieldTitle}>Phone Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Phone Number"
        placeholderTextColor="#a1a1a1"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      /> */}

      <View style={styles.footer}>
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
        <Text style={styles.saveButtonText}>Save And Continue</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.DButton} onPress={()=>router.push('/profile/farmOperations')}>
        <Text style={styles.DButtonText}>Dev Check</Text>
      </TouchableOpacity>
      </View>

      {/* Error Modal */}
        <Modal
        visible={errorModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setErrorModalVisible(false)}
      >
        <View style={styles.eModalOverlay}>
          <View style={styles.eModalContent}>
            {/* Red bar on the left */}
            <View style={styles.modalRedBar} />
            {/* Message and close icon */}
            <View style={styles.modalMessageContainer}>
              <Text style={styles.modalMessage}>{errorMessage}</Text>
              <TouchableOpacity
                onPress={() => setErrorModalVisible(false)}
                style={styles.modalCloseIcon}
              >
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

// Styles remain unchanged
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#042D1F',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionHeader: {
    fontFamily: "SchibstedGrotesk-Regular",
    fontSize: 12,
    fontWeight: 'light',
    color: '#A1A1A1',
    marginBottom: 10,
  },
  fieldTitle: {
    fontFamily: "SchibstedGrotesk-SemiBold",
    fontSize: 15,
    // fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  imagePicker: {
    backgroundColor:'#FAFAFA',
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  imagePickerHolder: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    // marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  input: {
    fontFamily: 'SchibstedGrotesk-Regular',
    fontSize: 14,
    height: 40,
    borderColor: '#F4F4F4',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 5,
  },
  farmDescInput: {
    fontFamily: 'SchibstedGrotesk-Regular',
    fontSize:14,
    height: 80,
    textAlignVertical: 'top',    
    borderColor: '#F4F4F4',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    paddingTop: 10,
    borderRadius: 5,
  },
  

  

  //Dropdown trial 2
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
    fontSize: 18,
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



  // Dropdown menu styles
  triggerText: {
    fontSize: 16,
  },
  text: {
    color: '#042D1F',
  },
  saveButton: {
    backgroundColor: '#042D1F',
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 80,
    alignItems: 'center',
  },
  saveButtonText: {
    fontFamily: 'SchibstedGroteskBold',
    color: 'white',
    fontSize: 16,
  },


  //---------------------error modal
  eModalOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  eModalContent: {
    top: '15%',
    flexDirection: 'row',
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 5,
    overflow: 'hidden',
    elevation: 5, // For shadow on Android
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  modalRedBar: {
    width: 8,
    backgroundColor: 'red',
  },
  modalMessageContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
  },
  modalMessage: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  modalCloseIcon: {
    marginLeft: 10
  },

  footer: {
    paddingTop: '10%', // Space between button and other elements
    paddingBottom: 30, // Avoid sticking to the very bottom
    width: '100%',
  },

  //----------Check button
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
  }
});











