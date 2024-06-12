import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, View, Image, Text, TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './_layout';
import { useRouter } from "expo-router";

const Welcome = () => {
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
            <Text style={styles.buttonText}>Continue with Email</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>

      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default Welcome;


