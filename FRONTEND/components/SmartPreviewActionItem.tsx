import { TouchableOpacity, Text , View} from "react-native";
import { SmartPreviewCardActionButton } from "../types/SmartPreviewCardButton";
import Reanimated from 'react-native-reanimated';
import { StyleSheet } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; // MaterialIcons

import Icon from 'react-native-vector-icons/MaterialIcons'; // You can change the icon set

{/* <AntDesign name="delete" size={24} color="black" /> */}
{/* <Feather name="eye-off" size={24} color="black" /> */}

type Props = {
  button: SmartPreviewCardActionButton;
};

const SmartPreviewActionItem = ({ button }: Props) => {
    // Choose the appropriate icon library based on the button icon set
    let IconComponent;
    
    IconComponent = button.iconSet === 'Feather' ? Feather 
    : button.iconSet === 'AntDesign' ? AntDesign 
    : button.iconSet === 'Ionicons' ? AntDesign 
    : MaterialIcons; // Default fallback

  
    return (
      <Reanimated.View style={styles.actionButtonContainer}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: button.backgroundColor }]}
          onPress={button.onPress}
          accessibilityLabel={button.accessibilityLabel}
          disabled={button.isLoading}
        >
          <View style={styles.iconContainer}>
            <IconComponent name={button.icon as any} size={24} color={button.labelColor} />
          </View>
          <Text style={[styles.actionButtonText, { color: button.labelColor }]}>{button.label}</Text>
        </TouchableOpacity>
      </Reanimated.View>
    );
  };

const styles = StyleSheet.create({
    actionButtonContainer: {
        width: 70, // Fixed button width
        height: '100%', // Make it match the card height
        borderBottomColor: '#F4F4F4',
        borderBottomWidth: 1,
      },
      actionButton: {
        flex: 1, // Makes the button fill the available space
        justifyContent: 'center',
        alignItems: 'center', // Centers text
      },
      actionButtonText: {
        fontFamily: 'SchibstedGrotesk-Meduim',
        textAlign: 'center',
        color: 'white',
      },
      iconContainer: {
        marginBottom: 5,
      }
});

export default SmartPreviewActionItem;