// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Modal,
//   FlatList,
//   Alert,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import * as ImagePicker from 'expo-image-picker';
// import { Picker } from '@react-native-picker/picker';
// import { AntDesign } from '@expo/vector-icons';
// import { router, useLocalSearchParams } from 'expo-router';
// import DropdownMenu, { MenuOption } from '../../components/DropdownMenu'; // Adjust the import path based on your project structure


// export default function PostProduce() {
//   const [produceName, setProduceName] = useState('');
//   const [description, setDescription] = useState('');
//   const [produceCategory, setProduceCategory] = useState<string[]>([]);
//   const [images, setImages] = useState<string[]>([]);
//   const [produceStatus, setProduceStatus] = useState('');
//   const [price, setPrice] = useState('');
//   const [pickupLocation, setPickupLocation] = useState('');
//   const [dropdown1Selection, setDropdown1Selection] = useState<string[]>([]);
//   const [dropdown2Selection, setDropdown2Selection] = useState<string[]>([]);
//   const [statusvisible, setstatusVisible] = useState(false);
//   const [visible, setVisible] = useState(false);

//   const params = useLocalSearchParams(); // Get parameters passed to this screen *****************
//   const isEditing = !!params.produce; // Check if we are in edit mode ******************

  
//   // const [categoryModalVisible, setCategoryModalVisible] = useState(false);
//   // const [selectedItems, setSelectedItems] = useState<string[]>([]);
//   // const [selectedstatusItems, setSelectedstatusItems] = useState<string[]>([]);

//     // Populate fields when editing ****************
//     useEffect(() => {
//         if (isEditing) {
//           const produce = JSON.parse(params.produce as string);
//           setProduceName(produce.name);
//           setDescription(produce.description || '');
//           setProduceCategory(produce.categories || []);
//           setProduceStatus(produce.status);
//           setPrice(produce.price.toString());
//           setPickupLocation(produce.pickup_location);
//           setImages(produce.images || []);
//         }
//       }, [params]);
    

//   const categories = [
//     'Fruits And Vegetables',
//     'Meat And Seafood',
//     'Dairy And Eggs',
//     'Root And Tubers',
//   ];

//   const options = [
//     { value: 'Fruits and Vegetables', label: 'Fruits and Vegetables' },
//     { value: 'Meat and Seafood', label: 'Meat and Seafood' },
//     { value: 'Dairy and Eggs', label: 'Dairy and Eggs' },
//     { value: 'Root and Tubers', label: 'Root and Tubers' },
//   ];

//   const statusoptions = [
//     { value: 'Available', label: 'Available' },
//     { value: 'Out of stock', label: 'Out of stock' },
//   ];

//   const pickImages = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsMultipleSelection: true,
//       quality: 1,
//     });

//     if (!result.canceled) {
//       setImages((prev) => [...prev, ...result.assets.map((asset) => asset.uri)]);
//     }
//   };

//   const toggleCategorySelection = (category: string) => {
//     setProduceCategory((prev) =>
//       prev.includes(category)
//         ? prev.filter((item) => item !== category)
//         : [...prev, category]
//     );
//   };

//   const handleSaveDraft = () => {
//     Alert.alert('Draft Saved', 'Produce saved as a draft.');
//     console.log('Draft Data:', {
//       produceName,
//       description,
//       produceCategory,
//       images,
//       produceStatus,
//       price,
//       pickupLocation,
//     });
//   };

//   const handlePublishProduce = async () => {
//     if (!produceName || !produceCategory.length || !produceStatus || !price || !pickupLocation) {
//       Alert.alert('Error', 'Please fill out all required fields.');
//       return;
//     }
  
//     try {
//       const formData = new FormData();
//       formData.append('name', produceName);
//       formData.append('description', description || '');
//       formData.append('produce_status', produceStatus);
//       formData.append('price', price);
//       formData.append('pickup_location', pickupLocation);
  
//       // Add categories
//       produceCategory.forEach((category) =>
//         formData.append('produce_categories', category)
//       );
  
//       // Convert images to Blob and append to FormData
//       for (const imageUri of images) {
//         const response = await fetch(imageUri);
//         const blob = await response.blob();
//         const fileName = imageUri.split('/').pop() || `image_${Date.now()}.jpg`;
  
//         formData.append('images', blob, fileName);
//       }
  
