import { SmartPreviewCardActionButton } from "../types/SmartPreviewCardButton";
import { StyleSheet } from "react-native";
import Reanimated, { SharedValue, useAnimatedProps, useAnimatedStyle } from 'react-native-reanimated';
import SmartPreviewActionItem from "./SmartPreviewActionItem";
import { memo, useMemo, useRef } from "react";
import uuid from 'react-native-uuid';

const buttonWidth = 70;
type Props = {
  prog: SharedValue<number>;
  drag: SharedValue<number>;
  parentDrag: SharedValue<number>;
  actionButtons: SmartPreviewCardActionButton[];
};
const SmartPreviewActionItemsContainer = ({ prog, drag, parentDrag, actionButtons }: Props) => {
  const styles = useMemo(() => createStyles(actionButtons.length), [actionButtons.length]);

  const uniqueId = useRef(uuid.v4().toString());
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: drag.value + (buttonWidth * actionButtons.length) }],
    };
  });

//   // Do not remove this. We use this to tell the parent when the user is dragging.
//   const animatedProps = useAnimatedProps(() => {
//     console.log("drag2: ", drag.value)
//     parentDrag.value = drag.value;
//     return {}
//   },
//     [],
//   );


//   // Append "Unpublish" button to the list
//   const extendedActionButtons = [
//     ...actionButtons,
//     {
//       label: 'Unpublish',
//       backgroundColor: 'orange',
//       labelColor: 'white',
//       onPress: () => console.log('Unpublish action triggered'),
//     },
//   ];

  return (
    <Reanimated.View style={[styles.container, animatedStyle]}>
      {actionButtons.map((button, index) => {
        return (
          <SmartPreviewActionItem
            // key={`smart-preview-card-action-button-${index}-${button.label}-${uniqueId}`}
            key={index}
            button={button}
          />
        );
      }
      )}
    </Reanimated.View>
  );
};

const createStyles = (actionButtonsCount: number) =>
  StyleSheet.create({
    container: {
        width: buttonWidth * actionButtonsCount,
        flexDirection: 'row',
        height: '96%', // Ensures actions stay within card height
        // position: 'absolute', // Prevents content from pushing it
        right: 0, // Fixes position to the right
    },
  });

export default memo(SmartPreviewActionItemsContainer);