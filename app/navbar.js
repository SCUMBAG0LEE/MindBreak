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

  const isActive = (path) => {
    return router.pathname === path;
  };

  return (
    <View style={styles.navbar}>
      <TouchableOpacity
        style={[styles.navItem, isActive("/home") && styles.activeNavItem]}
        onPress={() => handleNavigation("/home")}
      >
        <Image
          source={require("../assets/images/home.png")}
          style={[styles.icon, isActive("/home") && styles.activeIcon]}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.navItem, isActive("/courses") && styles.activeNavItem]}
        onPress={() => handleNavigation("/courses")}
      >
        <Image
          source={require("../assets/images/course.png")}
          style={[styles.icon, isActive("/courses") && styles.activeIcon]}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.navItem, isActive("/reports") && styles.activeNavItem]}
        onPress={() => handleNavigation("/reports")}
      >
        <Image
          source={require("../assets/images/reports.png")}
          style={[styles.icon, isActive("/reports") && styles.activeIcon]}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.navItem, isActive("/profile") && styles.activeNavItem]}
        onPress={() => handleNavigation("/profile")}
      >
        <Image
          source={require("../assets/images/profile.png")}
          style={[styles.icon, isActive("/profile") && styles.activeIcon]}
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
    backgroundColor: "black",
    borderTopWidth: 1,
    borderTopColor: "#444",
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 30,
    height: 30,
    opacity: 0.6,
  },
  activeNavItem: {
    backgroundColor: "#1a1a1a", // Color for active item
  },
  activeIcon: {
    opacity: 1, // Full opacity for active icon
  },
});
