import React from "react";
import { StatusBar } from "expo-status-bar";
import {
  ScrollView,
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

const Landing = () => {
  const router = useRouter();
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

export default Landing;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#161622",
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: width * 0.04,
  },
  contentContainer: {
    width: "100%",
    alignItems: "center",
  },
  logo: {
    width: width * 0.6,
    height: height * 0.2,
    marginTop: height * -0.1,
  },
  cardsImage: {
    width: "100%",
    maxWidth: width * 0.7,
    height: height * 0.3,
  },
  textContainer: {
    position: "relative",
    marginTop: height * 0.02,
    alignItems: "center",
  },
  title: {
    fontSize: width * 0.06,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: height * 0.01,
  },
  mindBreakText: {
    color: "#1c1c84",
  },
  pathImage: {
    width: width * 0.4,
    height: height * 0.02,
    position: "absolute",
    bottom: -height * 0.003,
    right: width * 0.15,
  },
  description: {
    fontSize: width * 0.035,
    color: "gray",
    textAlign: "center",
    marginTop: height * 0.02,
  },
  buttonContainer: {
    width: "100%",
    marginTop: height * 0.02,
    padding: width * 0.04,
    height: height * 0.08,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1c1c84",
    borderRadius: width * 0.02,
  },
  buttonText: {
    color: "white",
    fontSize: width * 0.04,
    fontWeight: "bold",
  },
});
