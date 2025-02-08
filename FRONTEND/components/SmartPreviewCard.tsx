import { useEffect, useRef, useState } from 'react';
import Reanimated, { useAnimatedProps, useSharedValue } from 'react-native-reanimated';
import Swipeable, { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
// import { SmartPreviewCardActionButton } from '../types/SmartPreviewCardButton';
import sleep from '../utils/sleep';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import Swipeable, { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import SmartPreviewActionItemsContainer from '../components/SmartPreviewActionItemsContainer';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SmartPreviewCardActionButton = {
    label: string;
    backgroundColor: string;
    labelColor: string;
    onPress: () => void;
    accessibilityLabel: string; // Ensure this property is included
  };

/**
 * The smart preview card is mainly used to add sliding action menu. Basically you swipe left on the
 * preview card to reveal an action menu like edit, delete...
 */
type Props = {
  cardData?: {
    id: string;
    name: string;
    price: string;
    available: string;
    image: any;
  };
  children: React.ReactNode;

  /**
   * If passed, this will be triggered when the user starts to open the action menu.
   */
  onOpen?: () => void;

  /**
   * If passed, this will be triggered when the user closes the action menu.
   */
  onClose?: () => void;

  /**
   * The action buttons to display.
   */
  actionButtons: SmartPreviewCardActionButton[]
  /**
   * If true, and the user has not entered the actions menu in the past, then the component will
   * bounce a little to indicate that there is a swiping action available.
   */
  enableOnboarding?: boolean | undefined;
};

const SmartPreviewCard = ({ 
    children, 
    onOpen, 
    onClose, 
    actionButtons, // Use default buttons if none provided
    enableOnboarding 
  }: Props) => {
  const showingOnboardingRef = useRef(false);
  const swipeableRef = useRef<SwipeableMethods>(null);
//   const showOnboarding = async () => {
//     await sleep(200);
//     swipeableRef.current?.openRight();
//     await sleep(800);
//     swipeableRef.current?.close();
//     showingOnboardingRef.current = false;
//   }
  useEffect(() => {
    if (!enableOnboarding) return;
  
    const checkOnboardingStatus = async () => {
      const hasEnteredSmartPreviewCardMenuInPast = await AsyncStorage.getItem('hasEnteredSmartPreviewCardMenuInPast');
      if (hasEnteredSmartPreviewCardMenuInPast) return;
  
      showingOnboardingRef.current = true;
      swipeableRef.current?.openRight();
      await sleep(800);
      swipeableRef.current?.close();
    };
  
    checkOnboardingStatus();
  }, []);

  let parentDrag = useSharedValue(0);
  const animatedProps = useAnimatedProps(
    () => {
      return {
        pointerEvents:
          parentDrag.value !== 0
            ? 'none' as const
            : 'auto' as const,
      }
    },
    [],
  );

  return (
    <GestureHandlerRootView onMoveShouldSetResponder={() => true} 
    style={{
        // flex:1, 
        // height:100,
        width:400, 
        backgroundColor:'white'
        }}>
      <Swipeable
        ref={swipeableRef}
        rightThreshold={40}
        renderRightActions={(prog, drag) => {
          return (
            <SmartPreviewActionItemsContainer
              actionButtons={actionButtons}
              prog={prog}
              drag={drag}
              parentDrag={parentDrag}
            />
          )
        }}
        // onSwipeableOpenStartDrag={() => {
        //   if (onOpen)
        //     onOpen();
        // }}
        onSwipeableOpenStartDrag={onOpen}
        onSwipeableClose={onClose}
        // onSwipeableClose={() => onClose && onClose()}
        // onSwipeableWillOpen={() => {
        //   // For the purpose of this demo, we do not turn off the onboarding nudge ever but if you wanted to
        //   // all you would have to do is uncomment the following lines.
        //   // if (!showingOnboardingRef.current)
        //   //  AsyncStorage.setItem('hasEnteredSmartPreviewCardMenuInPast', 'true');
        // }}
      >
        <Reanimated.View animatedProps={animatedProps}>
          {children}
        </Reanimated.View>
      </Swipeable>
    </GestureHandlerRootView>
  );
};

export default SmartPreviewCard;