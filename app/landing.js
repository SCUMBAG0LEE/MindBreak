import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, View, StyleSheet, Image, Text, TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from "expo-router";

const Landing = () => {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.contentContainer}>
          <Image
            source={require('../assets/images/logotitle.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <Image
            source={require('../assets/images/cards.png')}
            style={styles.cardsImage}
            resizeMode="contain"
          />

          <View style={styles.textContainer}>
            <Text style={styles.title}>
              Challenge Your Brain{'\n'}
              Break Your Limits with{' '}
              <Text style={styles.mindBreakText}>MindBreak</Text>
            </Text>

            <Image
              source={require('../assets/images/path.png')}
              style={styles.pathImage}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.description}>
            Unlock the world of knowledge through thrilling quizzes: Join the
            adventure with MindBreak.
          </Text>

          <TouchableOpacity
          style={styles.buttonContainer}
            onPress={() => router.push("/login")}
>
            <Text style={styles.buttonText}>Continue to Login</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>

      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default Landing;


const styles = StyleSheet.create({
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#2d046e',
    },
    container: {
      flex: 1,
      backgroundColor: '#161622',
    },
    scrollViewContent: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
    },
    contentContainer: {
      width: '100%',
      alignItems: 'center',
    },
   logo: {
    width: 250,
    height: 170,
    marginTop: -100
  },
  
    cardsImage: {
      maxWidth: 280,
      width: '100%',
      height: 220,
    },
    textContainer: {
      position: 'relative',
      marginTop: 20,
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 10,
    },
    mindBreakText: {
      color: '#1c1c84', 
    },
    pathImage: {
      width: 136,
      height: 15,
      position: 'absolute',
      bottom: -2,
      right: 50,
    },
    description: {
      fontSize: 14,
      color: 'gray',
      textAlign: 'center',
      marginTop: 20,
    },
    buttonContainer: {
      width: '100%',
      marginTop: 20,
      padding: 16,
      height: 60,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#1c1c84', 
      borderRadius: 8, 
    },
    
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    },
)