import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import Navbar from "./navbar";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Home() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState(new Date().getTime());
  const [lastResetDate, setLastResetDate] = useState(null);
  const [upcomingUpdates, setUpcomingUpdates] = useState([]);
  const [congratulateVisible, setCongratulateVisible] = useState(false);
  const router = useRouter();
  const navigation = useNavigation();

  const resetUserState = () => {
    setUsername("");
    setEmail("");
    setProfileImageUrl(null);
    setTotalTimeSpent(0);
    setLastResetDate(null);
    setUpcomingUpdates([]);
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      if (!auth.currentUser) {
        // User is not authenticated, navigate to login screen
        resetUserState();
        navigation.navigate("login");
      } else {
        // User is authenticated, fetch user data as usual
        try {
          const userDocRef = doc(db, "users", auth.currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setEmail(userData.email);
            setUsername(userData.username || "");
            setProfileImageUrl(userData.pfp || null);
            setTotalTimeSpent(userData.totalTimeSpent || 0);
            setLastResetDate(userData.lastResetDate || new Date());
            setUpcomingUpdates(userData.upcomingUpdates || []);
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    checkAuthentication();
  }, [auth.currentUser]); // Dependency array includes auth.currentUser to trigger on auth state change

  // Load data from AsyncStorage on mount
  useEffect(() => {
    const initializeData = async () => {
      const storedEmail = await AsyncStorage.getItem("email");
      if (storedEmail) setEmail(storedEmail);
    };

    initializeData();
  }, []);

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
        if (
          now.getDate() !== lastReset.getDate() ||
          now.getMonth() !== lastReset.getMonth() ||
          now.getFullYear() !== lastReset.getFullYear()
        ) {
          // Reset totalTimeSpent and update lastResetDate
          setTotalTimeSpent(0);
          setLastResetDate(now);
          AsyncStorage.setItem("totalTimeSpent", "0");
          AsyncStorage.setItem("lastResetDate", now.toISOString());
        }
      } else {
        setLastResetDate(now);
      }

      // Check if the current time is past 23:59 to reset
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      if (currentHour === 23 && currentMinute === 59) {
        setTotalTimeSpent(0);
        setLastResetDate(now);
        AsyncStorage.setItem("totalTimeSpent", "0");
        AsyncStorage.setItem("lastResetDate", now.toISOString());
      }

      // Check if totalTimeSpent has reached 60 minutes
      if (totalTimeSpent >= 3600000) {
        // 60 minutes in milliseconds
        setCongratulateVisible(true);
      }
    }, 1000); // Update every second for real-time tracking

    return () => clearInterval(updateInterval);
  }, [startTime, lastResetDate, totalTimeSpent]);

  function handleAvatarPress() {
    if (!auth.currentUser) {
      router.push("/login");
    } else {
      router.push("/profile");
    }
  }

  function handleGetStartedPress() {
    router.push("/courses");
  }

  const formattedTime = Math.floor(totalTimeSpent / 60000); // Convert to minutes
  const progressWidth = Math.min((formattedTime / 60) * 100, 100); // Calculate percentage, capped at 100%

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>
                Hello, {username ? username : "Name"}
              </Text>
              <Text style={styles.subtitle}>Let's start learning</Text>
            </View>
            <TouchableOpacity onPress={handleAvatarPress}>
              <View style={styles.profileContainer}>
                {profileImageUrl ? (
                  <Image
                    source={{ uri: profileImageUrl }}
                    style={styles.profileImage}
                  />
                ) : (
                  <Image
                    source={require("../assets/images/profile.png")}
                    style={styles.profileImage}
                  />
                )}
                <Text style={styles.usernameText}>Hello, {username}!</Text>
                <Text style={styles.usernameText}>Hello, {email}!</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.timeSpentCard}>
            <Text style={styles.timeSpentText}>Time Spent Today</Text>
            <Text style={styles.timeSpentValue}>
              {formattedTime} min / 60 min
            </Text>
            <View style={styles.progressBar}>
              <View style={[styles.progress, { width: `${progressWidth}%` }]} />
            </View>
            {congratulateVisible && (
              <Text style={styles.congratulateText}>
                Congratulations on reaching 60 minutes!
              </Text>
            )}
            <TouchableOpacity onPress={() => navigation.navigate("courses")}>
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
          </View>
        </View>
      </ScrollView>

      <Navbar active="home" />
    </SafeAreaView>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000000",
  },
  container: {
    flex: 1,
    backgroundColor: "#000000",
    paddingHorizontal: 16,
    paddingBottom: 60,
    marginTop: 32,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 40,
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
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  usernameText: {
    color: "white",
    fontSize: 16,
    marginLeft: 10,
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
    width: width * 0.9,
    height: width * 0.5,
    borderRadius: 5,
  },
  learningPlanCard: {
    backgroundColor: "#14213D",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  cardContent: {
    color: "white",
    fontSize: 16,
  },
  upcomingQuizCard: {
    backgroundColor: "#14213D",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  congratulateText: {
    color: "green",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
});
