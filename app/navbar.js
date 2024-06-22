import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Navbar = ({ active }) => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [pfpUrl, setPfpUrl] = useState(null);

  useEffect(() => {
    const initData = async () => {
    setUserData(JSON.parse(await AsyncStorage.getItem("docsnap")));
    setPfpUrl(await AsyncStorage.getItem("profileImage"));
    }
  
    initData();
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
        onPress={() => navigation.navigate("report")}
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
          source={{ uri: pfpUrl }}
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
    backgroundColor: "#4c3c90",
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
  },
  text: {
    color: "white",
    fontSize: 12,
  },
  activeItem: {
    borderTopColor: "#f15a29",
    borderTopWidth: 6, // Increased from 5 to 8
    paddingTop: 5, // Decreased from 10 to 5
  },
});

export default Navbar;
