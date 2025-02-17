import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // For icons
import AntDesign from '@expo/vector-icons/AntDesign';

// components/timeFilter.tsx
interface TimeFilterDropdownProps {
    onFilterChange: (filterValue: string) => void;
  }

const TimeFilterDropdown: React.FC<TimeFilterDropdownProps> = ({ onFilterChange }) => {
    const TIME_FILTERS = [
      { label: '7 days', value: 'past_7_days' },
      { label: '30 days', value: 'past_30_days' },
      { label: '6 months', value: 'past_6_months' }
    ];
//   // State to store the selected time filter
//   const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

//   // Data for the dropdown
//   const timeFilters = ['7 days', '30 days', '6 months'];

//   // Function to handle filter selection
//   const handleFilterSelect = (selectedItem: string, index: number) => {
//     setSelectedFilter(selectedItem);
//     // Add your logic to filter data based on the selected time period
//     console.log('Selected Filter:', selectedItem);
//   };

  return (
    <View style={styles.container}>
      <SelectDropdown
        data={TIME_FILTERS}
        defaultValueByIndex={0}
        onSelect={(selectedItem) => onFilterChange(selectedItem.value)}
        renderButton={(selectedItem, isOpened) => {
          return (
            <View style={styles.dropdownButtonStyle}>
              <Text style={styles.dropdownButtonTxtStyle}>
              {selectedItem?.label || 'Select Time'}
              </Text>
              <AntDesign
                name={isOpened ? 'caretup' : 'caretdown'}
                style={styles.dropdownButtonArrowStyle}
              />
            </View>
          );
        }}
        renderItem={(item, index, isSelected) => {
            return (
              <View
                style={{
                  ...styles.dropdownItemStyle,
                  ...(isSelected && { backgroundColor: 'rgb(239, 255, 219)' }),
                }}
              >
                <Text style={styles.dropdownItemTxtStyle}>{item.label}</Text>
              </View>
            );
          }}
        showsVerticalScrollIndicator={false}
        dropdownStyle={styles.dropdownMenuStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // padding: 16,
    // backgroundColor: '#F0f',
    width: 130,
    height: 40,
  },
  dropdownButtonStyle: {
    // width: '80%',
    height: '100%',
    backgroundColor: 'rgba(66, 115, 0, 1)',
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    fontFamily: 'SchibstedGrotesk-Medium',
    fontSize: 16,
    color: '#fff',
    flex: 1,
    fontWeight: '500',
},
dropdownButtonArrowStyle: {
    fontSize: 15,
    color: '#fff',
},
dropdownMenuStyle: {
    backgroundColor: '#E9ECEF',
    borderRadius: 2,
},
dropdownItemStyle: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
},
dropdownItemTxtStyle: {
    fontFamily: 'SchibstedGrotesk-Medium',
    fontSize: 15,
    flex: 1,
    // fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
  },
});

export default TimeFilterDropdown;