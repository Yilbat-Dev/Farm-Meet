// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// const BottomNavigation = () => {
//   return (
//     <View style={styles.container}>
//       {/* New component covering 60% of the page */}
//       <View style={styles.newComponent}>
//         <Text style={styles.newComponentText}>Fresh From The Farm</Text>
//         <Text style={styles.newComponentTextBody}>Your Journey Begins With Local  {'\n'}
//             Farmer Who Hand Pick The Freshest  {'\n'}
//             Produce Just For You
//         </Text>
//       </View>

//       {/* Existing Skip and Next components */}
//       <View style={styles.bottomControls}>
//         <Text style={styles.skipText}>Skip</Text>
//         <TouchableOpacity style={styles.nextButton}>
//           <Text style={styles.nextText}>Next</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#EEF6F3',
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//   },
//   newComponent: {
//     position: 'absolute',
//     top: '5%', // Adjusts to cover 60% of the page
//     width: '94%',
//     height: '80%',
//     backgroundColor: 'white',
//     borderRadius: 20,
//     marginHorizontal: '10%', // Ensures 3px gap from the screen edges
//     elevation: 5, // Adds shadow for Android
//     shadowColor: '#000', // Adds shadow for iOS
//     // shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   newComponentText: {
//     fontSize: 20,
//     color: '#333',
//   },
//   newComponentTextBody: {
//     fontSize: 16,
//     color: '#013220',
//   },
//   bottomControls: {
//     flexDirection: 'row',
//     width: '100%',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingBottom: 30,
//   },
//   skipText: {
//     color: 'green',
//     fontSize: 16,
//     marginRight: 'auto',
//   },
//   nextButton: {
//     backgroundColor: 'green',
//     borderRadius: 20,
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//   },
//   nextText: {
//     color: 'white',
//     fontSize: 16,
//   },
// });

// export default BottomNavigation;

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const BottomNavigation = () => {
  return (
    <View style={styles.container}>
      {/* New component covering 60% of the page */}
      <View style={styles.newComponent}>
        {/* Image covering 80% of the newComponent */}
        <Image source={require('../assets/vegetables.jpg')} style={styles.image} />
        
        {/* Text covering 20% of the newComponent */}
        <View style={styles.textContainer}>
          <Text style={styles.newComponentText}>Fresh From The Farm</Text>
          <Text style={styles.newComponentTextBody}>
            Your Journey Begins With Local {'\n'}
            Farmer Who Hand Pick The Freshest {'\n'}
            Produce Just For You
          </Text>
        </View>
      </View>

      {/* Existing Skip and Next components */}
      <View style={styles.bottomControls}>
        <Text style={styles.skipText}>Skip</Text>
        <TouchableOpacity style={styles.nextButton}>
          <Text style={styles.nextText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF6F3',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  newComponent: {
    position: 'absolute',
    top: '5%', // Adjusts to cover 60% of the page
    width: '94%',
    height: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    marginHorizontal: '3%', // Ensures 3px gap from the screen edges
    elevation: 5, // Adds shadow for Android
    shadowColor: '#000', // Adds shadow for iOS
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  image: {
    width: '100%',
    height: '80%', // Image covers 80% of the component
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    resizeMode: 'cover',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  newComponentText: {
    fontSize: 20,
    color: '#333',
    fontWeight: 'bold',
  },
  newComponentTextBody: {
    fontSize: 16,
    color: '#013220',
    textAlign: 'center',
  },
  bottomControls: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  skipText: {
    color: 'green',
    fontSize: 16,
    marginRight: 'auto',
  },
  nextButton: {
    backgroundColor: 'green',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  nextText: {
    color: 'white',
    fontSize: 16,
  },
});

export default BottomNavigation;

