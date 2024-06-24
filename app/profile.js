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
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Menu, Divider, Provider } from "react-native-paper";
import Navbar from "./navbar";
import { sendPasswordResetEmail } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, storage, auth } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";

export default function Profile() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [dob, setDob] = useState("");
  const [school, setSchool] = useState("");
  const [grade, setGrade] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const navigation = useNavigation();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setEmail(userData.email);
          setUsername(userData.username);
          setAge(userData.age || "");
          setDob(userData.dob || "");
          setSchool(userData.school || "");
          setGrade(userData.grade || "");
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
    };

    initializeData();
  }, []);

  const updateProfile = async () => {
    try {
      setLoading(true);

      const userDocRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userDocRef, {
        age,
        dob,
        school,
        grade,
      });

      setLoading(false);
      Alert.alert(
        "Profile Updated",
        "Your profile has been updated successfully."
      );
    } catch (error) {
      setLoading(false);
      console.error("Error updating profile:", error);
      Alert.alert(
        "Update Failed",
        "An error occurred while updating your profile."
      );
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      await AsyncStorage.clear();
      setEmail("");
      setUsername("");
      setAge("");
      setDob("");
      setSchool("");
      setGrade("");
      setProfileImageUrl(null);
      setLoading(false);
      setIsForgotPassword(false);
      setResetEmail("");
      setMenuVisible(false);
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
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

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "We need permissions to access your camera roll."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled) {
        setProfileImageUrl(result.uri);
        await handleProfilePictureUpload(result.uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert(
        "Image picking failed",
        "An error occurred while picking an image."
      );
    }
  };

  const handleProfilePictureUpload = async (uri) => {
    try {
      setLoading(true);
      const response = await fetch(uri);
      if (!response.ok) throw new Error("Failed to fetch image URI");
      const blob = await response.blob();

      const storageRef = ref(
        storage,
        `profile_pictures/${auth.currentUser.uid}`
      );
      await uploadBytes(storageRef, blob);

      const downloadURL = await getDownloadURL(storageRef);
      setProfileImageUrl(downloadURL);
      setLoading(false);
      Alert.alert("Image uploaded", "Profile picture updated successfully.");
    } catch (error) {
      setLoading(false);
      console.error("Error uploading profile picture:", error);
      Alert.alert(
        "Upload failed",
        "An error occurred while uploading the profile picture. Please try again."
      );
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDob(selectedDate.toLocaleDateString());
    }
  };

  return (
    <Provider>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.menuContainer}>
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <TouchableOpacity onPress={() => setMenuVisible(true)}>
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
            {loading ? (
              <ActivityIndicator size="large" color="#f15a29" />
            ) : (
              <Image
                source={
                  profileImageUrl
                    ? { uri: profileImageUrl }
                    : require("../assets/images/profile.png")
                }
                style={styles.avatar}
              />
            )}
            <TouchableOpacity
              style={styles.imagePickerButton}
              onPress={pickImage}
              disabled={loading}
            >
              <Text style={styles.imagePickerText}>Change Profile Picture</Text>
            </TouchableOpacity>
            <Text style={styles.email}>{username}</Text>
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
                <Text style={styles.label}>Username</Text>
                <TextInput
                  style={styles.detailItem}
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Username"
                  placeholderTextColor="#bbb"
                  editable={true}
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
                <TouchableOpacity
                  style={styles.datePickerButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.datePickerText}>
                    {dob || "Select Date"}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={dob ? new Date(dob) : new Date()}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                  />
                )}
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

              <TouchableOpacity
                style={styles.updateButton}
                onPress={updateProfile}
                disabled={loading}
              >
                <Text style={styles.updateButtonText}>Update Profile</Text>
              </TouchableOpacity>
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
  datePickerButton: {
    color: "white",
    fontSize: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: "#bbb",
    borderRadius: 5,
    backgroundColor: "#2a2465",
    textAlign: "center",
  },
  datePickerText: {
    color: "white",
    textAlign: "center",
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
  imagePickerButton: {
    backgroundColor: "#f15a29",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  imagePickerText: {
    color: "white",
  },
  updateButton: {
    backgroundColor: "#f15a29",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  updateButtonText: {
    color: "white",
  },
  navbar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
});
