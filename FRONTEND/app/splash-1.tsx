import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { ProgressBar } from 'react-native-paper'; // Install this library: npm install react-native-paper

const SplashScreen = () => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0); // To track the current image and progress
  const [timerDone, setTimerDone] = useState(false); // Track the timer status
  const images = [
    require('../assets/vegetables.jpg'), // Image 1
    require('../assets/onion.jpg'),       // Image 2
    require('../assets/cabbage.jpg'),       // Image 3
  ];

  // Update progress bar values based on current index
  const progressValues = [
    { progress1: 1, progress2: 0.9, progress3: 0.9 },
    { progress1: 0.9, progress2: 1, progress3: 0.9 },
    { progress1: 0.9, progress2: 0.9, progress3: 1 },
  ];

  const imageTexts = [
    "Freshly Harvested By Local Farmers", // Text for Image 1
    "Packed and Ready for Delivery",       // Text for Image 2
    "Arriving Fresh at Your Table",        // Text for Image 3
  ];

  // Change image and progress every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    // After 9 seconds (3 cycles of 3 seconds), navigate to the login screen
              const timeout = setTimeout(() => {
                router.push('/auth/login');
              }, 9000);

    return () => {
      clearInterval(interval); // Cleanup interval on unmount
              clearTimeout(timeout);    // Cleanup timeout on unmount
    };
  }, [router]);





  return (
    <View style={styles.container}>
      {/* Background Image */}
      <ImageBackground
        source={images[currentIndex]} // Update background image dynamically
        style={styles.backgroundImage}
      >
        <View style={styles.ovalShape}/>
        {/* Lower Section */}
        <View style={styles.lowerSection}>
          <View style={styles.progressContainer}>
              <ProgressBar
                progress={progressValues[currentIndex].progress1}
                color={progressValues[currentIndex].progress1 === 1 ? "#fff" : "#3e502d"} // White for active
                style={[styles.progressBar, { 
                  width: progressValues[currentIndex].progress1 === 1 ? 10 : 4, // Adjust width
                  height: progressValues[currentIndex].progress1 === 1 ? 4 : 4  // Adjust height
                }]}
              />
              <ProgressBar
                progress={progressValues[currentIndex].progress2}
                color={progressValues[currentIndex].progress2 === 1 ? "#fff" : "#3e502d"} // White for active
                style={[styles.progressBar, { 
                  width: progressValues[currentIndex].progress2 === 1 ? 10 : 4, // Adjust width
                  height: progressValues[currentIndex].progress2 === 1 ? 4 : 4  // Adjust height
                }]}
              />
              <ProgressBar
                progress={progressValues[currentIndex].progress3}
                color={progressValues[currentIndex].progress3 === 1 ? "#fff" : "#3e502d"} // White for active
                style={[styles.progressBar, { 
                  width: progressValues[currentIndex].progress3 === 1 ? 10 : 4, // Adjust width
                  height: progressValues[currentIndex].progress3 === 1 ? 4 : 4  //Adjust height
                }]}
              />
          </View>

          {/* image text */}
          <Text style={styles.farmersText}>
            {imageTexts[currentIndex]}
          </Text>
          {/* <Text style={styles.farmersText}>
            Freshly Harvested By Local Farmers
          </Text> */}

          <TouchableOpacity onPress={() => router.push('/auth/signup')} style={styles.signupButton}>
            <Text style={styles.signupText}>Sign Up</Text>
          </TouchableOpacity>
          <View style={styles.redirectSignin}>
            <Text style={styles.signinText}>
            Already have an account? 
            </Text>
            <Text onPress={() => router.push('/auth/login')} style={styles.signinLink}>
              Sign In
            </Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  lowerSection: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '40%',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'center',
    marginBottom: 30,
    marginTop: 80,
  },
  // progressBarActive: {
  //   width: 12,
  //   height: 3,
  //   borderRadius: 5,
  //   marginHorizontal: 3,
  // },
  // progressBarInactive: {
  //   width: 4,
  //   height: 3,
  //   borderRadius: 10,
  //   marginHorizontal: 3,
  // },
  farmersText: {
    fontFamily: "SchibstedGrotesk-Regular",
    fontSize: 18,
    marginBottom: 30,
    color: '#fff',
  },
  signupButton: {
    backgroundColor: '#fff',
    width: 360,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: 10,
  },
  signupText: {
    fontFamily: "SchibstedGroteskBold",
    fontSize: 18,
    color: '#042D1F',
  },
  redirectSignin: {
    flexDirection: 'row',
    marginTop: 20,
  },
  signinText: {
    fontFamily: "SchibstedGrotesk-Regular",
    color: '#fff',
    fontSize: 13,
    paddingRight: 5,
  },
  signinLink: {
    color: '#fff',
    fontFamily: "SchibstedGrotesk-Regular",
    fontSize: 14,
    textDecorationLine: 'underline',
  },

  progressBar: {
    // height: 5,
    borderRadius: 200,
    marginHorizontal: 2.5,
  },

  ovalShape: {
    position:'absolute',
    bottom: -100,
    left: 0,
    width: '100%',
    height: '55%',  // Adjust height so it only covers the progress bars area
    backgroundColor: '#042D1F', // Dark green
    borderTopLeftRadius: 200000,  // Adjust radius for a subtle curve
    borderTopRightRadius: 200000, // Adjust radius for a subtle curve
    transform: [{ scaleX: 1.35 }, { scaleY: 0.7 }], // Make the shape more oval
  },

});

