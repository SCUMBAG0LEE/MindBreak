import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import Navbar from "./navbar"; // Correct import path

export default function Home() {
  const [username, setUsername] = useState("Guest");
  const router = useRouter();

  useEffect(() => {
    const getUsername = async () => {
      const storedUsername = await AsyncStorage.getItem("username");
      if (storedUsername) {
        setUsername(storedUsername);
      }
    };

    getUsername();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome, {username}!</Text>
        <TouchableOpacity onPress={handleAvatarPress}>
          <Image
            source={require("../assets/images/profile.png")}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Available Quizzes</Text>
        <View style={styles.quizList}>
          <TouchableOpacity
            style={styles.quizCard}
            onPress={() => router.push("/quiz/1")}
          >
            <Text style={styles.quizTitle}>General Knowledge</Text>
            <Text style={styles.quizDescription}>
              Test your general knowledge with this quiz.
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quizCard}
            onPress={() => router.push("/quiz/2")}
          >
            <Text style={styles.quizTitle}>Science</Text>
            <Text style={styles.quizDescription}>
              Challenge your understanding of science.
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quizCard}
            onPress={() => router.push("/quiz/3")}
          >
            <Text style={styles.quizTitle}>History</Text>
            <Text style={styles.quizDescription}>
              How well do you know history?
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Your Progress</Text>
        <View style={styles.progressSection}>
          <Text style={styles.progressText}>
            You have completed 3 quizzes this week.
          </Text>
          <Text style={styles.progressText}>Your average score is 85%.</Text>
        </View>

        <Text style={styles.sectionTitle}>Popular Categories</Text>
        <View style={styles.categoriesList}>
          <TouchableOpacity style={styles.categoryCard}>
            <Text style={styles.categoryTitle}>Sports</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryCard}>
            <Text style={styles.categoryTitle}>Movies</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryCard}>
            <Text style={styles.categoryTitle}>Geography</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Navbar />
    </View>
  );

  function handleAvatarPress() {
    if (username === "Guest") {
      router.push("/login");
    } else {
      router.push("/profile");
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2d046e",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 50, // Add some top padding for better alignment
  },
  welcomeText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
  quizList: {
    marginBottom: 20,
  },
  quizCard: {
    backgroundColor: "#5a4ca7",
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  quizTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  quizDescription: {
    color: "white",
    fontSize: 14,
    marginTop: 5,
  },
  progressSection: {
    backgroundColor: "#4c3c90",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  progressText: {
    color: "white",
    fontSize: 16,
    marginBottom: 5,
  },
  categoriesList: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  categoryCard: {
    backgroundColor: "#5a4ca7",
    padding: 20,
    borderRadius: 10,
    width: "30%",
    alignItems: "center",
  },
  categoryTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
