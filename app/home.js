import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Home() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    const getEmail = async () => {
      const storedEmail = await AsyncStorage.getItem("email");
      if (storedEmail) {
        setEmail(storedEmail);
      }
    };

    getEmail();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome, {email}!</Text>
        <TouchableOpacity onPress={handleAvatarPress}>
          <Image
            source={require("../assets/images/profile.png")}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  function handleAvatarPress() {
    if (email === "") {
      router.push("/login");
    } else {
      router.push("/profile");
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2d046e",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
  },
  welcomeText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
