import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native"; // Import Alert from react-native for showing warnings/alerts

// Load the Google Services JSON file
let googleServices;
try {
  googleServices = require("../assets/google-services.json");
} catch (error) {
  console.error("No google-services.json found:", error);
  Alert.alert(
    "Warning",
    "No google-services.json detected. Firebase services may not be initialized properly.",
    [{ text: "OK", onPress: () => console.log("OK Pressed") }]
  );
}

let app;
try {
  // Extract the necessary configuration
  const firebaseConfig = {
    apiKey: googleServices.client[0].api_key[0].current_key,
    appId: googleServices.client[0].client_info.mobilesdk_app_id,
    projectId: googleServices.project_info.project_id,
    storageBucket: googleServices.project_info.storage_bucket,
    messagingSenderId: googleServices.project_info.project_number,
  };

  // Initialize Firebase with the extracted configuration
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.error("Error initializing Firebase app:", error);
  // Handle initialization error, e.g., notify the user or fallback logic
  // throw error; // Optionally rethrow if needed
}

let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (error) {
  console.error("Error initializing Firebase Auth:", error);
  // Handle auth initialization error
  // throw error; // Optionally rethrow if needed
}

let db;
try {
  db = getFirestore(app);
} catch (error) {
  console.error("Error getting Firestore instance:", error);
  // Handle Firestore initialization error
  // throw error; // Optionally rethrow if needed
}

let storage;
try {
  storage = getStorage(app);
} catch (error) {
  console.error("Error getting Firebase Storage instance:", error);
  // Handle Storage initialization error
  // throw error; // Optionally rethrow if needed
}

export { db, auth, storage };
