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
import Navbar from "./navbar";
import { BarChart } from "react-native-chart-kit"; // Add a chart library
import { SafeAreaView } from "react-native-safe-area-context"; // Import SafeAreaView

export default function Analytics() {
  const [username, setUsername] = useState("User");
  const [expanded, setExpanded] = useState(false); // State for expanding report

  useEffect(() => {
    const getUsername = async () => {
      const storedUsername = await AsyncStorage.getItem("username");
      if (storedUsername) {
        setUsername(storedUsername);
      }
    };

    getUsername();
  }, []);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Welcome, {username}!</Text>
        <Text style={styles.subHeaderText}>Let's see your progress today</Text>
        <Image
          source={require("../assets/images/profile.png")}
          style={styles.avatar}
        />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {!expanded ? (
          <View style={styles.statisticsContainer}>
            <Text style={styles.sectionTitle}>{username}'s Statistics</Text>
            <BarChart
              data={{
                labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                datasets: [
                  {
                    data: [6, 7, 8, 5, 9, 10, 7],
                  },
                ],
              }}
              width={Dimensions.get("window").width - 40}
              height={220}
              yAxisLabel=""
              chartConfig={{
                backgroundColor: "#4c3c90",
                backgroundGradientFrom: "#4c3c90",
                backgroundGradientTo: "#2d046e",
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
            <Text style={styles.sectionTitle}>{username}'s Report</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={toggleExpanded}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <View style={styles.reportCard}>
              <Text style={styles.quizTitle}>Math Quiz</Text>
              <Text style={styles.quizScore}>85%</Text>
              <Text style={styles.quizDetails}>Leaderboard</Text>
            </View>
            <View style={styles.reportCard}>
              <Text style={styles.quizTitle}>Physics Quiz</Text>
              <Text style={styles.quizScore}>95%</Text>
              <Text style={styles.quizDetails}>MCQ: 48/50</Text>
              <Text style={styles.quizDetails}>Structured: 14/15</Text>
              <Text style={styles.quizDetails}>Essay: 33/35</Text>
              <Text style={styles.quizDetails}>Leaderboard</Text>
            </View>
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
  closeButton: {
    position: "absolute",
    right: 20,
    top: 20,
    padding: 10,
    backgroundColor: "#4c3c90",
    borderRadius: 20,
  },
  closeButtonText: {
    color: "white",
    fontSize: 14,
  },
  reportCard: {
    width: width - 40,
    backgroundColor: "#4c3c90",
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
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  quizDetails: {
    color: "white",
    fontSize: 14,
  },
});
