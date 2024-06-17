import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
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

  return (
    <View style={styles.container}>
      <View style={styles.profileInfo}>
        <Image
          source={require("../assets/images/profile.png")}
          style={styles.avatar}
        />
        <Text style={styles.title}>Welcome, {email}!</Text>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
        <Text style={styles.deleteText}>Delete Account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2d046e",
    justifyContent: "center",
    alignItems: "center",
  },
  profileInfo: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  logoutButton: {
    backgroundColor: "#f15a29",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  deleteButton: {
    backgroundColor: "#f15a29",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  logoutText: {
    color: "white",
  },
  deleteText: {
    color: "white",
  },
});
