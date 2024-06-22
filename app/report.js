import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BarChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome5";
import Navbar from "./navbar";
import { useRouter } from "expo-router";
<<<<<<< Updated upstream

export default function Analytics() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [interval, setInterval] = useState("Weekly");
  const [quizScores, setQuizScores] = useState([]);
=======
import { useRoute } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";
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
  const [email, setEmail] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [interval, setInterval] = useState("Weekly");
  const [quizScores, setQuizScores] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [lastResetDate, setLastResetDate] = useState(null);
  const [username, setUsername] = useState("");
  const [pfpUrl, setPfpUrl] = useState(null);
  const startTimeRef = useRef(new Date().getTime());
>>>>>>> Stashed changes
  const router = useRouter();

<<<<<<< Updated upstream
  useEffect(() => {
    const getEmail = async () => {
      const storedEmail = await AsyncStorage.getItem("email");
      if (storedEmail) {
        setEmail(storedEmail);
      }
=======
  useEffect(() => {
    const initData = async () => {
      try {
        const storedData = await AsyncStorage.getItem("docsnap");
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setEmail(parsedData.email);
          setPfpUrl(await AsyncStorage.getItem("pfp"))
        }
      } catch (error) {
        console.error('Error initializing data:', error);
      }
    };

    initData();
  }, []);

  // Load data from AsyncStorage on mount
  useEffect(() => {
    const initializeData = async () => {
      const storedTime = await AsyncStorage.getItem("totalTimeSpent");
      if (storedTime) setTotalTimeSpent(parseInt(storedTime, 10));

      const storedLastResetDate = await AsyncStorage.getItem("lastResetDate");
      if (storedLastResetDate) setLastResetDate(new Date(storedLastResetDate));

      loadScores();
>>>>>>> Stashed changes
    };

    getEmail();
  }, []);

  function handleAvatarPress() {
    if (!auth.currentUser) {
      router.push("/login");
    } else {
      router.push("/profile");
    }
  }

  useEffect(() => {
    generateRandomScores();
  }, [interval]);

  const generateRandomScores = () => {
    const scores = [];
    switch (interval) {
      case "Weekly":
        scores.push(generateRandomScore(), generateRandomScore());
        break;
      case "Monthly":
        scores.push(
          generateRandomScore(),
          generateRandomScore(),
          generateRandomScore()
        );
        break;
      case "Yearly":
        scores.push(
          generateRandomScore(),
          generateRandomScore(),
          generateRandomScore(),
          generateRandomScore()
        );
        break;
      default:
        scores.push(generateRandomScore(), generateRandomScore());
        break;
    }
    setQuizScores(scores);
  };

  const generateRandomScore = () => {
    return Math.floor(Math.random() * 101); // Generate random score between 0 to 100
  };

  const getColorForScore = (score) => {
    return score >= 50 ? "#80ffaa" : "#f15a29"; // Green if score >= 50, red otherwise
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerText}>Welcome, {email}!</Text>
          <Text style={styles.subHeaderText}>
            Let's see your progress today
          </Text>
        </View>
        <TouchableOpacity onPress={handleAvatarPress}>
          <Image
            source={{ uri: pfpUrl }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>
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
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {!expanded ? (
          <View style={styles.statisticsContainer}>
            <Text style={styles.sectionTitle}>{email}'s Statistics</Text>
            <BarChart
              data={{
                labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                datasets: [
                  {
                    data: quizScores,
                  },
                ],
              }}
              width={Dimensions.get("window").width - 40}
              height={220}
              yAxisLabel=""
              chartConfig={{
                backgroundColor: "#1E2923",
                backgroundGradientFrom: "#08130D",
                backgroundGradientTo: "#08130D",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
              }}
              style={styles.chartStyle}
            />
            <Text style={styles.totalTimeText}>15h 42mins</Text>
            <Text style={styles.encouragementText}>Good Job! Keep It Up</Text>
            <TouchableOpacity
              style={styles.detailsButton}
              onPress={toggleExpanded}
            >
              <Text style={styles.detailsButtonText}>
                CLICK TO SEE MORE DETAILS
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.reportContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={toggleExpanded}
            >
<<<<<<< Updated upstream
              <Icon name="arrow-left" size={24} color="white" />
=======
              <Icon name="chevron-left" size={20} color="white" />
>>>>>>> Stashed changes
            </TouchableOpacity>
            <Text style={styles.sectionTitle}>{email}'s Report</Text>

            {quizScores.map((score, index) => (
              <View key={index} style={styles.reportCard}>
                <Text style={styles.quizTitle}>Quiz {index + 1}</Text>
                <Text
                  style={[styles.quizScore, { color: getColorForScore(score) }]}
                >
                  {score}%
                </Text>
                <Text style={styles.quizDetails}>
                  MCQ: {Math.floor(score * 0.48)}/48
                </Text>
                <Text style={styles.quizDetails}>
                  Structured: {Math.floor(score * 0.15)}/15
                </Text>
                <Text style={styles.quizDetails}>
                  Essay: {Math.floor(score * 0.33)}/35
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
    backgroundColor: "#2d046e",
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
    backgroundColor: "#4c3c90",
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
    backgroundColor: "#f15a29",
  },
  activeIntervalButtonText: {
    color: "#fff",
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
  encouragementText: {
    color: "white",
    fontSize: 16,
    marginTop: 5,
  },
  detailsButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#f15a29",
    borderRadius: 20,
  },
  detailsButtonText: {
    color: "white",
    fontSize: 14,
  },
  reportContainer: {
    alignItems: "center",
  },
  reportCard: {
    width: width - 40,
    backgroundColor: "#000",
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
    color: "#80ffaa",
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center", // Center text horizontally
  },

  quizDetails: {
    color: "white",
    fontSize: 14,
    textAlign: "center", // Center text horizontally
  },
  moreText: {
    color: "#f15a29",
    fontSize: 14,
    marginTop: 10,
  },
  lessText: {
    color: "#f15a29",
    fontSize: 14,
    marginTop: 10,
  },
  backButton: {
    position: "absolute",
    left: 5,
    top: -5,
    padding: 10,
    backgroundColor: "#4c3c90",
    borderRadius: 50,
  },
});
