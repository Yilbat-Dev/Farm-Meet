import { Text, View, Image, Modal, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { SmartPreviewCardActionButton } from '../../types/SmartPreviewCardButton';
import SmartPreviewCard from '../../components/SmartPreviewCard';
import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store'; // Import SecureStore

export default function ProducePage() {
  const [modalVisible, setModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [cards, setCards] = useState<ProduceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCards, setFilteredCards] = useState<ProduceItem[]>([]);

  type ProduceItem = {
    id: number;
    name: string;
    description: string;
    produce_categories: string;
    produce_status: string;
    price: string;
    pickup_location: string;
    images: Array<{ url: string; description: string }>;
    farmer_profile: {
      id: number;
      full_name: string;
      farm_name: string;
      farm_address: string;
      farmer_image: string | null;
      phone_number: string;
      email: string | null;
      farm_size: string;
      farm_category: string[];
      delivery_days: string[];
      max_orders: number;
      description: string | null;
    };
  };

  useEffect(() => {
    const fetchProduce = async () => {
      try {
        const token = await SecureStore.getItemAsync('accessToken');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch('https://farm-meet-snj4.onrender.com/farmer/produce/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorResponse = await response.json();
          console.error('API Error:', response.status, errorResponse);
          throw new Error('Network response was not ok');
        }

        const data: ProduceItem[] = await response.json();
        console.log("API Response:", data);

        if (Array.isArray(data)) {
          setCards(data);
          setFilteredCards(data);
        } else {
          setCards([]);
          setFilteredCards([]);
        }
      } catch (error) {
        console.error('Error fetching produce:', error);
        alert('Failed to fetch produce. Please try again later.');
        setCards([]);
        setFilteredCards([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProduce();
  }, []);

  useEffect(() => {
    const filtered = cards.filter(card =>
      card.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCards(filtered);
  }, [searchQuery, cards]);

  const handleConfirmDeletion = () => {
    console.log(`${itemToDelete} deleted`);
    setModalVisible(false);
    setItemToDelete(null);
  };

  const handleCancelDeletion = () => {
    setModalVisible(false);
    setItemToDelete(null);
  };

  const actions = (card: ProduceItem) => [
    {
      label: 'Edit',
      backgroundColor: '#06402B',
      labelColor: 'white',
      onPress: () => router.push({
        pathname: '/profile/farmProduce',
        params: { product: JSON.stringify(card) },
      }),
      accessibilityLabel: 'Edit',
      icon: 'edit',
      iconSet: 'Feather',
    },
    {
      label: 'Delete',
      backgroundColor: '#FF3D00',
      labelColor: 'white',
      onPress: () => {
        setItemToDelete(card.name); // Store the name of the item to delete
        setModalVisible(true);
      },
      accessibilityLabel: 'Delete',
      icon: 'delete',
      iconSet: 'AntDesign',
    },
    {
      label: 'Unpublish',
      backgroundColor: '#FFC107',
      labelColor: 'white',
      onPress: () => console.log('Unpublish action triggered'),
      accessibilityLabel: 'Unpublish',
      icon: 'eye-off',
      iconSet: 'Feather',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.searchbar}>
        <AntDesign style={styles.searchIcon} name="search1" size={24} color="#dcdcdc" />
        <TextInput
          style={styles.textPart}
          placeholder="Search . . ."
          placeholderTextColor="#ccced0"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size={60} color="#529500" />
        </View>
      ) : filteredCards.length === 0 ? (
        <View style={styles.loaderContainer}>
          <Text style={styles.noProduceText}>No produce items found.</Text>
        </View>
      ) : (
        <SafeAreaView style={styles.noScrollSafeAreaContainer}>
          <View style={styles.noScrollInnerContainer}>
            {filteredCards.map((card) => (
              <SmartPreviewCard
                key={card.id}
                actionButtons={actions(card)}
                cardData={card}
              >
                <TouchableOpacity onPress={() => console.log(card.name)} style={styles.swipecard}>
                  <View style={styles.card}>
                    <Image
                      source={{ uri: card.images[0]?.url || 'https://via.placeholder.com/150' }}
                      style={styles.image}
                    />
                    <View style={styles.details}>
                      <Text style={styles.cardText}>{card.name}</Text>
                      <Text style={styles.availability}>{card.produce_status}</Text>
                    </View>
                    <Text style={styles.price}>{card.price}</Text>
                  </View>
                </TouchableOpacity>
              </SmartPreviewCard>
            ))}
          </View>
        </SafeAreaView>
      )}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCancelDeletion}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.message}>Do you want to delete this produce?</Text>
            <Text style={styles.message}>Deleting this produce will permanently remove it from the store.</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleCancelDeletion}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleConfirmDeletion}>
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, // Fill the entire screen
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 8,
      },      
      noScrollInnerContainer: {
        flex: 1,
        backgroundColor: 'white',
        // backgroundColor: 'pink',
        width: '100%', // Ensure it takes full width
        justifyContent: 'flex-start',
        alignItems: 'center',
      },
      noScrollSafeAreaContainer: {
        flex: 1, // Ensures it takes the full screen height
        backgroundColor: "#6e64",
        justifyContent: 'flex-start',
        alignItems: 'center',
      },
      swipecard: {
        // flexGrow:1,
        width: '100%', // Ensures swipeable card doesn't overflow
        alignSelf: 'center',
        // borderBottomColor: 'black',
        marginBottom: 15,
        // borderBottomWidth: 1,
        // backgroundColor:'maroon',
        height:70,
        paddingBottom:10,
      },

      card: {
        //   backgroundColor: 'yellow',
          backgroundColor: 'white',
          padding: 15,
        borderRadius: 0,
        // marginBottom: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        borderBottomColor: '#a1a1a1',
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
      },
      cardText: {
        fontSize: 15,
        fontFamily:'SchibstedGrotesk-SemiBold',
      },
      price: {
        fontSize: 17,
        fontFamily:'SchibstedGroteskBold',
        color: 'black',
    },
    details: {
        flex: 1,
        alignItems: 'flex-start',
        marginLeft: 20,
    },
    // cardText: {
    //     fontSize: 18,
    //     fontWeight: 'bold',
    // },
    availability: {
        fontSize: 14,
        fontFamily:'SchibstedGrotesk-Medium',
        color:'#427300'
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 10,
    },

        searchbar: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '90%',
        height: 50,
        borderWidth: 1,
        borderColor: '#CCCED0',
        borderRadius: 10,
        marginTop: 10,
        marginBottom:20,
    },
    searchIcon: {
        paddingLeft: 20,
    },
    textPart: {
        width: '80%',
        fontSize: 16,
        marginLeft: 10,
    },
    noProduceText : {
      fontFamily : "SchibstedGrotesk-MediumItalic",
      fontSize : 16,
      textAlign: 'center',
      color: '#888',
      marginTop: 20,
    },




    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.2)', // Semi-transparent background
      },
      modalContent: {
        top: '15%', // Center the modal
        flexDirection: 'row', // Align red bar and content side-by-side
        width: '90%',
        height: 200,
        backgroundColor: 'red',
        borderRadius: 5,
        overflow: 'hidden',
        elevation: 5, // For shadow on Android
        shadowColor: '#000', // For shadow on iOS
        shadowOpacity: 0.2,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
      },
      message: {
        fontSize: 10,
        marginBottom: 20,
        textAlign: 'center',
      },
      buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
      },
      button: {
        padding: 10,
        // flex: 1,
        alignItems: 'center',
        marginHorizontal: 5,
        borderRadius: 5,
        backgroundColor: '#042D1F', // Primary color for buttons
      },
      buttonText: {
        color: 'white',
        fontSize: 16,
      },
      loaderContainer: {
        flex: 1, // Takes up remaining space after the search bar
        justifyContent: 'center', // Centers vertically
        alignItems: 'center', // Centers horizontally
      },
});



      // const [cards] = useState([
      //   { id:'1', name: 'Tomatoes', description: 'good', price: 'N1000', available: 'In Stock', image: require('../../assets/onion.jpg'),  pickupLocation: 'FarmMeet Street, Abuja', images: ['image1.jpg', 'image2.jpg'], },
      //   { id:'2', name: 'Carrots', description: 'fair', price: 'N2000', available: 'Out of Stock', image: require('../../assets/onion.jpg'), pickupLocation: 'FarmMeet Street, Abuja', images: ['image1.jpg', 'image2.jpg'], }
      // ]);

      // const [cards] = useState([
      //   {
      //     id: '1',
      //     name: 'Tomatoes',
      //     description: 'Fresh red tomatoes',  // Include description
      //     category: 'Friuts and Vegetables',  // Category field
      //     available: 'In Stock',
      //     price: 'N1000',
      //     image: require('../../assets/onion.jpg'),
      //     pickupLocation: 'FarmMeet Street, Abuja',  
      //     images: ['image1.jpg', 'image2.jpg'], // Multiple images
      //   },
      //   {
      //     id: '2',
      //     name: 'Carrots',
      //     description: 'Organic farm carrots',
      //     category: 'Fruits and Vegetables',
      //     available: 'Out of Stock',
      //     price: 'N2000',
      //     image: require('../../assets/onion.jpg'),
      //     pickupLocation: 'Green Village Market, Lagos',
      //     images: ['carrot1.jpg', 'carrot2.jpg'],
      //   }
      // ]);