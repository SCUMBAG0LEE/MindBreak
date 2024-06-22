import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  SafeAreaView,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router"; // Import useRouter from Expo's router
import Navbar from "./navbar";
<<<<<<< Updated upstream
import { auth } from "./firebase.js"; // Import the auth instance

export default function Profile({ navigation }) {
  const [email, setEmail] = useState("");
=======
import * as ImagePicker from 'expo-image-picker';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, storage, auth, sendPasswordResetEmail } from "./firebase"; // Assuming you have imported your Firebase configuration correctly
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import * as FileSystem from 'expo-file-system';

export default function Profile({ navigation }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [dob, setDob] = useState("");
  const [school, setSchool] = useState("");
  const [grade, setGrade] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(null); // State to store profile image URL
  const [resetEmail, setResetEmail] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
>>>>>>> Stashed changes
  const router = useRouter();
  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
<<<<<<< Updated upstream
    const getEmail = async () => {
      const storedEmail = await AsyncStorage.getItem("email");
      if (storedEmail) {
        setEmail(storedEmail);
=======
    const initializeData = async () => {
      try {
        // Function to fetch and set email from AsyncStorage
        const getEmail = async () => {
          try {
            const storedEmail = await AsyncStorage.getItem("email");
            if (storedEmail) {
              setEmail(storedEmail);
            }
          } catch (error) {
            console.error('Error fetching email from AsyncStorage:', error);
          }
        };

        // Execute getEmail and checkLocalImage in sequence
        await getEmail();
        const cachedPfp = await AsyncStorage.getItem("pfp")
        if(cachedPfp) {
          setProfileImageUrl(cachedPfp);
        }

      } catch (error) {
        console.error('Error initializing data:', error);
>>>>>>> Stashed changes
      }
    };

    initializeData();
  }, []);

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

      deleteLocalImage(profileImageUrl);
      downloadImage(imageUrl);
      setImageUri(null);
    } catch (error) {
      console.error("Error updating profile picture:", error);
      Alert.alert("Upload failed", "An error occurred while updating the profile picture.");
    }
  };

  const downloadImage = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      const contentType = response.headers.get('content-type');

      if (contentType) {
        const fileExtension = contentType.split('/').pop(); // Extract file extension from content-type
        const fileUri = FileSystem.documentDirectory + `pfp.${fileExtension}`;
        await AsyncStorage.setItem("pfp", fileUri);
        setProfileImageUrl(fileUri);

        const fileBlob = await response.blob();
        const reader = new FileReader();
        reader.onload = async () => {
          const base64Data = reader.result;

          await FileSystem.writeAsStringAsync(fileUri, base64Data.split(',')[1], {
            encoding: FileSystem.EncodingType.Base64,
          });

          console.log('Image downloaded to:', fileUri);
        };
        reader.readAsDataURL(fileBlob);
      } else {
        console.error('Failed to determine content-type');
      }
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const deleteLocalImage = async (imageUri) => {
    try {
      if (imageUri) {
        await FileSystem.deleteAsync(imageUri);
        console.log('Deleted local image:', imageUri);
        setImageUri(null); // Clear imageUri state after deletion
      } else {
        console.log('No local image to delete');
      }
    } catch (error) {
      console.error('Error deleting local image:', error);
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

  const handleLogout = async () => {
<<<<<<< Updated upstream
    await auth.signOut(); // Sign out the user
    await AsyncStorage.removeItem("email"); // Remove the email from storage
    router.push("/login"); // Navigate to login screen
=======
    await auth.signOut();
    await AsyncStorage.removeItem("email");
    await AsyncStorage.removeItem("docsnap")
    deleteLocalImage(profileImageUrl);
    router.push("/login");
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
  // const handleBack = () => {
  //   router.goBack();
  // };
=======
    // Function to handle profile picture upload
    const handleProfilePictureUpload = async (user, imageUri) => {
      try {
        // await deleteFilesWithPrefix(user.uid + ".")
  
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

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);
>>>>>>> Stashed changes

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>{"< Back"}</Text>
        </TouchableOpacity> */}
        <View style={styles.profileContainer}>
          <Image
            source={require("../assets/images/profile.png")}
            style={styles.avatar}
          />
          {/* <Text style={styles.title}>{username}</Text> */}
          <Text style={styles.email}>{email}</Text>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>10</Text>
            <Text style={styles.statLabel}>Courses</Text>
          </View>
<<<<<<< Updated upstream
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Quizzes</Text>
=======

          <View style={styles.profileContainer}>
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
            <Text style={styles.email}>{email}</Text>
            <TouchableOpacity
        style={styles.backButton}
        onPress={pick}>
        <Text style={styles.backButtonText}>Change Image</Text>
      </TouchableOpacity>
>>>>>>> Stashed changes
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>15</Text>
            <Text style={styles.statLabel}>Hours Spent</Text>
          </View>
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Log out</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteAccount}
          >
            <Text style={styles.deleteText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Navbar active="profile" />
    </SafeAreaView>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  backButton: {
    alignSelf: "flex-start",
    padding: 10,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#2d046e",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  email: {
    color: "white",
    fontSize: 16,
    marginTop: 5,
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
    marginBottom: 20,
  },
  statBox: {
    alignItems: "center",
    flex: 1,
    marginHorizontal: 10,
  },
  statNumber: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  statLabel: {
    color: "white",
    fontSize: 16,
  },
  buttonsContainer: {
    alignItems: "center",
    width: "100%",
    marginTop: 20,
  },
  logoutButton: {
    backgroundColor: "#f15a29",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: "#f15a29",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  logoutText: {
    color: "white",
    fontSize: 16,
  },
  deleteText: {
    color: "white",
    fontSize: 16,
  },
  navbar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
});
