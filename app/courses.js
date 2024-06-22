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
} from "react-native";
import Navbar from "./navbar";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function Courses() {
  const [email, setEmail] = useState("");
  const router = useRouter();
<<<<<<< Updated upstream

=======
  const navigation = useNavigation();
  const [pfpUrl, setPfpUrl] = useState(null);
>>>>>>> Stashed changes
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

  // useEffect(() => {
  //   const getUsername = async () => {
  //     const storedUsername = await AsyncStorage.getItem("username");
  //     if (storedUsername) {
  //       setUsername(storedUsername);
  //     }
  //   };

  //   getUsername();
  // }, []);

  function handleAvatarPress() {
    if (email === "") {
      router.push("/login");
    } else {
      router.push("/profile");
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Courses</Text>
          <View style={styles.profileContainer}>
            <Text style={styles.username}>{email}</Text>
            <TouchableOpacity onPress={handleAvatarPress}>
              <Image
                source={{ uri: pfpUrl }}
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
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {renderSection("Recommended", [
            {
              image: require("../assets/images/language.png"),
              text: "Language Quiz",
            },
            {
              image: require("../assets/images/painting.png"),
              text: "Art Quiz",
            },
          ])}
          {renderSection("Popular", [
            {
              image: require("../assets/images/science.png"),
              text: "Science Quiz",
            },
            { image: require("../assets/images/math.png"), text: "Math Quiz" },
          ])}
          {renderSection("New", [
            {
              image: require("../assets/images/history.png"),
              text: "History Quiz",
            },
            {
              image: require("../assets/images/geography.png"),
              text: "Geography Quiz",
            },
          ])}
        </ScrollView>
      </View>
      <Navbar active="courses" />
    </SafeAreaView>
  );
}

const renderSection = (title, courses) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.coursesList}>
      {courses.map((course, index) => (
        <View key={index} style={styles.courseCard}>
          <Image source={course.image} style={styles.courseImage} />
          <Text style={styles.courseText}>{course.text}</Text>
        </View>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#2d046e",
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
    marginRight: 10, // Add some margin for separation
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4c3c90",
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
    marginBottom: 20,
  },
  sectionTitle: {
    color: "white",
    fontSize: 18,
    marginBottom: 10,
  },
  coursesList: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
  },
  courseCard: {
    backgroundColor: "#5a4ca7",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "45%",
    marginBottom: 20,
  },
  courseImage: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  courseText: {
    color: "white",
    textAlign: "center",
  },
  navbar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
});
