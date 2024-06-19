import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase"; // Assuming you have imported your Firebase configuration correctly

export default function Register() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = getAuth();

  // Function to handle profile picture upload
  const handleProfilePictureUpload = async (user, imageUri) => {
    try {
      const storageRef = ref(storage, `profile_pictures/${user.uid}`);
      await uploadBytes(storageRef, imageUri);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL; // Return the download URL
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      throw error; // Propagate the error
    }
  };

  const handleRegister = async () => {
    if (!email || !password || !username) {
      Alert.alert("Invalid input", "Please fill all the fields");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user; // Capture the user object here

      try {

        // After profile picture upload is successful, update Firestore document
        const imageUrl = await handleProfilePictureUpload(user);
        await setDoc(doc(db, "users", user.uid), {
          username: username,
          email: email,
          pfp: imageUrl, // Use the downloaded URL
        });

        console.log("Firestore document updated successfully.");
      } catch (error) {
        console.error("Error updating Firestore document:", error);
        // Handle error if needed
      }

      Alert.alert("Registration successful", "You can now log in");
      router.push("/login");
    } catch (error) {
      let errorMessage = "An error occurred. Please try again.";

      if (error.code === "auth/weak-password") {
        errorMessage = "The password is too weak.";
      } else if (error.code === "auth/email-already-in-use") {
        errorMessage = "The email address is already in use.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "The email address is invalid.";
      } else {
        errorMessage = error.message;
      }

      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("/login")}
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
          placeholder="Username"
          style={styles.input}
          placeholderTextColor="#bbb"
          value={username}
          onChangeText={setUsername}
        />
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
      <TouchableOpacity style={styles.signupButton} onPress={handleRegister}>
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
