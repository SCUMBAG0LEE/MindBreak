import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, db } from "./firebase"; // Adjust this import based on your firebase setup
import { doc, getDoc } from "firebase/firestore";

const Navbar = ({ active }) => {
  const navigation = useNavigation();
  const [profileImageUrl, setProfileImageUrl] = useState(null);

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setProfileImageUrl(userData.pfp || null); // Assuming "pfp" is the field name for profile picture URL
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchProfileImage();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.navItem, active === "home" ? styles.activeItem : null]}
        onPress={() => navigation.navigate("home")}
      >
        <Image
          source={require("../assets/images/home.png")}
          style={styles.icon}
        />
        <Text style={styles.text}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.navItem,
          active === "courses" ? styles.activeItem : null,
        ]}
        onPress={() => navigation.navigate("courses")}
      >
        <Image
          source={require("../assets/images/courses.png")}
          style={styles.icon}
        />
        <Text style={styles.text}>Courses</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.navItem,
          active === "analytics" ? styles.activeItem : null,
        ]}
        onPress={() => navigation.navigate("report", { score: null })}
      >
        <Image
          source={require("../assets/images/analytics.png")}
          style={styles.icon}
        />
        <Text style={styles.text}>Analytics</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.navItem,
          active === "profile" ? styles.activeItem : null,
        ]}
        onPress={() => navigation.navigate("profile")}
      >
        <Image
          source={
            profileImageUrl
              ? { uri: profileImageUrl }
              : require("../assets/images/profile.png")
          }
          style={styles.icon}
        />
        <Text style={styles.text}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#14213D",
    height: 60,
  },
  navItem: {
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 24,
    height: 24,
    marginBottom: 5,
    borderRadius: 12,
  },
  text: {
    color: "white",
    fontSize: 12,
  },
  activeItem: {
    borderTopColor: "#FCA311",
    borderTopWidth: 6, // Increased from 5 to 6
    paddingTop: 5, // Decreased from 10 to 5
  },
});

export default Navbar;
