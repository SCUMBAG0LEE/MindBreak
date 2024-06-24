import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BarChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome5";
import Navbar from "./navbar";
import { useRouter } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";
import { db, auth } from "./firebase";

const colors = {
  primaryBackground: "#000000",
  secondaryBackground: "#14213D",
  activeButtonColor: "#FCA311",
  chartBackground: "#14213D",
  chartGradientFrom: "#0c172e",
  chartGradientTo: "#14213D",
  positiveColor: "#80ffaa",
  negativeColor: "#f15a29",
};

export default function Analytics() {
  const [email, setEmail] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [interval, setInterval] = useState("Weekly");
  const [quizScores, setQuizScores] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [lastResetDate, setLastResetDate] = useState(null);
  const [username, setUsername] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const startTimeRef = useRef(new Date().getTime());
  const router = useRouter();
  const route = useRoute();
  const [quizAttemptsPerDay, setQuizAttemptsPerDay] = useState([
    0, 0, 0, 0, 0, 0, 0,
  ]); // Initialize with zero for each day

  useEffect(() => {
    const checkAuthentication = async () => {
      if (!auth.currentUser) {
        // User is not authenticated, navigate to login screen
        router.push("/login");
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
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    checkAuthentication();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setEmail(userData.email);
          setUsername(userData.username || "");
          setProfileImageUrl(userData.pfp || null);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const initializeData = async () => {
      const storedEmail = await AsyncStorage.getItem("email");
      if (storedEmail) setEmail(storedEmail);

      const storedTime = await AsyncStorage.getItem("totalTimeSpent");
      if (storedTime) setTotalTimeSpent(parseInt(storedTime, 10));

      const storedLastResetDate = await AsyncStorage.getItem("lastResetDate");
      if (storedLastResetDate) setLastResetDate(new Date(storedLastResetDate));

      loadScores(); // Load scores immediately on initialization
    };

    initializeData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const currentTime = new Date().getTime();
      const elapsedTime = currentTime - startTimeRef.current;
      setTotalTimeSpent((prevTime) => prevTime + elapsedTime);
      startTimeRef.current = currentTime;

      const now = new Date();
      if (lastResetDate) {
        const lastReset = new Date(lastResetDate);
        if (
          now.getDate() !== lastReset.getDate() ||
          now.getMonth() !== lastReset.getMonth() ||
          now.getFullYear() !== lastReset.getFullYear()
        ) {
          setTotalTimeSpent(0);
          setLastResetDate(now);
          AsyncStorage.setItem("totalTimeSpent", "0");
          AsyncStorage.setItem("lastResetDate", now.toISOString());
        }
      } else {
        setLastResetDate(now);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [lastResetDate]);

  useEffect(() => {
    const saveData = async () => {
      await AsyncStorage.setItem("totalTimeSpent", totalTimeSpent.toString());
      await AsyncStorage.setItem("lastResetDate", new Date().toISOString());
    };

    saveData();
  }, [totalTimeSpent]);

  useEffect(() => {
    // Load scores when the component mounts or refreshes
    loadScores();
  }, []);

  const loadScores = async () => {
    setRefreshing(true);
    try {
      const storedScores = await AsyncStorage.getItem("quizScores");
      if (storedScores) {
        const parsedScores = JSON.parse(storedScores);
        setQuizScores(parsedScores);

        // Count quiz attempts per day
        const attemptsPerDay = [0, 0, 0, 0, 0, 0, 0]; // Initialize array for current data load
        parsedScores.forEach((score) => {
          const date = new Date(score.timestamp);
          const dayOfWeek = date.getDay(); // 0 (Sunday) through 6 (Saturday)
          attemptsPerDay[dayOfWeek]++;
        });
        setQuizAttemptsPerDay(attemptsPerDay);

        // Save scores to Firebase immediately after loading
        const quizScoreData = {
          timestamp: new Date(),
          scores: parsedScores,
        };
        const quizScoresRef = collection(
          db,
          "users",
          auth.currentUser.uid,
          "quizScores"
        );
        await addDoc(quizScoresRef, quizScoreData);
        console.log("Quiz scores saved to Firebase.");
      }
    } catch (error) {
      console.error("Error loading scores:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleAvatarPress = () => {
    if (!auth.currentUser) {
      router.push("/login");
    } else {
      router.push("/profile");
    }
  };

  const getColorForScore = (score) => {
    return score >= 50 ? colors.positiveColor : colors.negativeColor;
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const formattedTime = Math.floor(totalTimeSpent / 60000);
  const progressWidth = (formattedTime / 60) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerText}>Welcome, {username || email}!</Text>
          <Text style={styles.subHeaderText}>
            Let's see your progress today
          </Text>
        </View>
        <TouchableOpacity onPress={handleAvatarPress}>
          <Image
            source={
              profileImageUrl
                ? { uri: profileImageUrl }
                : require("../assets/images/profile.png")
            }
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>
      {!expanded && (
        <View style={styles.intervalContainer}>
          {["Weekly", "Monthly", "Yearly"].map((int) => (
            <TouchableOpacity
              key={int}
              style={[
                styles.intervalButton,
                interval === int && styles.activeIntervalButton,
              ]}
              onPress={() => setInterval(int)}
            >
              <Text
                style={[
                  styles.intervalButtonText,
                  interval === int && styles.activeIntervalButtonText,
                ]}
              >
                {int}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadScores} />
        }
      >
        {!expanded ? (
          <View style={styles.statisticsContainer}>
            <Text style={styles.sectionTitle}>Quiz Statistics</Text>
            <BarChart
              data={{
                labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], // Days of the week
                datasets: [
                  {
                    data: quizAttemptsPerDay,
                  },
                ],
              }}
              width={Dimensions.get("window").width - 40}
              height={220}
              yAxisLabel=""
              chartConfig={{
                backgroundColor: colors.chartBackground,
                backgroundGradientFrom: colors.chartGradientFrom,
                backgroundGradientTo: colors.chartGradientTo,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
              }}
              style={styles.chartStyle}
            />
            <Text style={styles.totalTimeText}>
              {formattedTime} min / 60 min
            </Text>
            <View style={styles.progressBar}>
              <View style={[styles.progress, { width: `${progressWidth}%` }]} />
            </View>
            <TouchableOpacity
              style={styles.detailsButton}
              onPress={toggleExpanded}
            >
              <Text style={styles.detailsButtonText}>See Details</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.reportContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={toggleExpanded}
            >
              <Icon name="chevron-left" size={20} color="white" />
            </TouchableOpacity>
            <Text style={styles.sectionTitle}>Detailed Report</Text>
            {quizScores.map((score, index) => (
              <View key={index} style={styles.reportCard}>
                <Text style={styles.quizTitle}>{score.subjectName}</Text>
                <Text
                  style={[
                    styles.quizScore,
                    { color: getColorForScore(score.score) },
                  ]}
                >
                  {(score.score / score.questionAmount) * 100}%
                </Text>
                <Text style={styles.quizDetails}>
                  Correct answers: {score.score}/{score.questionAmount}
                </Text>
                <Text style={styles.quizDetails}>
                  Incorrect/skipped: {score.questionAmount - score.score}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
      <Navbar active="analytics" />
    </SafeAreaView>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  headerText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  subHeaderText: {
    color: "white",
    fontSize: 14,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  intervalContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: colors.secondaryBackground,
  },
  intervalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  intervalButtonText: {
    color: "white",
    fontSize: 14,
  },
  activeIntervalButton: {
    backgroundColor: colors.activeButtonColor,
  },
  activeIntervalButtonText: {
    color: "black",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  statisticsContainer: {
    alignItems: "center",
  },
  sectionTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 16,
  },
  totalTimeText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
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
  detailsButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.activeButtonColor,
    borderRadius: 20,
  },
  detailsButtonText: {
    color: "black",
    fontSize: 14,
    fontWeight: "bold",
  },
  reportContainer: {
    alignItems: "center",
  },
  reportCard: {
    width: width - 40,
    backgroundColor: "#14213D",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  quizTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  quizScore: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  quizDetails: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
  },
  backButton: {
    position: "absolute",
    left: 5,
    top: -5,
    padding: 10,
    backgroundColor: colors.secondaryBackground,
    borderRadius: 50,
  },
});
