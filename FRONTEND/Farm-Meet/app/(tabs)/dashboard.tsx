import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import OrderCardOP from '../../components/orderCardOP';
import { router } from 'expo-router';
import TimeFilterDropdown from '@/components/timeFilter';

// Define types
type Profile = {
  farm_name: string;
  farm_category: string[];
  delivery_days: string[];
};

type Order = {
  id: number;
  farmer: number;
  customer_name: string;
  produce: number;
  produce_name: string;
  produce_image: string;
  price: string;
  quantity: number;
  total: string;
  delivery_status: string;
  payment_status: string;
  created_at: string;
  delivery_date: string;
};

type Stats = {
  total_orders: number;
  total_products: number;
  total_amount: number;
  orders_percentage: number;
  products_percentage: number;
  amount_percentage: number;
};

type DashboardData = {
  stats: Stats;
  orders: Order[];
};

// Profile Prompt Component
const ProfilePrompt = () => (
  <View style={{ padding: 20, alignItems: 'center' }}>
    <Text style={{ fontSize: 18, textAlign: 'center', marginBottom: 20 }}>
      Please complete your profile to view the dashboard content.
    </Text>
    <TouchableOpacity
      onPress={() => router.push('/profile/setUpProfile1')}
      style={{ backgroundColor: '#529500', padding: 10, borderRadius: 5 }}
    >
      <Text style={{ color: 'white', fontSize: 16 }}>Complete Profile</Text>
    </TouchableOpacity>
  </View>
);

