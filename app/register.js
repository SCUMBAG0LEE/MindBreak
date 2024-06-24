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
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useRouter } from "expo-router";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase"; // Assuming you have imported your Firebase configuration correctly
import * as ImagePicker from "expo-image-picker";

export default function Register() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false); // State to track keyboard visibility
  const auth = getAuth();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.cancelled) {
      if (result.assets && result.assets.length > 0) {
        const pickedImage = result.assets[0];
        setImageUri(pickedImage.uri);
      } else {
        console.log("No image selected");
      }
    }
  };

  const getImageFormat = (imageUri) => {
    const filename = imageUri.substring(imageUri.lastIndexOf("/") + 1);
    const format = filename.substring(filename.lastIndexOf(".") + 1);
    return format;
  };

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

  const handleRegister = async () => {
    if (!email || !password || !username || !imageUri) {
      Alert.alert(
        "Invalid input",
        "Please fill all the fields and pick an image"
      );
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      try {
        const imageUrl = await handleProfilePictureUpload(user, imageUri);
        await setDoc(doc(db, "users", user.uid), {
          username: username,
          email: email,
          pfp: imageUrl,
        });

        console.log("Firestore document updated successfully.");
      } catch (error) {
        console.error("Error updating Firestore document:", error);
        throw error;
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
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.content}>
            <TouchableOpacity
              style={[styles.backButton, { backgroundColor: "#f15a29" }]}
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
              <TextInput
                placeholder="Password"
                style={styles.input}
                placeholderTextColor="#bbb"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                <Text style={styles.uploadText}>Pick an Image</Text>
              </TouchableOpacity>
              {imageUri && (
                <Image source={{ uri: imageUri }} style={styles.imagePreview} />
              )}
            </View>
            <TouchableOpacity
              style={styles.signupButton}
              onPress={handleRegister}
            >
              <Text style={styles.signupText}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      {!keyboardVisible && (
        <Text style={styles.footerText}>© All Right Reserved to de VSAUCE</Text>
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
    backgroundColor: "#4c3c90",
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
  },
  uploadButton: {
    backgroundColor: "#4c3c90",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  uploadText: {
    color: "white",
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginTop: 10,
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
