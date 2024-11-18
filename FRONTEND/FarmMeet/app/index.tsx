// import { View, Text } from 'react-native'

// export default function HomeScreen(){
//     return (
//         <View>
//             <Text style={{fontSize:30}}>HOME SCREEN</Text>
//         </View>
//     )
// }

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const LandingPage = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.push('/green-screen')}>
        <Text style={styles.greenText}>FarmMeet</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LandingPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  greenText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#013220',
  },
});
