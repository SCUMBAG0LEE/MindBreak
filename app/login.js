import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Alert,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const router = useRouter();
  const auth = getAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [keyboardOpen, setKeyboardOpen] = useState(false); // State to track keyboard visibility

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => {
        setKeyboardOpen(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setKeyboardOpen(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    const getEmail = async () => {
      const storedEmail = await AsyncStorage.getItem("email");
      if (storedEmail) {
        router.push("/home");
      }
    };

    getEmail();
  }, []);

  const handleLogin = async () => {
    try {
      if (email === "" || password === "") {
        throw new Error("Email and password cannot be empty");
      }

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await AsyncStorage.setItem("email", user.email);
      router.push("/home");
    } catch (error) {
      let errorMessage = "An error occurred";

      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
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
      Alert.alert(
        "Password Reset Email Sent",
        "Check your email to reset your password."
      );
    } catch (error) {
      console.error("Error sending password reset email:", error);
      Alert.alert(
        "Error",
        "Failed to send password reset email. Please try again later."
      );
    }
  };

  if (isForgotPassword) {
    return (
      <View style={styles.container}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.content}>
              <Text style={styles.title}>Forgot Password</Text>
              <TextInput
                placeholder="Enter your email"
                style={styles.input}
                placeholderTextColor="#bbb"
                value={resetEmail}
                onChangeText={setResetEmail}
              />
              <TouchableOpacity
                style={styles.resetButton}
                onPress={handleForgotPassword}
              >
                <Text style={styles.resetText}>Send Reset Email</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setIsForgotPassword(false)}
              >
                <Text style={styles.backButtonText}>Back to Login</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
        {/* Copyright Text */}
        {!keyboardOpen && (
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              © All Right Reserved to de VSAUCE
            </Text>
          </View>
        )}
      </View>
    );
  }

  if (isLoggedIn) {
    return null;
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.content}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.push("/landing")}
            >
              <Text style={styles.backButtonText}>{"< Back"}</Text>
            </TouchableOpacity>
            <Image
              source={require("../assets/images/logo.png")}
              style={styles.logo}
            />
            <Text style={styles.title}>Login</Text>
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
              style={styles.forgotPassword}
              onPress={() => setIsForgotPassword(true)}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/register")}>
              <Text style={styles.registerText}>
                Don't have an account? Register
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      {/* Copyright Text */}
      {!keyboardOpen && (
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © All Right Reserved to de VSAUCE
          </Text>
        </View>
      )}
    </View>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    width: width,
    height: height,
  },
  keyboardAvoidingView: {
    flex: 1,
    width: "100%",
  },
  content: {
    alignItems: "center",
    padding: 20,
    flex: 1,
    justifyContent: "center",
  },
  backButton: {
    alignSelf: "flex-start",
    padding: 10,
    marginLeft: 10,
    backgroundColor: "#f15a29",
    borderRadius: 5,
    position: "absolute",
    top: 60,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
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
  resetButton: {
    backgroundColor: "#f15a29",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginVertical: 20,
  },
  resetText: {
    color: "white",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: "#bbb",
    textDecorationLine: "underline",
  },
  loginButton: {
    backgroundColor: "#f15a29",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginVertical: 20,
  },
  loginText: {
    color: "white",
  },
  registerText: {
    color: "white",
    textDecorationLine: "underline",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "black",
    alignItems: "center",
  },
  footerText: {
    color: "#bbb",
    alignSelf: "center",
    paddingBottom: 10,
  },
});
