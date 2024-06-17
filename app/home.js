import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import Navbar from "./navbar"; // Ensure this path is correct

export default function Home() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, Name</Text>
            <Text style={styles.subtitle}>Let's start learning</Text>
          </View>
          <Image
            source={{ uri: "https://via.placeholder.com/50" }} // Replace with actual profile image
            style={styles.profileImage}
          />
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
        <TouchableOpacity style={styles.getStartedCard}>
          <Image
            source={{ uri: "https://via.placeholder.com/150" }} // Replace with actual image
            style={styles.getStartedImage}
          />
          <Text style={styles.getStartedText}>Get Started</Text>
        </TouchableOpacity>
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
      <Navbar active="home" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1a0831",
  },
  container: {
    flex: 1,
    backgroundColor: "#1a0831",
    paddingHorizontal: 16,
    paddingBottom: 60, // Ensure there's space for the navbar
    marginTop: 32, // Increased margin to move the whole container down
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 32, // Adjusted margin for the header
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
    backgroundColor: "#3a1a7a",
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
    backgroundColor: "#5e3999",
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
    color: "#f15a29",
    textAlign: "right",
  },
  getStartedCard: {
    backgroundColor: "#2a0951",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  getStartedImage: {
    width: 150,
    height: 100,
    marginBottom: 8,
  },
  getStartedText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  learningPlanCard: {
    backgroundColor: "#3a1a7a",
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
    backgroundColor: "#3a1a7a",
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