//       // Make API call
//       const response = await fetch('https://farm-meet.onrender.com/farmer/produce/', {
//         method: 'POST',
//         headers: {
//           'X-CSRFToken': 'h3eOpzuD463toQaw4JV0JsvkRVEKXmhtBodbeHOa7jcovg1bsucFMyRzIfXaD9rQ',
//         },
//         body: formData,
//       });
  
//       const result = await response.json();
  
//       if (response.ok) {
//         Alert.alert('Success', 'Produce published successfully!');
//         console.log('Published Data:', result);
//       } else {
//         Alert.alert('Error', 'Failed to publish produce. Please try again.');
//         console.error('Error:', result);
//       }
//     } catch (error) {
//       console.error('API Error:', error);
//       Alert.alert('Error', 'An error occurred while publishing produce.');
//     }
//   };
  

//    // Function to handle Save Changes for Edit Mode
//    const handleSaveChanges = async () => {
//     if (!produceName || !produceCategory.length || !produceStatus || !price || !pickupLocation) {
//       Alert.alert('Error', 'Please fill out all required fields.');
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append('name', produceName);
//       formData.append('description', description);
//       formData.append('produce_status', produceStatus);
//       formData.append('price', price);
//       formData.append('pickup_location', pickupLocation);

//       produceCategory.forEach((category) =>
//         formData.append('produce_categories', category)
//       );

//       for (const imageUri of images) {
//         const response = await fetch(imageUri);
//         const blob = await response.blob();
//         const fileName = imageUri.split('/').pop() || `image_${Date.now()}.jpg`;
//         formData.append('images', blob, fileName);
//       }

//       const response = await fetch(
//         `https://farm-meet.onrender.com/farmer/produce/${initialData.id}/`,
//         {
//           method: 'PUT', // Use PUT for updates
//           headers: {
//             'X-CSRFToken': 'h3eOpzuD463toQaw4JV0JsvkRVEKXmhtBodbeHOa7jcovg1bsucFMyRzIfXaD9rQ',
//           },
//           body: formData,
//         }
//       );

//       const result = await response.json();

//       if (response.ok) {
//         Alert.alert('Success', 'Produce updated successfully!');
//         console.log('Updated Data:', result);
//       } else {
//         Alert.alert('Error', 'Failed to update produce. Please try again.');
//         console.error('Error:', result);
//       }
//     } catch (error) {
//       console.error('API Error:', error);
//       Alert.alert('Error', 'An error occurred while updating produce.');
//     }
//   };

//   return (
//     <ScrollView style={styles.container}>
//       {/* Produce Name */}
//       <Text style={styles.label}>Produce Name *</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="e.g. Green Lettuce"
//         placeholderTextColor="#a1a1a1"
//         value={produceName}
//         onChangeText={setProduceName}
//         />

//       {/* Description */}
//       <Text style={styles.label}>Description</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Tell us a little bit about green lettuce vegetable"
//         placeholderTextColor="#a1a1a1"
//         value={description}
//         onChangeText={setDescription}
//         multiline
//         />

//       {/* Produce Category */}
//       <Text style={styles.label}>Produce Category</Text>


//       <View>
//         <DropdownMenu
//           visible={visible}
//           handleClose={() => setVisible(false)}
//           handleOpen={() => setVisible(true)}
//           options={options}
//           selectedValues={dropdown1Selection}
//           onSelectionChange={(newSelection) => setDropdown1Selection(newSelection)}
//           trigger={
//             <TouchableOpacity onPress={() => setVisible(true)} style={styles.row}>


//               <Text style={[styles.dropTriggerStyle, { color: dropdown1Selection.length > 0 ? '#000' : '#A1A1A1',},]}>
//                 {dropdown1Selection.length > 0 ? dropdown1Selection.join(',  ') : 'Select Farm category'}
//               </Text>


//               <AntDesign style={[styles.icon1, { transform: [{ scaleX: 1.0 }, { scaleY: 0.8 }] }]} name="down" size={15} color="#696969" />
//             </TouchableOpacity>
//           }
//           multiple={true}
//         />
//       </View>