// DashboardPage Component
const DashboardPage: React.FC = () => {
  // State for profile completion
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // State for orders and dashboard data
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    stats: {
      total_orders: 0,
      total_products: 0,
      total_amount: 0,
      orders_percentage: 0,
      products_percentage: 0,
      amount_percentage: 0,
    },
    orders: [],
  });
  
  const [selectedFilter, setSelectedFilter] = useState('past_7_days');

  //the function below is used to get the figures
  const getApiUrl = (
    filter: 'past_7_days' | 'past_30_days',
    metric: 'total_orders' | 'total_products' | 'total_amount'  | 'orders_percentage' | 'products_percentage' | 'amount_percentage'
  ) => {    const baseUrl = 'https://farm-meet-snj4.onrender.com/dashboard';
    const endpoints = {
      total_orders: {
        past_7_days: `${baseUrl}/orders/7days/`,
        past_30_days: `${baseUrl}/orders/30days/`,
        // Add more intervals as needed
      },
      total_products: {
        past_7_days: `${baseUrl}/products/7days/`,
        past_30_days: `${baseUrl}/products/30days/`,
      },
      total_amount: {
        past_7_days: `${baseUrl}/amount/7days/`,
        past_30_days: `${baseUrl}/amount/30days/`,
      },
      orders_percentage: {
        past_7_days: `${baseUrl}/orders-percentage/7days/`,
        past_30_days: `${baseUrl}/orders-percentage/30days/`,
      },
      products_percentage: {
        past_7_days: `${baseUrl}/products-percentage/7days/`,
        past_30_days: `${baseUrl}/products-percentage/30days/`,
      },
      amount_percentage: {
        past_7_days: `${baseUrl}/amount-percentage/7days/`,
        past_30_days: `${baseUrl}/amount-percentage/30days/`,
      },
    };
    return endpoints[metric][filter];
  };

  // Fetch profile data
  const checkProfile = async () => {
    try {
        const token = await SecureStore.getItemAsync('accessToken');
        if (!token) {
          throw new Error('No authentication token found');
        }
    
        const response = await fetch(`https://farm-meet.onrender.com/farmer/farmer-profiles/my-profile/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
    
        // Log the raw response for debugging
        const rawResponse = await response.json();
        console.log('Raw API Response:', rawResponse);
    
        // Check if the profile exists based on the response message
        if (rawResponse.message && rawResponse.message.includes("Farmer profile does not exist. Please create one.")) {
          setIsProfileComplete(false);
        } else {
          const isComplete = rawResponse.farm_category && rawResponse.delivery_days && rawResponse.farm_category.length > 0 && rawResponse.delivery_days.length > 0;
          setIsProfileComplete(isComplete);
        }
      } catch (error) {
        console.error('Error checking profile:', error);
        setIsProfileComplete(false);
      } finally {
        setLoadingProfile(false);
      }
    };

  // Fetch dashboard data
  const fetchDashboardData = async (filter: string) => {
    try {
      const token = await SecureStore.getItemAsync('accessToken');
      const response = await fetch(`https://farm-meet-snj4.onrender.com/dashboard/?time_filter=${filter}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const text = await response.text();
      console.log('Raw API Response:', text);

      const data = JSON.parse(text);
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Fetch order items
  const fetchOrderItems = async () => {
    try {
      const token = await SecureStore.getItemAsync('accessToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('https://farm-meet-snj4.onrender.com/order/orderitems/', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error('API Error:', response.status, errorResponse);
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('API Response:', data);
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to fetch orders. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    checkProfile();
    fetchDashboardData(selectedFilter);
    fetchOrderItems();
  }, [selectedFilter]);

 // Filter orders, ensuring orders is an array
    const filteredOrders = Array.isArray(orders) ? orders.filter((order) => order.delivery_status.toLowerCase() === 'due') : [];

  // Render loading state
  if (loadingProfile) {
    return <ActivityIndicator size={60} color="#529500" style={{ marginTop: 50 }} />;
  }

  // Render profile prompt if profile is incomplete
  if (!isProfileComplete) {
    return <ProfilePrompt />;
  }

  // Main render
  return (
    <ScrollView style={styles.scroller}>
      <View style={styles.container}>
        <View style={styles.statistics}>
          <Text style={styles.header1}>Stats</Text>
          <TimeFilterDropdown onFilterChange={setSelectedFilter} />
        </View>

        <View style={styles.infoBox1}>
          <View style={styles.infoBox1_1}>
            <Text style={styles.bigNumberDisp}>{dashboardData.stats.total_orders.toLocaleString()}</Text>
            <Text style={styles.infoPrimaryText}>Total orders</Text>
            <View style={styles.totalInfoDisp}>
              <Text style={styles.percentageText}>{dashboardData.stats.orders_percentage}%</Text>
              <Text style={styles.infoPrimaryText}>Past {selectedFilter.replace(/_/g, ' ')}</Text>
            </View>
          </View>

          <View style={styles.infoBox1_1}>
            <Text style={styles.bigNumberDisp}>{dashboardData.stats.total_products.toLocaleString()}</Text>
            <Text style={styles.infoPrimaryText}>Total products listed</Text>
            <View style={styles.totalInfoDisp}>
              <Text
                style={[
                  styles.percentageText,
                  { color: dashboardData.stats.products_percentage < 5 ? 'red' : '#427300' },
                ]}
              >
                {dashboardData.stats.products_percentage}%
              </Text>
              <Text style={styles.infoPrimaryText}>Past {selectedFilter.replace(/_/g, ' ')}</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoBox2}>
          <Text style={styles.bigNumberDisp}>{dashboardData.stats.total_amount.toLocaleString()}</Text>
          <Text style={styles.infoPrimaryText}>Total amount earned</Text>
          <View style={styles.totalInfoDisp}>
            <Text style={styles.percentageText}>{dashboardData.stats.amount_percentage}%</Text>
            <Text style={styles.infoPrimaryText}>Past {selectedFilter.replace(/_/g, ' ')}</Text>
          </View>
        </View>






















        <View style={styles.orderHeaderBox}>
          <Text style={styles.header1}>Due orders</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/orders')}>
            <Text style={{ color: '#529500', fontFamily: 'SchibstedGrotesk-Medium', fontSize: 16 }}>
              See all
            </Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size={60} color="#529500" style={{ marginTop: 50 }} />
          </View>
        ) : (
          <View style={styles.orders}>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => <OrderCardOP key={order.id} order={order} />)
            ) : (
              <Text style={styles.noOrdersText}>No Due Orders</Text>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
};


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
            marginBottom: 20,
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
        },

        //added later
        noOrdersText: {
            fontFamily : "SchibstedGrotesk-MediumItalic",
            fontSize : 16,
            textAlign: 'center',
            color: '#888',
            marginTop: 20,
          },
          loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          },
    });
export default DashboardPage;
