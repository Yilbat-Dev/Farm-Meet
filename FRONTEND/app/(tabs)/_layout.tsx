import FontAwesome from '@expo/vector-icons/FontAwesome';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import TabBar from '../../components/TabBar';
import { View, Text, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


export default function TabLayout() {
  return (
    <KeyboardAvoidingView
    style={{ flex: 1 }}
    // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
    <Tabs 
    tabBar={props => <TabBar {...props}/>}    
    screenOptions={{ 
        tabBarActiveTintColor: 'blue',
         }}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          headerShown: true,
          headerTitleAlign:"left", 
          headerShadowVisible: false,
          headerTitleStyle: {
            fontSize: 20,
            fontFamily:"SchibstedGroteskBold",
            },
          headerRight: () => (
            <TouchableOpacity style={{
              backgroundColor: '#White',
              borderWidth: 1,
              borderColor: "#d3d3d3",
              width: 40,
              height: 40,
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 20, // Adjust spacing
            }}
            onPress={() => console.log('Notification icon pressed')}>
              <Ionicons name="notifications-outline" size={24} color="#7D7A7A" />
            </TouchableOpacity>
          ), 
        }}
        />
      <Tabs.Screen
        name="orders"
        options={{
            title: 'Orders',
            headerShown: true,
            headerTitleAlign:"left", 
            headerShadowVisible: false,
            headerTitleStyle: {
                fontSize: 20,
                fontFamily:"SchibstedGroteskBold",
            }, 
            headerRight: () => (
              <TouchableOpacity onPress={() => console.log('filter icon pressed')}
                  style={{
                    backgroundColor: 'white',
                    width: 70,
                    height: 40,
                    borderRadius: 20,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 20, // Adjust spacing
                    }}>

                <Ionicons name="filter" size={22} color="#727272" />
                <Text style={{ fontFamily: 'SchibstedGrotesk-Medium', fontSize:14, marginLeft:10, color:'#727272'}}>Filter</Text>
              </TouchableOpacity>
            ),
        }}
        />
      <Tabs.Screen
        name="produce"
        options={{
            title: 'Produce',
            headerShown: true,
            headerTitleAlign:"left",
            headerShadowVisible: false,
            headerTitleStyle: {
              paddingLeft:'1%',  
              fontSize: 20,
              fontFamily:"SchibstedGroteskBold",
            }, 
            headerRight: () => (
                <TouchableOpacity style={{
                  backgroundColor: '#042D1F',
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 20, // Adjust spacing
                }}
                onPress={() => console.log('Plus icon pressed')}>
                  <Feather name="plus" size={24} color="white" />
                </TouchableOpacity>
              ),
        }}
        />
      <Tabs.Screen
        name="dashProfile"
        options={{
            title: 'Profile',
            headerShown: true,
            headerTitleAlign:"left", 
            headerShadowVisible: false,
            headerTitleStyle: {
            fontSize: 20,
            fontFamily:"SchibstedGroteskBold",
            }, 
        }}
      />
    </Tabs>
    </KeyboardAvoidingView>
  );
}