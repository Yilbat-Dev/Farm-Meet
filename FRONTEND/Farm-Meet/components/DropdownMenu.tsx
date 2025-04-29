import React, { useRef, useEffect, useState, ReactNode } from 'react';
import { View, Modal, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, Text } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Dimensions } from 'react-native';
import { blue } from 'react-native-reanimated/lib/typescript/Colors';


const screenWidth = Dimensions.get('window').width;
interface MenuOptionProps {
  value: string;
  label: string;
  isSelected: boolean;
  onSelect: (value: string) => void;
}

export const MenuOption: React.FC<MenuOptionProps> = ({ value, label, isSelected, onSelect }) => {
  return (
    <TouchableOpacity
      onPress={() => onSelect(value)}
      style={[styles.menuOption, isSelected && styles.selectedOption]}
    >
      <Text style={styles.optionText}>{label}</Text>
    </TouchableOpacity>
  );
};

interface DropdownMenuProps {
  visible: boolean;
  handleClose: () => void;
  handleOpen: () => void;
  trigger: ReactNode;
  options: { value: string; label: string }[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  dropdownWidth?: number;
  multiple?: boolean;
  isSingleSelect?: boolean;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  visible,
  handleOpen,
  handleClose,
  trigger,
  options,
  selectedValues,
  onSelectionChange,
  multiple = true,
  isSingleSelect = false,
  // dropdownWidth = 300,
}) => {
  const triggerRef = useRef<View>(null);
  const [position, setPosition] = useState({ x: 0, y: 0, width: 0 });
  const handleSelect = (value: string) => {
    let newSelection: string[];

    if (isSingleSelect) {
      // For single select, deselect if the same value is clicked
      newSelection = selectedValues.includes(value) ? [] : [value];
    } else {
      // For multiple select, toggle the selection
      const isAlreadySelected = selectedValues.includes(value);
      newSelection = isAlreadySelected
        ? selectedValues.filter((v) => v !== value) // Deselect the value
        : [...selectedValues, value]; // Add the value
    }

    onSelectionChange(newSelection);
  };

  // -------------------------------2
  // const handleSelect = (value: string) => {
  //   let newSelection: string[];
  
  //   if (multiple) {
  //     // Handle multiple selection (allow deselecting and selecting the same option)
  //     const isAlreadySelected = selectedValues.includes(value);
  //     newSelection = isAlreadySelected
  //       ? selectedValues.filter((v) => v !== value) // Deselect the value
  //       : [...selectedValues, value]; // Add the value
  //   } else {
  //     // Handle single selection (only select one at a time)
  //     newSelection = [value];
  //   }
  
  //   onSelectionChange(newSelection);
  // };

  // ----------------------------1
  // const handleSelect = (value: string) => {
  //   const isAlreadySelected = selectedValues.includes(value);
  //   const newSelection = isAlreadySelected
  //     ? selectedValues.filter((v) => v !== value) // Deselect the value
  //     : [...selectedValues, value]; // Add the value

  //   onSelectionChange(newSelection);
  // };

  useEffect(() => {
    if (triggerRef.current && visible) {
      triggerRef.current.measure((fx, fy, width, height, px, py) => {
        setPosition({ x: px, y: py + height, width });
      });
    }
  }, [visible]);

  return (
<View>
      <TouchableWithoutFeedback onPress={handleOpen}>
        <View ref={triggerRef}>{trigger}</View>
      </TouchableWithoutFeedback>
      {visible && (
        <Modal transparent visible animationType="fade" onRequestClose={handleClose}>
          <TouchableWithoutFeedback onPress={handleClose}>
            <View style={styles.modalOverlay}>
              <View style={[styles.menu, { top: position.y }]}>
                {options.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.menuOption,
                      isSingleSelect && selectedValues.includes(option.value)
                        ? styles.singleSelectBorder
                        : null, // Border for single selection
                      multiple && selectedValues.includes(option.value)
                        ? styles.selectedOption
                        : null, // Background for multiple selection
                    ]}
                    onPress={() => handleSelect(option.value)}
                  >
                    {multiple && (
                      <View
                        style={[
                          styles.checkbox,
                          selectedValues.includes(option.value) && styles.checkedBox,
                        ]}
                      >
                        {selectedValues.includes(option.value) && (
                          <AntDesign name="check" size={14} color="#fff" />
                        )}
                      </View>
                    )}
                    <Text style={styles.optionText}>{option.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
   modalOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Semi-transparent background
    padding: 10,
  },
  menu: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    left: 20,
    right: 20,
    width: screenWidth - 40,
  },
  menuOption: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedOption: {
    backgroundColor: '#fff', // Light blue for multiple selection
  },
  singleSelectBorder: {
    // borderWidth: 0.7,
    backgroundColor: '#DCF3BF', // Dark green border for single selection
    borderRadius: 5,
  },
  optionText: {
    fontFamily: 'SchibstedGrotesk-Regular',
    fontSize: 14,
    color: '#000',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#042D1F',
    marginRight: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    backgroundColor: '#042D1F',
  },
});

export default DropdownMenu;
