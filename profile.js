import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Navbar from "./navbar"; // Assuming Navbar component is defined and styled correctly

export default function Profile() {
  const [username, setUsername] = useState("Guest");
  const [email, setEmail] = useState("");
  const [showMenu, setShowMenu] = useState(false); // State to control dropdown menu visibility
  const navigation = useNavigation();

  useEffect(() => {
    const getUserInfo = async () => {
      const storedUsername = await AsyncStorage.getItem("username");
      const storedEmail = await AsyncStorage.getItem("email");
      if (storedUsername) {
        setUsername(storedUsername);
      }
      if (storedEmail) {
        setEmail(storedEmail);
      }
    };

    getUserInfo();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("username");
    await AsyncStorage.removeItem("email");
    navigation.navigate("Login");
  };

  const handleDeleteAccount = async () => {
    await AsyncStorage.removeItem("username");
    await AsyncStorage.removeItem("email");
    navigation.navigate("Login");
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require("../assets/images/back-icon.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Profile</Text>
        <TouchableOpacity onPress={toggleMenu}>
          <Image
            source={require("../assets/images/menu-icon.png")}
            style={styles.menuIcon}
          />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileInfo}>
          <Image
            source={require("../assets/images/profile.png")}
            style={styles.avatar}
          />
          <Text style={styles.title}>Welcome, {username}!</Text>
          <Text style={styles.subtitle}>{email}</Text>
          <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate("Settings")}>
            <Text style={styles.settingsButtonText}>Edit Profile</Text>
          </TouchableOpacity>
          {/* Additional Profile Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <Text style={styles.sectionText}>Name: Guest</Text>
            <Text style={styles.sectionText}>Date of Birth: 01/01/1990</Text>
            <Text style={styles.sectionText}>Gender: Male</Text>
            {/* Add more personal information as needed */}
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Address</Text>
            <Text style={styles.sectionText}>123 Main Street, New York, USA</Text>
            {/* Add more address details as needed */}
          </View>
          {/* Add more sections as required */}
        </View>
      </ScrollView>
      {/* Dropdown menu */}
      {showMenu && (
        <View style={styles.menuDropdown}>
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <Text style={styles.menuText}>Log out</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handleDeleteAccount}>
            <Text style={styles.menuText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      )}
      {/* Bottom Navigation */}
      <View style={styles.bottomNavbar}>
        <Navbar />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2d046e",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: "#1f0d3e",
  },
  menuIcon: {
    width: 30,
    height: 30,
    tintColor: "white",
  },
  backIcon: {
    width: 30,
    height: 30,
    tintColor: "white",
  },
  headerText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  profileInfo: {
    alignItems: "center",
    paddingTop: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 10,
  },
  subtitle: {
    color: "white",
    fontSize: 18,
    marginBottom: 20,
  },
  settingsButton: {
    backgroundColor: "#f15a29",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginBottom: 20,
  },
  settingsButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  section: {
    backgroundColor: "#371f66",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: "80%",
  },
  sectionTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  sectionText: {
    color: "white",
    fontSize: 16,
    marginBottom: 5,
  },
  menuDropdown: {
    position: "absolute",
    top: 80, // Adjust this based on your layout needs
    right: 20,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    elevation: 5,
    zIndex: 100,
  },
  menuItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  menuText: {
    fontSize: 18,
    color: "#333333",
  },
  bottomNavbar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});
