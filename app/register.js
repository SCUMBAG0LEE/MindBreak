import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const auth = getAuth();

  const handleRegister = async () => {
    try {
      if (email && password) {
        try {
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          const user = userCredential.user;
          Alert.alert("Registration successful", "You can now log in");
          router.push("/login");
        } catch (error) {
          Alert.alert("Error", error.message);
        }
      } else {
        Alert.alert("Invalid input", "Please fill all the fields");
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          try {
            router.push("/login");
          } catch (error) {
            Alert.alert("Error", "Failed to navigate to login page");
          }
        }}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <Image
        source={require("../assets/images/logo.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Good to have you join us!</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          style={styles.input}
          placeholderTextColor="#bbb"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Password"
          style={styles.input}
          placeholderTextColor="#bbb"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <TouchableOpacity
        style={styles.signupButton}
        onPress={handleRegister}
      >
        <Text style={styles.signupText}>Sign up</Text>
      </TouchableOpacity>
      <Text style={styles.footerText}>© All Right Reserved to de VSAUCE</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2d046e",
    alignItems: "center",
    padding: 20,
  },
  backButton: {
    alignSelf: "flex-start",
    padding: 10,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
  },
  logo: {
    width: 80,
    height: 80,
    marginVertical: 40,
  },
  title: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#bbb",
    fontSize: 16,
    marginBottom: 40,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#4c3c90",
    color: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  signupButton: {
    backgroundColor: "#f15a29",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginVertical: 20,
  },
  signupText: {
    color: "white",
  },
  footerText: {
    color: "#bbb",
    position: "absolute",
    bottom: 20,
  },
});