//       {/* Upload Images */}
//       <Text style={styles.label}>Upload Images of Produce</Text>
//       <TouchableOpacity style={styles.uploadButton} onPress={pickImages}>
//         <AntDesign name="upload" size={18} color="#042D1F" />
//         {/* <Ionicons name="arrow-up-circle-outline" size={24} color="#042D1F" /> */}
//         <Text style={styles.uploadText}>Upload Images</Text>
//       </TouchableOpacity>
//       <View style={styles.imagePreviewContainer}>
//         {images.map((uri, index) => (
//           <View key={index} style={styles.imagePreview}>
//             <Ionicons name="image-outline" size={24} color="#042D1F" />
//           </View>
//         ))}
//       </View>

//       {/* Produce Status */}

//       <Text style={styles.label}>Produce Status</Text>

//       <View>
//         <DropdownMenu
//           // style={styles.dropContainer}
//           visible={statusvisible}
//           handleClose={() => setstatusVisible(false)}
//           handleOpen={() => setstatusVisible(true)}
//           options={statusoptions}
//           selectedValues={dropdown2Selection}
//           onSelectionChange={(newSelection) => setDropdown2Selection(newSelection)}
//           trigger={
//             <TouchableOpacity onPress={() => setstatusVisible(true)} style={styles.row}>


//               <Text style={[styles.dropTriggerStyle, { color: dropdown2Selection.length > 0 ? '#000' : '#A1A1A1',},]}>
//                 {dropdown2Selection.length > 0 ? dropdown2Selection.join(',  ') : 'Select Status'}
//               </Text>


//               <AntDesign style={[styles.icon1, { transform: [{ scaleX: 1.0 }, { scaleY: 0.8 }] }]} name="down" size={15} color="#696969" />
//             </TouchableOpacity>
//           }
//           multiple={false}
//           isSingleSelect={true}
//         />
//       </View>

//       {/* <Picker
//         selectedValue={produceStatus}
//         onValueChange={(itemValue: string) => setProduceStatus(itemValue)}
//         style={styles.picker}
//         >
//         <Picker.Item label="Select Status" value="" />
//         <Picker.Item label="Available" value="Available" />
//         <Picker.Item label="Out Of Stock" value="Out Of Stock" />
//       </Picker> */}

//       {/* Produce Price */}
//       <Text style={styles.label}>Set Produce Price</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="1000.00"
//         placeholderTextColor="#a1a1a1"
//         keyboardType="numeric"
//         value={price}
//         onChangeText={setPrice}
//         />

//       {/* Pickup Location */}
//       <Text style={styles.label}>Pickup Location</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="e.g. FarmMeet Street, Abuja"
//         placeholderTextColor="#a1a1a1"
//         value={pickupLocation}
//         onChangeText={setPickupLocation}
//       />

