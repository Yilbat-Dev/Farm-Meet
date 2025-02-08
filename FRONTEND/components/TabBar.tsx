import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';


const colors = {
  primary: '#042D1F', // Define your primary color
  text: '#696969', // Define your default text color
  background: '#fff', // Default background color
  activeBackground: '#042D1F', // Active tab background color
};

const icons: Record<string, (props: { color: string; size: number }) => JSX.Element> = {
    dashboard: (props) => <Feather name="home" {...props} />, 
    orders: (props) => <Entypo name="text-document" {...props} />, 
    produce: (props) => <MaterialIcons name="widgets" {...props} />, 
    dashProfile: (props) => <Ionicons name="person-outline" {...props} />, 
  };

const TabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.tabbar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? (options.tabBarLabel as string)
            : options.title !== undefined
            ? options.title
            : route.name;

        console.log('route name: ', route.name) //display all route names

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabButton}
          >

            <View style={[styles.iconContainer, { backgroundColor: isFocused ? colors.activeBackground : colors.background }]}>  
              {icons[route.name]?.({ color: isFocused ? '#fff' : colors.text, size: isFocused? 23: 19 })}
            </View>
            <Text style={{ 
                color: isFocused ? colors.primary : colors.text, 
                fontSize:13, 
                fontFamily: isFocused? 'SchibstedGrotesk-SemiBold':'SchibstedGrotesk-Medium' }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabbar: {
    flexDirection: 'row',
    // justifyContent:'center',
    // alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    height: 100,
    borderWidth:1,
    borderTopColor: '#B9B9B933',
    borderBottomColor: '#fff',
    borderLeftColor: '#fff',
    borderRightColor: '#fff',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 5,
    // justifyContent: 'center'
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TabBar;
