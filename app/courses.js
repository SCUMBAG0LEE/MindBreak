import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import Navbar from "./navbar";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "./firebase";
import { ref, getDownloadURL } from "firebase/storage";

export default function Courses() {
  const [email, setEmail] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [countdown, setCountdown] = useState(3);
  const [showCountdown, setShowCountdown] = useState(false);
  const [selectedCourseTitle, setSelectedCourseTitle] = useState("");
  const [username, setUsername] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState(null);

  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    const checkAuthentication = async () => {
      if (!auth.currentUser) {
        // User is not authenticated, navigate to login screen
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

  // Load data from AsyncStorage on mount
  useEffect(() => {
    const initializeData = async () => {
      const storedEmail = await AsyncStorage.getItem("email");
      if (storedEmail) setEmail(storedEmail);

      // const storedTime = await AsyncStorage.getItem("totalTimeSpent");
      // if (storedTime) setTotalTimeSpent(parseInt(storedTime, 10));

      // const storedLastResetDate = await AsyncStorage.getItem("lastResetDate");
      // if (storedLastResetDate) setLastResetDate(new Date(storedLastResetDate));

      // loadScores();
    };

    initializeData();
  }, []);

  function handleAvatarPress() {
    if (!auth.currentUser) {
      router.push("/login");
    } else {
      router.push("/profile");
    }
  }

  const handleNavigation = (screenName, courseTitle) => {
    setSelectedCourse(screenName);
    setSelectedCourseTitle(courseTitle);
    setModalVisible(true);
  };

  useEffect(() => {
    let timer;
    if (showCountdown && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setModalVisible(false);
      setShowCountdown(false);
      setCountdown(3);
      navigation.navigate(selectedCourse);
    }
    return () => clearTimeout(timer);
  }, [countdown, showCountdown]);

  const handleStartQuiz = () => {
    setShowCountdown(true);
    setCountdown(3);
  };

  const handleCancel = () => {
    setModalVisible(false);
    setShowCountdown(false);
    setSelectedCourse(null);
  };

  const pickImage = async () => {
    // Add your image picking logic here
    // Make sure to use ImagePicker and Firebase storage functions
    // Example code from Profile component can be reused
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Courses</Text>
          <View style={styles.profileContainer}>
            <Text style={styles.username}>{username}</Text>

            <TouchableOpacity onPress={handleAvatarPress}>
              <Image
                source={
                  profileImageUrl
                    ? { uri: profileImageUrl }
                    : require("../assets/images/profile.png")
                }
                style={styles.profileImage}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Find Course"
            placeholderTextColor="#bbb"
            style={styles.searchInput}
          />
          <Image
            source={require("../assets/images/search.png")}
            style={styles.searchIcon}
          />
        </View>
        <StatusBar barStyle="light-content" />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.sectionTitle}>Recommended</Text>
          <View style={styles.section}>
            <TouchableOpacity
              onPress={() =>
                handleNavigation("screens/LanguageQuizScreen", "Language Quiz")
              }
              style={styles.touchableContainer}
            >
              <View style={styles.item}>
                <Image
                  source={require("../assets/images/language.png")}
                  style={styles.image}
                />
                <Text style={styles.text}>Language Quiz</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                handleNavigation("screens/ArtQuizScreen", "Art Quiz")
              }
              style={styles.touchableContainer}
            >
              <View style={styles.item}>
                <Image
                  source={require("../assets/images/painting.png")}
                  style={styles.image}
                />
                <Text style={styles.text}>Art Quiz</Text>
              </View>
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionTitle}>Popular</Text>
          <View style={styles.section}>
            <TouchableOpacity
              onPress={() =>
                handleNavigation("screens/ScienceQuizScreen", "Science Quiz")
              }
              style={styles.touchableContainer}
            >
              <View style={styles.item}>
                <Image
                  source={require("../assets/images/science.png")}
                  style={styles.image}
                />
                <Text style={styles.text}>Science Quiz</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                handleNavigation("screens/MathQuizScreen", "Math Quiz")
              }
              style={styles.touchableContainer}
            >
              <View style={styles.item}>
                <Image
                  source={require("../assets/images/math.png")}
                  style={styles.image}
                />
                <Text style={styles.text}>Math Quiz</Text>
              </View>
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionTitle}>New</Text>
          <View style={styles.section}>
            <TouchableOpacity
              onPress={() =>
                handleNavigation("screens/HistoryQuizScreen", "History Quiz")
              }
              style={styles.touchableContainer}
            >
              <View style={styles.item}>
                <Image
                  source={require("../assets/images/history.png")}
                  style={styles.image}
                />
                <Text style={styles.text}>History Quiz</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                handleNavigation(
                  "screens/GeographyQuizScreen",
                  "Geography Quiz"
                )
              }
              style={styles.touchableContainer}
            >
              <View style={styles.item}>
                <Image
                  source={require("../assets/images/geography.png")}
                  style={styles.image}
                />
                <Text style={styles.text}>Geography Quiz</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      <Navbar active="courses" />

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              You're about to enter {selectedCourseTitle}. Are you ready?
            </Text>
            {showCountdown && (
              <Text style={styles.countdownText}>{countdown}</Text>
            )}
            <View style={styles.modalButtons}>
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  { backgroundColor: pressed ? "#D83A56" : "#FF5757" },
                ]}
                onPress={handleCancel}
              >
                <Text style={styles.buttonText}>No</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  { backgroundColor: pressed ? "#18A558" : "#28C76F" },
                ]}
                onPress={handleStartQuiz}
              >
                <Text style={styles.buttonText}>Yes</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000000",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  username: {
    color: "white",
    fontSize: 18,
    marginRight: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#14213D",
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  searchInput: {
    color: "white",
    flex: 1,
  },
  searchIcon: {
    width: 20,
    height: 20,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  section: {
    flexDirection: "row",
    marginBottom: 20,
  },
  sectionTitle: {
    color: "white",
    fontSize: 18,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  touchableContainer: {
    backgroundColor: "#f0f0f0",
    marginBottom: 10,
    borderRadius: 8,
    overflow: "hidden",
    flex: 1,
    maxHeight: 120,
    marginHorizontal: 20,
  },
  item: {
    flexDirection: "column",
    alignItems: "center",
    padding: 10,
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    marginRight: 10,
  },
  text: {
    color: "#000000",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "#14213D",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 24,
    marginBottom: 15,
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 2,
  },
  buttonText: {
    fontSize: 16,
    textAlign: "center",
    color: "white",
  },
  countdownText: {
    fontSize: 30,
    color: "red",
    paddingTop: 20,
    paddingBottom: 20,
  },
});
