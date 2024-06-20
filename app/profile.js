import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Menu, Divider, Provider } from "react-native-paper";
import Navbar from "./navbar";
import { auth, sendPasswordResetEmail } from "./firebase.js";

export default function Profile({ navigation }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [dob, setDob] = useState("");
  const [school, setSchool] = useState("");
  const [grade, setGrade] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getEmail = async () => {
      const storedEmail = await AsyncStorage.getItem("email");
      if (storedEmail) {
        setEmail(storedEmail);
        setName(storedEmail.split("@")[0].split(".")[0]); // Extract name from email
      }
    };

    getEmail();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    await AsyncStorage.removeItem("email");
    router.push("/login");
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
              await user.delete();
              await AsyncStorage.removeItem("email");
              router.push("/login");
            } catch (error) {
              console.error("Error deleting account:", error);
            }
          },
        },
      ]
    );
  };

  const handleForgotPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      Alert.alert(
        "Password Reset Email Sent",
        "Check your email to reset your password."
      );
    } catch (error) {
      console.error("Error sending password reset email:", error);
      Alert.alert(
        "Error",
        "Failed to send password reset email. Please try again later."
      );
    }
  };

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  return (
    <Provider>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.menuContainer}>
            <Menu
              visible={menuVisible}
              onDismiss={closeMenu}
              anchor={
                <TouchableOpacity onPress={openMenu}>
                  <Image
                    source={require("../assets/images/menu-icon.png")}
                    style={styles.menuIcon}
                  />
                </TouchableOpacity>
              }
              style={styles.menu}
            >
              <Menu.Item onPress={handleLogout} title="Log out" />
              <Divider />
              <Menu.Item onPress={handleDeleteAccount} title="Delete Account" />
              <Divider />
              <Menu.Item
                onPress={() => setIsForgotPassword(true)}
                title="Reset Password"
              />
            </Menu>
          </View>

          <View style={styles.profileContainer}>
            <Image
              source={require("../assets/images/profile.png")}
              style={styles.avatar}
            />
            <Text style={styles.email}>{email}</Text>
          </View>

          {isForgotPassword ? (
            <View style={styles.forgotPasswordContainer}>
              <Text style={styles.sectionTitle}>Forgot Password</Text>
              <TextInput
                placeholder="Enter your email"
                style={styles.detailItem}
                placeholderTextColor="#bbb"
                value={resetEmail}
                onChangeText={setResetEmail}
              />
              <TouchableOpacity
                style={styles.resetButton}
                onPress={handleForgotPassword}
              >
                <Text style={styles.resetText}>Send Reset Email</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setIsForgotPassword(false)}
              >
                <Text style={styles.backText}>Back to Profile</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.profileDetails}>
              <Text style={styles.sectionTitle}>Profile Details</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={styles.detailItem}
                  value={name}
                  onChangeText={setName}
                  placeholder="Name"
                  placeholderTextColor="#bbb"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Age</Text>
                <TextInput
                  style={styles.detailItem}
                  value={age}
                  onChangeText={setAge}
                  placeholder="Age"
                  placeholderTextColor="#bbb"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Date of Birth</Text>
                <TextInput
                  style={styles.detailItem}
                  value={dob}
                  onChangeText={setDob}
                  placeholder="Date of Birth"
                  placeholderTextColor="#bbb"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.detailItem}
                  value={email}
                  placeholder="Email"
                  placeholderTextColor="#bbb"
                  editable={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>School</Text>
                <TextInput
                  style={styles.detailItem}
                  value={school}
                  onChangeText={setSchool}
                  placeholder="School"
                  placeholderTextColor="#bbb"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Grade</Text>
                <TextInput
                  style={styles.detailItem}
                  value={grade}
                  onChangeText={setGrade}
                  placeholder="Grade"
                  placeholderTextColor="#bbb"
                />
              </View>
            </View>
          )}
        </ScrollView>
        <Navbar active="profile" />
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "black",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
  },
  menuContainer: {
    position: "absolute",
    top: 60,
    right: 20,
    zIndex: 1,
  },
  menuIcon: {
    width: 30,
    height: 30,
    tintColor: "white",
  },
  menu: {
    marginTop: 20,
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
  email: {
    color: "white",
    fontSize: 16,
    marginTop: 5,
    textAlign: "center",
  },
  profileDetails: {
    width: "100%",
    backgroundColor: "#1C1646",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    color: "white",
    fontSize: 16,
    marginBottom: 5,
  },
  detailItem: {
    color: "white",
    fontSize: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: "#bbb",
    borderRadius: 5,
    backgroundColor: "#2a2465",
  },
  forgotPasswordContainer: {
    width: "100%",
    backgroundColor: "#1C1646",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  resetButton: {
    backgroundColor: "#f15a29",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  resetText: {
    color: "white",
  },
  backButton: {
    backgroundColor: "#f15a29",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  backText: {
    color: "white",
  },
  navbar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
});
