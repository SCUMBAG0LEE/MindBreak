import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const router = useRouter();
  const auth = getAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Add this state
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const handleLogin = async () => {
    try {
      if (email === "" || password === "") {
        throw new Error("Email and password cannot be empty");
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Save email to AsyncStorage
      await AsyncStorage.setItem("email", user.email);
      
      // Navigate to home screen
      router.push("/home");
      
    } catch (error) {
      let errorMessage = "An error occurred";
      
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        errorMessage = "Invalid email or password";
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert("Error", errorMessage);
    }
  };

  const handleForgotPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      Alert.alert("Password Reset Email Sent", "Check your email to reset your password.");
    } catch (error) {
      console.error('Error sending password reset email:', error);
      Alert.alert("Error", "Failed to send password reset email. Please try again later.");
    }
  };
  

  if (isForgotPassword) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Forgot Password</Text>
        <TextInput
          placeholder="Enter your email"
          style={styles.input}
          placeholderTextColor="#bbb"
          value={resetEmail}
          onChangeText={setResetEmail}
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleForgotPassword}>
          <Text style={styles.loginText}>Send Reset Email</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.createAccountButton} onPress={() => setIsForgotPassword(false)}>
          <Text style={styles.createAccountText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }  

  if (isLoggedIn) {
    // If user is already logged in, don't render the login form
    return null;
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/logo.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>Log in</Text>
      <Text style={styles.subtitle}>Welcome back!</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          style={styles.input}
          placeholderTextColor="#bbb"
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
      <Text style={styles.forgotPassword} onPress={() => setIsForgotPassword(true)}>Forgot Password?</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.createAccountButton}
          onPress={() => router.push("/register")}
        >
          <Text style={styles.createAccountText}>Create account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>Log in</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.orContinueWith}>Or continue with</Text>
      <View style={styles.socialButtonsContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <Image
            source={require("../assets/images/google.png")}
            style={styles.socialIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Image
            source={require("../assets/images/email.png")}
            style={styles.socialIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Image
            source={require("../assets/images/facebook.png")}
            style={styles.socialIcon}
          />
        </TouchableOpacity>
      </View>
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
  forgotPassword: {
    color: "#bbb",
    alignSelf: "flex-end",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  createAccountButton: {
    backgroundColor: "#4c3c90",
    padding: 15,
    borderRadius: 10,
  },
  createAccountText: {
    color: "white",
  },
  loginButton: {
    backgroundColor: "#f15a29",
    padding: 15,
    borderRadius: 10,
  },
  loginText: {
    color: "white",
  },
  orContinueWith: {
    color: "#bbb",
    marginVertical: 20,
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
    marginBottom: 20,
  },
  socialButton: {
    backgroundColor: "#4c3c90",
    padding: 10,
    borderRadius: 10,
  },
  socialIcon: {
    width: 30,
    height: 30,
  },
  footerText: {
    color: "#bbb",
    position: "absolute",
    bottom: 20,
  },
});