//       {/* Buttons */}
//       <View style={styles.buttonContainer}>
//         <TouchableOpacity
//           style={[styles.button, styles.draftButton]}
//           onPress={handleSaveDraft}
//         >
//           <Text style={styles.draftButtonText}>Save As A Draft</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.button, styles.publishButton]}
//           onPress={handlePublishProduce}
//         >
//           <Text style={styles.publishButtonText}>Publish Produce</Text>
//         </TouchableOpacity>
//       </View>
//       <TouchableOpacity style={styles.DButton} onPress={()=>router.push('/profile/profileSuccess')}>
//         <Text style={styles.DButtonText}>Dev Check</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//         flex: 1,
//         backgroundColor: 'white',
//         padding: 20,
//       },
//       header: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginBottom: 20,
//       },
//       headerTitle: {
//         fontSize: 20,
//         fontWeight: 'bold',
//         marginLeft: 10,
//         color: '#042D1F',
//       },
//       label: {
//         fontFamily: 'SchibstedGrotesk-SemiBold',
//         fontSize: 15,
//         marginBottom: 10,
//         color: '#000',
//       },
//       input: {
//         fontFamily: 'SchibstedGrotesk-Regular',
//         borderWidth: 1,
//         height:40,   
//         borderColor: '#f4f4f4',
//         borderRadius: 10,
//         paddingLeft: 10,
//         marginBottom: 15,
//         fontSize: 14,
//       },
//       text: {
//         fontFamily: 'SchibstedGrotesk-Regular',
//         fontSize: 14,
//         color: '#a1a1a1',
//       },
//       modalOverlay: {
//         flex: 1,
//         backgroundColor: 'rgba(0,0,0,0.5)',
//         justifyContent: 'center',
//         alignItems: 'center',
//       },
//       modalContent: {
//         backgroundColor: 'white',
//         padding: 20,
//         borderRadius: 10,
//         width: '80%',
//       },
//       modalTitle: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginBottom: 10,
//         textAlign: 'center',
//       },
//       checkboxContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginVertical: 5,
//       },
//       checkboxLabel: {
//         fontSize: 16,
//         marginLeft: 10,
//       },
//       saveButton: {
//         backgroundColor: '#042D1F',
//         paddingVertical: 12,
//         borderRadius: 8,
//         alignItems: 'center',
//         marginTop: 20,
//       },
//       saveButtonText: {
//         color: 'white',
//         fontSize: 16,
//         fontWeight: 'bold',
//       },
//       uploadButton: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'flex-start',
//         borderWidth: 1,
//         borderColor: '#f4f4f4',
//         borderRadius: 10,
//         padding: 15,
//         marginBottom: 10,
//       },
//       uploadText: {
//         fontFamily: 'SchibstedGrotesk-Regular',
//         fontSize: 14,
//         color: '#a1a1a1',
//         marginLeft: 20,
//       },
//       imagePreviewContainer: {
//         flexDirection: 'row',
//         flexWrap: 'wrap',
//       },
//       imagePreview: {
//         width: 60,
//         height: 60,
//         backgroundColor: '#f2f2f2',
//         margin: 5,
//         alignItems: 'center',
//         justifyContent: 'center',
//         borderRadius: 5,
//       },
//       picker: {
//         borderWidth: 1,
//         borderColor: '#ddd',
//         borderRadius: 10,
//         padding: 15,
//         marginBottom: 15,
//       },
//       buttonContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginTop: 20,
//         marginBottom:10,
//       },
//       button: {
//         flex: 1,
//         marginHorizontal: 5,
//         paddingVertical: 15,
//         borderRadius: 10,
//         alignItems: 'center',
//       },
//       draftButton: {
//         backgroundColor: 'white',
//         borderWidth: 1,
//         borderColor: '#696969', // Dark green border
//         borderRadius: 10,
//         paddingVertical: 15,
//         // paddingHorizontal: 50,
//       },
//       draftButtonText: {
//         fontFamily: 'SchibstedGrotesk-Medium',
//         color: '#042D1F', // Dark green text
//         fontSize: 16,
//         textAlign: 'center',
//       },
//       publishButton: {
//         backgroundColor: '#042D1F',
//         borderRadius: 10,
//         paddingVertical: 15,
//         // paddingHorizontal: 50,
//       },
//       publishButtonText: {
//         fontFamily: 'SchibstedGroteskBold',
//         color: 'white',
//         fontSize: 16,
//         fontWeight: 'bold',
//         textAlign: 'center',
//       },
//       // publishButton: {
//       //   backgroundColor: '#042D1F',
//       // },
//       // publishButtonText: {
//       //   color: 'white',
//       //   fontSize: 16,
//       //   fontWeight: 'bold',
//       // },

//       // --------------------------dropdown
//       row: {
//         flexDirection: 'row',
//         alignItems: 'center', // Align items vertically in the center
//         justifyContent: 'space-between', // Ensure space between the text and the icon
//         height: 40,
//         borderColor: '#F4F4F4',
//         borderWidth: 1,
//         marginBottom: 15,
//         paddingLeft: 10,
//         borderRadius: 5,
//       },
//       dropContainer: {
//         height: 40,
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'flex-start',
//         backgroundColor: '#f5f5f5',
//       },
//       dropTriggerStyle: {
//         fontFamily: 'SchibstedGrotesk-Regular',
//         // backgroundColor: '#ccc',
//         // padding: 10,
//         color: '#a1a1a1',
//         borderRadius: 5,
//         width: '85%',
//       },
//       dropTriggerText: { //nothing much here
//         color: '#ff8f',
//         fontSize: 16,
//         fontWeight: 'bold',
//       },
//       menuOptionText: {
//         fontSize: 16,
//         color: '#333',
//         paddingVertical: 5,
//       },
//       icon1: {
//         paddingRight: 10,
//       },


//      //----------Check button
//       DButton: {
//         backgroundColor: '#f4f4f4',
//         borderRadius: 10,
//         padding:15,
//         alignItems: 'center',
//         width: 150,
//         marginBottom:50,
//       },
//       DButtonText: {
//         fontFamily: "SchibstedGrotesk-Bold",
//         color: '#a1a1a1',
//         fontSize: 12,
//       }
// });
