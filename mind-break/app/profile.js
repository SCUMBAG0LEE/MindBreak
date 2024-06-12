import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function Profile({ navigation }) {
  const [username, setUsername] = useState("Guest");
  const router = useRouter(); // Add this line

  useEffect(() => {
    const getUsername = async () => {
      const storedUsername = await AsyncStorage.getItem("username");
      if (storedUsername) {
        setUsername(storedUsername);
      }
    };

    getUsername();
  }, []);

  const handleLogout = async () => {
    // await AsyncStorage.removeItem("username");
    // await AsyncStorage.removeItem("password");
    router.push("/login"); // navigate to login screen
  };

  const handleDeleteAccount = async () => {
    await AsyncStorage.removeItem("username");
    await AsyncStorage.removeItem("password");
    router.push("/login"); // navigate to login screen
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileInfo}>
        <Image
          source={require("../assets/images/profile.png")}
          style={styles.avatar}
        />
        <Text style={styles.title}>Welcome, {username}!</Text>
      </View>
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
