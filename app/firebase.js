import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native"; // Import Alert from react-native for showing warnings/alerts

let app;
try {
  // Extract the necessary configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDRG9I3ConrJv4ZCgu2aAdTFA7XQTWZpQk",
    appId: "1:166811038954:android:1f8765812e544e89be5393",
    projectId: "devsauce-mindbreak",
    storageBucket: "devsauce-mindbreak.appspot.com",
    messagingSenderId: "166811038954",
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
