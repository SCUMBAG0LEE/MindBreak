import React from "react";
import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Navbar() {
  const router = useRouter();

  const handleNavigation = (path) => {
    if (router.pathname !== path) {
      router.push(path);
    }
  };

  return (
    <View style={styles.navbar}>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => handleNavigation("/home")}
      >
        <Image
          source={require("../assets/images/home-icon.png")}
          style={styles.icon}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => handleNavigation("/courses")}
      >
        <Image
          source={require("../assets/images/course-icon.png")}
          style={styles.icon}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => handleNavigation("/profile")}
      >
        <Image
          source={require("../assets/images/profile-icon.png")}
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 60,
    backgroundColor: "#2d046e",
    borderTopWidth: 1,
    borderTopColor: "#444",
  },
  navItem: {
    flex: 1,
    alignItems: "center",
  },
  icon: {
    width: 30,
    height: 30,
  },
});
