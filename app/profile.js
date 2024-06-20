import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, storage, auth } from "./firebase"; // Assuming you have imported your Firebase configuration correctly
import { Audio } from 'expo-av';
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

export default function Profile({ navigation }) {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState(null); // State to store profile image URL
  const soundObject = new Audio.Sound();
  const [imageUri, setImageUri] = useState(null);

  async function deleteFilesWithPrefix(prefix) {
    const storageRef = ref(storage, 'profile_picture');
  
    // List all items in the 'profile_picture' folder
    const listResult = await listAll(storageRef);
  
    // Iterate through each item and delete if its name starts with 'shit.'
    const deletePromises = listResult.items.map(item => {
      if (item.name.startsWith(prefix)) {
        return item.delete();
      }
      return Promise.resolve();
    });
  
    // Wait for all deletions to complete
    await Promise.all(deletePromises);
  
    console.log('All files with prefix "'+ prefix +'" deleted successfully.');
  }  

  const updatePfp = async () => {
    try {
      if (!imageUri) {
        Alert.alert("No image selected", "Please pick an image.");
        return;
      }


      const imageUrl = await handleProfilePictureUpload(auth.currentUser, imageUri);
      const existingImageName = auth.currentUser ? `profile_pictures/${auth.currentUser.uid}` : ''; // Adjust path and name as per your setup

      if (!existingImageName) {
        Alert.alert("User not authenticated", "User information not available.");
        return;
      }

      // Update Firestore with the new image URL
      await setDoc(doc(db, "users", auth.currentUser.uid), {
        pfp: imageUrl,
      });

      setProfileImageUrl(imageUrl);
      setImageUri(null);
    } catch (error) {
      console.error("Error updating profile picture:", error);
      Alert.alert("Upload failed", "An error occurred while updating the profile picture.");
    }
  };

  const pick = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.cancelled) {
        // If result.assets is an array (typically with a single item for a single image pick)
        if (result.assets && result.assets.length > 0) {
          const pickedImage = result.assets[0];
          setImageUri(pickedImage.uri);
          updatePfp();
        } else {
          console.log("No image selected");
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Image picking failed", "An error occurred while picking an image.");
    }
  };

  const getImageFormat = (imageUri) => {
    if (!imageUri) return ''; // Handle case where imageUri is not provided

    // Get the last segment after the last '/'
    const filename = imageUri.substring(imageUri.lastIndexOf('/') + 1);
  
    // Get the file extension after the last '.'
    const format = filename.substring(filename.lastIndexOf('.') + 1);
  
    return format;
  };
  
  // Function to handle profile picture upload
  const handleProfilePictureUpload = async (user, imageUri) => {
    try {
      await deleteFilesWithPrefix(user.uid + ".")

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

  useFocusEffect(
    React.useCallback(() => {
      console.log('Profile screen is focused');
      const playBackgroundMusic = async () => {
        try {
          await soundObject.loadAsync(require('../assets/stuff.mp3'));
          await soundObject.playAsync();
          // You can also set looping and other options as needed
          soundObject.setIsLoopingAsync(true);
        } catch (error) {
          console.error('Error playing background music:', error);
        }
      };
  
      playBackgroundMusic();

      return () => {
        console.log('Profile screen is unfocused');
        soundObject.unloadAsync(); // Clean up on unmount
      };
    }, [])
  );

  useEffect(() => {
    const getEmail = async () => {
      const storedEmail = await AsyncStorage.getItem("email");
      if (storedEmail) {
        setEmail(storedEmail);
      }
    };

    getEmail();

    // Fetch profile image URL from Firestore
    const fetchProfileImage = async () => {
      try {
        const docRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          if (userData.pfp) {
            setProfileImageUrl(userData.pfp);
          }
        }
      } catch (error) {
        console.error("Error fetching profile image:", error);
      }
    };

    fetchProfileImage();
  }, []);

  const handleLogout = async () => {
    await auth.signOut(); // Sign out the user
    await AsyncStorage.removeItem("email"); // Remove the email from storage
    router.push("/login"); // Navigate to login screen
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const user = auth.currentUser;
              await user.delete(); // Delete the user's account instance
              await AsyncStorage.removeItem("email"); // Remove the email from storage
              router.push("/login"); // Navigate to login screen
            } catch (error) {
              console.error("Error deleting account:", error);
            }
          },
        },
      ]
    );
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

  return (
    <View style={styles.container}>
      <View style={styles.profileInfo}>
        {profileImageUrl ? (
          <Image
            source={{ uri: profileImageUrl }}
            style={styles.avatar}
          />
        ) : (
          <Image
            source={require("../assets/images/profile.png")} // Placeholder image if profileImageUrl is not available
            style={styles.avatar}
          />
        )}
        <Text style={styles.title}>Welcome, {email}!</Text>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
        <Text style={styles.deleteText}>Delete Account</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={() => setIsForgotPassword(true)}>
        <Text style={styles.logoutText}>Change Password</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={pick}>
        <Text style={styles.logoutText}>Change Profile Picture</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2d046e",
    justifyContent: "center",
    alignItems: "center",
  },
  profileInfo: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  logoutButton: {
    backgroundColor: "#f15a29",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  deleteButton: {
    backgroundColor: "#f15a29",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  logoutText: {
    color: "white",
  },
  deleteText: {
    color: "white",
  },
});
