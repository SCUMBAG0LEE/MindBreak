import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  SafeAreaView,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router"; // Import useRouter from Expo's router
import Navbar from "./navbar";
import { auth } from "./firebase.js"; // Import the auth instance

export default function Profile({ navigation }) {
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

  const handleLogout = async () => {
    await auth.signOut(); // Sign out the user
    await AsyncStorage.removeItem("email"); // Remove the email from storage
    router.push("/login"); // Navigate to login screen
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const user = auth.currentUser;
              await user.delete(); // Delete the user's account instance
              await AsyncStorage.removeItem("email"); // Remove the email from storage
              router.push("/login"); // Navigate to login screen
            } catch (error) {
              console.error("Error deleting account:", error);
            }
          },
        },
      ]
    );
  };

  // const handleBack = () => {
  //   router.goBack();
  // };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>{"< Back"}</Text>
        </TouchableOpacity> */}
        <View style={styles.profileContainer}>
          <Image
            source={require("../assets/images/profile.png")}
            style={styles.avatar}
          />
          {/* <Text style={styles.title}>{username}</Text> */}
          <Text style={styles.email}>{email}</Text>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>10</Text>
            <Text style={styles.statLabel}>Courses</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Quizzes</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>15</Text>
            <Text style={styles.statLabel}>Hours Spent</Text>
          </View>
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Log out</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteAccount}
          >
            <Text style={styles.deleteText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Navbar active="profile" />
    </SafeAreaView>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#2d046e",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  email: {
    color: "white",
    fontSize: 16,
    marginTop: 5,
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
    marginBottom: 20,
  },
  statBox: {
    alignItems: "center",
    flex: 1,
    marginHorizontal: 10,
  },
  statNumber: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  statLabel: {
    color: "white",
    fontSize: 16,
  },
  buttonsContainer: {
    alignItems: "center",
    width: "100%",
    marginTop: 20,
  },
  logoutButton: {
    backgroundColor: "#f15a29",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: "#f15a29",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  logoutText: {
    color: "white",
    fontSize: 16,
  },
  deleteText: {
    color: "white",
    fontSize: 16,
  },
  navbar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
});
