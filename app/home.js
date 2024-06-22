import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";

import Navbar from "./navbar";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "./firebase";
import * as FileSystem from 'expo-file-system';

export default function Home() {
  const [email, setEmail] = useState("");
<<<<<<< Updated upstream
=======
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState(new Date().getTime());
  const [lastResetDate, setLastResetDate] = useState(null);
  const [upcomingUpdates, setUpcomingUpdates] = useState([]);
  const [pfpUrl, setPfp] = useState(null);
>>>>>>> Stashed changes
  const router = useRouter();

  useEffect(() => {
<<<<<<< Updated upstream
    const getEmail = async () => {
      const storedEmail = await AsyncStorage.getItem("email");
      if (storedEmail) {
        setEmail(storedEmail);
=======
    const initializeData = async () => {
      try {
        const storedData = await AsyncStorage.getItem("docsnap");
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setEmail(parsedData.email);
          
          // Fetch profile image if available
          if (parsedData.pfp) {
            await downloadImage(parsedData.pfp);
          }
        }
      } catch (error) {
        console.error('Error initializing data:', error);
>>>>>>> Stashed changes
      }
    };

    getEmail();
  }, []);

  // useEffect(() => {
  //   const getUsername = async () => {
  //     const storedUsername = await AsyncStorage.getItem("username");
  //     if (storedUsername) {
  //       setUsername(storedUsername);
  //     }
  //   };

<<<<<<< Updated upstream
  //   getUsername();
  // }, []);
=======
    saveData();
  }, [totalTimeSpent]);

  useEffect(() => {
    const updateInterval = setInterval(() => {
      const currentTime = new Date().getTime();
      const elapsedTime = currentTime - startTime;
      setTotalTimeSpent((prevTime) => prevTime + elapsedTime);
      setStartTime(currentTime);

      // Check if a new day has started
      const now = new Date();
      if (lastResetDate) {
        const lastReset = new Date(lastResetDate);
        if (now.getDate() !== lastReset.getDate() || now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
          // Reset totalTimeSpent and update lastResetDate
          setTotalTimeSpent(0);
          setLastResetDate(now);
          AsyncStorage.setItem("totalTimeSpent", "0");
          AsyncStorage.setItem("lastResetDate", now.toISOString());
        }
      } else {
        setLastResetDate(now);
      }
    }, 1000); // Update every second for real-time tracking

    return () => clearInterval(updateInterval);
  }, [startTime, lastResetDate]);

  useEffect(() => {
    const loadUpcomingUpdates = async () => {
      try {
        const storedUpdates = await AsyncStorage.getItem("upcomingUpdates");
        if (storedUpdates) {
          setUpcomingUpdates(JSON.parse(storedUpdates));
        }
      } catch (error) {
        console.error("Error loading upcoming updates:", error);
      }
    };

    loadUpcomingUpdates();
  }, []);

  useEffect(() => {
    const saveData = async () => {
      await AsyncStorage.setItem("totalTimeSpent", totalTimeSpent.toString());
      await AsyncStorage.setItem("lastResetDate", new Date().toISOString());
    };

    saveData();
  }, [totalTimeSpent]);

  useEffect(() => {
    const updateInterval = setInterval(() => {
      const currentTime = new Date().getTime();
      const elapsedTime = currentTime - startTime;
      setTotalTimeSpent((prevTime) => prevTime + elapsedTime);
      setStartTime(currentTime);

      // Check if a new day has started
      const now = new Date();
      if (lastResetDate) {
        const lastReset = new Date(lastResetDate);
        if (now.getDate() !== lastReset.getDate() || now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
          // Reset totalTimeSpent and update lastResetDate
          setTotalTimeSpent(0);
          setLastResetDate(now);
          AsyncStorage.setItem("totalTimeSpent", "0");
          AsyncStorage.setItem("lastResetDate", now.toISOString());
        }
      } else {
        setLastResetDate(now);
      }
    }, 1000); // Update every second for real-time tracking

    return () => clearInterval(updateInterval);
  }, [startTime, lastResetDate]);

  async function downloadImage(imageUrl) {
    try {
      const response = await fetch(imageUrl);
      const contentType = response.headers.get('content-type');

      if (contentType) {
        const fileExtension = contentType.split('/').pop(); // Extract file extension from content-type
        const fileUri = FileSystem.documentDirectory + `pfp.${fileExtension}`;
        await AsyncStorage.setItem("pfp", fileUri);
        setPfp(fileUri);

        const fileBlob = await response.blob();
        const reader = new FileReader();
        reader.onload = async () => {
          const base64Data = reader.result;
          await FileSystem.writeAsStringAsync(fileUri, base64Data.split(',')[1], {
            encoding: FileSystem.EncodingType.Base64,
          });
          console.log('Image downloaded to:', fileUri);
        };
        reader.readAsDataURL(fileBlob);
      } else {
        console.error('Failed to determine content-type');
      }
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  }

  async function loadUpcomingUpdates() {
    try {
      const storedUpdates = await AsyncStorage.getItem("upcomingUpdates");
      if (storedUpdates) {
        setUpcomingUpdates(JSON.parse(storedUpdates));
      }
    } catch (error) {
      console.error("Error loading upcoming updates:", error);
    }
  }
>>>>>>> Stashed changes

  function handleAvatarPress() {
    if (email === "") {
      router.push("/login");
    } else {
      router.push("/profile");
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
<<<<<<< Updated upstream
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome, {email}!</Text>
            <Text style={styles.subtitle}>Let's start learning</Text>
=======
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
                source={{ uri: pfpUrl }}
                style={styles.profileImage}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.timeSpentCard}>
            <Text style={styles.timeSpentText}>Time Spent</Text>
            <Text style={styles.timeSpentValue}>
              {formattedTime} min / 60 min
            </Text>
            <View style={styles.progressBar}>
              <View style={[styles.progress, { width: `${progressWidth}%` }]} />
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('courses')}>
              <Text style={styles.myCoursesText}>My courses</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.getStartedCard}>
            <TouchableOpacity onPress={handleGetStartedPress}>
              <Image
                source={require("../assets/images/learning.png")}
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
            <Text style={styles.cardTitle}>Upcoming Updates</Text>
            <Text style={styles.cardContent}>More Courses Coming Soon</Text>
            {upcomingUpdates.map((update, index) => (
              <Text key={index} style={styles.cardContent}>
                {update.title}: {update.date}
              </Text>
            ))}
>>>>>>> Stashed changes
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
