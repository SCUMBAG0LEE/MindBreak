import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions, // Import Dimensions from react-native
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";

import Navbar from "./navbar";

export default function Home() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    const getEmail = async () => {
      const storedEmail = await AsyncStorage.getItem("email");
      if (storedEmail) {
        setEmail(storedEmail);
      }
    };

    getEmail();
  }, []);

  function handleAvatarPress() {
    if (email === "") {
      router.push("/login");
    } else {
      router.push("/profile");
    }
  }

  function handleGetStartedPress() {
    router.push("/courses");
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>
                Hello, {email ? email : "Name"}
              </Text>
              <Text style={styles.subtitle}>Let's start learning</Text>
            </View>
            <TouchableOpacity onPress={handleAvatarPress}>
              <Image
                source={require("../assets/images/profile.png")}
                style={styles.profileImage}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.timeSpentCard}>
            <Text style={styles.timeSpentText}>Time Spent</Text>
            <Text style={styles.timeSpentValue}>0 min / 60 min</Text>
            <View style={styles.progressBar}>
              <View style={styles.progress} />
            </View>
            <TouchableOpacity>
              <Text style={styles.myCoursesText}>My courses</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.getStartedCard}>
            <TouchableOpacity onPress={handleGetStartedPress}>
              <Image
                source={require("../assets/images/learning.png")} // Replace with actual image
                style={styles.getStartedImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.learningPlanCard}>
            <Text style={styles.cardTitle}>Learning Plan</Text>
            <Text style={styles.cardContent}>There is nothing here</Text>
          </View>
          <View style={styles.upcomingQuizCard}>
            <Text style={styles.cardTitle}>Upcoming Quiz</Text>
            <Text style={styles.cardContent}>12/12 10:00 AM</Text>
            <Text style={styles.cardContent}>Math Test | Grade 12</Text>
          </View>
        </View>
      </ScrollView>

      <Navbar active="home" />
    </SafeAreaView>
  );
}

const { width } = Dimensions.get("window"); // Get the device's width

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000000",
  },
  container: {
    flex: 1,
    backgroundColor: "#000000",
    paddingHorizontal: 16,
    paddingBottom: 60, // Ensure there's space for the navbar
    marginTop: 32, // Increased margin to move the whole container down
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 40, // Adjusted margin for the header
    marginBottom: 16,
  },
  greeting: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#bbb",
    fontSize: 16,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  timeSpentCard: {
    backgroundColor: "#14213D",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  timeSpentText: {
    color: "white",
    fontSize: 16,
    marginBottom: 8,
  },
  timeSpentValue: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#FCA311",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progress: {
    width: "0%", // Change this value to represent the progress
    height: "100%",
    backgroundColor: "#f15a29",
  },
  myCoursesText: {
    color: "#FCA311",
    textAlign: "right",
  },
  getStartedCard: {
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 20,
  },
  getStartedImage: {
    width: width * 0.9, // Adjust width dynamically based on device width
    height: width * 0.5, // Maintain aspect ratio relative to width
    borderRadius: 20, // Keep the rounded edges
  },
  learningPlanCard: {
    backgroundColor: "#14213D",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    color: "white",
    fontSize: 16,
    marginBottom: 8,
  },
  cardContent: {
    color: "#bbb",
    fontSize: 14,
  },
  upcomingQuizCard: {
    backgroundColor: "#14213D",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  navbar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
});
