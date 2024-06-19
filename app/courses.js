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
import { useNavigation } from "@react-navigation/native";

export default function Courses() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const navigation = useNavigation();
  useEffect(() => {
    const getEmail = async () => {
      const storedEmail = await AsyncStorage.getItem("email");
      if (storedEmail) {
        setEmail(storedEmail);
      }
    };

    getEmail();
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

  const handleNavigation = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Courses</Text>
          <View style={styles.profileContainer}>
            <Text style={styles.username}>{email}</Text>
            <TouchableOpacity onPress={handleAvatarPress}>
              <Image
                source={require("../assets/images/profile.png")}
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
              onPress={() => handleNavigation("screens/LanguageQuizScreen")}
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
              onPress={() => handleNavigation("screens/ArtQuizScreen")}
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
              onPress={() => handleNavigation("screens/ScienceQuizScreen")}
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
              onPress={() => handleNavigation("screens/MathQuizScreen")}
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
              onPress={() => handleNavigation("screens/HistoryQuizScreen")}
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
              onPress={() => handleNavigation("screens/GeographyQuizScreen")}
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
    flexDirection: "row",
    marginBottom: 20,
  },
  sectionTitle: {
    color: "white",
    fontSize: 18,
    marginHorizontal: 20,
    marginVertical: 10,
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
    width: 80, // Adjust width as needed
    height: 80, // Adjust height as needed
    resizeMode: "contain", // Ensure image scales correctly
    marginRight: 10,
  },
});