export default SplashScreen;


// import { useRouter } from 'expo-router';
// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
// import { ProgressBar } from 'react-native-paper'; // Install this library: npm install react-native-paper

// const SplashScreen = () => {

//   const router = useRouter();
//   const [timerDone, setTimerDone] = useState(false); // Track the timer status

//         // Navigate to the next screen after 3 seconds
//       useEffect(() => {
//         const timeout = setTimeout(() => {
//           // router.push('/auth/login'); // Update to your target screen's path
//           router.push('/splash-2');
//         }, 400000000);

//         // Cleanup the timeout if the component unmounts
//         return () => clearTimeout(timeout);
//       }, [router]);

//       useEffect(() => {
//         if (timerDone) {
//           router.push('/splash-2'); // Automatically navigate to the next splash screen
//         }
//       }, [timerDone, router]);

//   return (
//     <View style={styles.container}>
//       {/* Background Image */}
//       <ImageBackground
//         source={require('../assets/vegetables.jpg')} // Replace with your image path
//         style={styles.backgroundImage}
//       >
//         {/* Lower Section */}
//         <View style={styles.lowerSection}>
//           <View style={styles.progressContainer}>
//             <ProgressBar
//               progress={1}
//               color="#fff"
//               style={styles.progressBarActive}
//             />
//             <ProgressBar
//               progress={1}
//               color="#3e502d"
//               style={styles.progressBarInactive}
//             />
//             <ProgressBar
//               progress={1}
//               color="#3e502d"
//               style={styles.progressBarInactive}
//             />
//           </View>
//           <Text style={styles.farmersText}>
//             Freshly Harvested By Local Farmers
//           </Text>
         
//           <TouchableOpacity onPress={() => router.push('/auth/signup')} style={styles.signupButton}>
//             <Text style={styles.signupText}>Sign Up</Text>
//           </TouchableOpacity>

//           <Text style={styles.signinText}>
//             Already have an account? 
//             <Text onPress={() => router.push('/auth/login')} style={styles.signinLink}>
//               Sign In
//             </Text>
//           </Text>
//         </View>
//       </ImageBackground>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   backgroundImage: {
//     flex: 1,
//     resizeMode: 'cover',
//   },
//   lowerSection: {
//     position: 'absolute',
//     bottom: 0,
//     width: '100%',
//     height: '40%', // Adjust height to ensure a perfect semi-circle
//     backgroundColor: '#013220', // Dark green
//     borderTopLeftRadius: 5000, // Large value for a perfect curve
//     borderTopRightRadius: 5000,
//     alignItems: 'center',
//     justifyContent: 'flex-start',
//     padding: 20,
//   },
//   progressContainer: {
//     flexDirection: 'row',
//     width: '80%',
//     // justifyContent: 'space-between',
//     justifyContent: 'center', // Center the bars horizontally
//     marginBottom: 20,
//     marginTop: 90, // Push the progress bars down a bit
//   },
//   progressBarActive: {
//     width: 12,
//     height: 5,
//     borderRadius: 5,
//     marginHorizontal: 3, // Add 2px space (1px on each side)
//   },
//   progressBarInactive: {
//     width: 5,
//     height: 5,
//     borderRadius: 5,
//     marginHorizontal: 3, // Add 2px space (1px on each side)
//   },
//   farmersText: {
//     marginBottom: 20,
//     color: '#fff',
//     fontSize: 14,
//   },
//   signupButton: {
//     backgroundColor: '#fff',
//     width: 360, // Square shape
//     height: 60,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 10, // Slightly rounded corners
//     // marginTop: 90, // Adjust spacing
//     marginBottom: 10,
//   },
//   signupText: {
//     color: '#3e502d',
//     fontWeight: 'bold',
//     fontSize: 14,
//   },
//   signinText: {
//     marginTop: 20,
//     color: '#fff',
//     fontSize: 14,
//   },
 
//   signinLink: {
//     textDecorationLine: 'underline',
//     fontWeight: 'bold',
//   },
// });

// export default SplashScreen;
