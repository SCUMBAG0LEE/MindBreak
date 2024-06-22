import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useRouter } from "expo-router";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
<<<<<<< Updated upstream
=======
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase"; // Assuming you have imported your Firebase configuration correctly
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
>>>>>>> Stashed changes

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
<<<<<<< Updated upstream
=======
  const [confirmPassword, setConfirmPassword] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [secureTextEntry, setSecureTextEntry] = useState(true); // State to toggle secure text entry for password
  const [showConfirmPassword, setShowConfirmPassword] = useState(true); // State to toggle visibility of confirm password
  const [showUploadImage, setShowUploadImage] = useState(true);
>>>>>>> Stashed changes

  const auth = getAuth();

  // Function to pick an image from the device gallery
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.cancelled) {
      if (result.assets && result.assets.length > 0) {
        const pickedImage = result.assets[0];
        setImageUri(pickedImage.uri);
        setShowUploadImage(false);
        console.log("done")
      } else {
        console.log("No image selected");
      }
    }
  };

  // Function to get the file format extension from the image URI
  const getImageFormat = (imageUri) => {
    const filename = imageUri.substring(imageUri.lastIndexOf('/') + 1);
    return filename.split('.').pop();
  };

  // Function to handle profile picture upload
  const handleProfilePictureUpload = async (user, imageUri) => {
    try {
      const tempName = user.uid + "." + getImageFormat(imageUri);
      const response = await fetch(imageUri);
      const blob = await response.blob();
  
      const storageRef = ref(storage, `profile_pictures/${tempName}`);
      await uploadBytes(storageRef, blob);
      
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      throw error;
    }
  };

  // Function to handle user registration
  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Invalid input", "Please fill all the fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Passwords do not match", "Please enter matching passwords");
      return;
    }

    if (!imageUri) {
      Alert.alert("Image Is Empty", "Please upload an image");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
<<<<<<< Updated upstream
=======

      // Upload profile picture if imageUri is set
      let profileImageUrl = null;
      if (imageUri) {
        profileImageUrl = await handleProfilePictureUpload(user, imageUri);
      }

      // Example: Saving additional user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        username: username,
        email: email,
        pfp: profileImageUrl,
      });

>>>>>>> Stashed changes
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

  // Function to toggle secure text entry of password fields
  const toggleSecureEntry = () => {
    setSecureTextEntry((prev) => !prev);
  };

  // Function to toggle visibility of confirm password
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  // Function to toggle visibility of Upload Image

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
              onPress={() => router.push("/login")}
            >
              <Text style={styles.backButtonText}>{"< Back"}</Text>
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
              <View style={styles.passwordContainer}>
                <TextInput
                  placeholder="Password"
                  style={styles.input}
                  placeholderTextColor="#bbb"
                  secureTextEntry={secureTextEntry}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  style={styles.toggleButton}
                  onPress={toggleSecureEntry}
                >
                  <Ionicons
                    name={secureTextEntry ? 'eye-outline' : 'eye-off-outline'}
                    size={24}
                    color="#f15a29"
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.passwordContainer}>
                <TextInput
                  placeholder="Confirm Password"
                  style={styles.input}
                  placeholderTextColor="#bbb"
                  secureTextEntry={showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity
                  style={styles.toggleButton}
                  onPress={toggleConfirmPasswordVisibility}
                >
                  <Ionicons
                    name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={24}
                    color="#f15a29"
                  />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              style={styles.signupButton}
              onPress={handleRegister}
            >
              <Text style={styles.signupText}>Sign up</Text>
            </TouchableOpacity>
            <TouchableOpacity
  style={[styles.signupButton, showUploadImage ? {} : styles.disabledButton]} // Apply styles based on tugawa condition
  onPress={pickImage}
  disabled={!showUploadImage} // Disable the button if tugawa is false
>
  <Text style={[styles.signupText, showUploadImage ? {} : styles.disabledButton]}>Upload Image</Text>
</TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <Text style={styles.footerText}>
        © All Right Reserved to de VSAUCE
      </Text>
    </View>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2d046e",
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
    backgroundColor: "#4c3c90",
    borderRadius: 5,
    position: "absolute",
    top: 60,
  },
  disabledButton: {
    backgroundColor: "black", // Adjust background color for disabled state
    color: "black",
    opacity: 0.5, // Adjust opacity for disabled state
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
  },
  subtitle: {
    color: "#bbb",
    fontSize: 16,
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
    width: "100%",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    position: 'relative',
  },
  toggleButton: {
    position: 'absolute',
    right: 10,
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
    bottom: 10,
    alignSelf: "center",
  },
});
