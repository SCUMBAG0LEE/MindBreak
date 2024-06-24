import React, { useState, useEffect } from "react";
import { Audio } from "expo-av";
import {
  StatusBar,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const Landing = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Load the sound
  const soundObject = new Audio.Sound();
  useEffect(() => {
    const loadSoundAndStart = async () => {
      try {
        await soundObject.loadAsync(
          require("../assets/sounds/Windows 11 Startup Sound  OOBE Intro Video.mp3")
        );
        await soundObject.playAsync();
        // Set a timeout for 3 seconds, then stop the sound and set isLoading to false
        setTimeout(async () => {
          await soundObject.stopAsync();
          setIsLoading(false);
        }, 5000); // 3000 milliseconds = 3 seconds
      } catch (error) {
        console.log(error);
      }
    };

    loadSoundAndStart();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.contentContainer}>
          <Image
            source={require("../assets/images/logotitle.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <Image
            source={require("../assets/images/cards.png")}
            style={styles.cardsImage}
            resizeMode="contain"
          />

          <View style={styles.textContainer}>
            <Text style={styles.title}>
              Challenge Your Brain{"\n"}
              Break Your Limits with{" "}
              <Text style={styles.mindBreakText}>MindBreak</Text>
            </Text>

            <Image
              source={require("../assets/images/path.png")}
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

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    fontSize: 20,
    marginTop: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#161622",
    padding: 16,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    width: "100%",
    alignItems: "center",
  },
  logo: {
    width: "70%", // Use percentage for responsive sizing
    height: undefined, // Aspect ratio maintained automatically
    aspectRatio: 1, // Adjust aspect ratio as per your logo's dimensions
    marginTop: -100,
    marginBottom: 20,
  },
  cardsImage: {
    width: "90%", // Use percentage for responsive sizing
    height: undefined,
    aspectRatio: 1.2, // Adjust aspect ratio as per your image's dimensions
    marginBottom: 20,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  mindBreakText: {
    color: "#1c1c84",
  },
  pathImage: {
    width: "50%", // Use percentage for responsive sizing
    height: 15,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    width: "100%",
    paddingVertical: 16,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1c1c84",
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Landing;
