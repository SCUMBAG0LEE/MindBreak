import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Load the Google Services JSON file
try {
  const googleServices = require('./google-services.json');
} catch (error) {
  console.error('Error loading google-services.json:', error);
  throw error;
}

// Extract the necessary configuration
try {
  const firebaseConfig = {
    apiKey: googleServices.client[0].api_key[0].current_key,
    appId: googleServices.client[0].client_info.mobilesdk_app_id,
    projectId: googleServices.project_info.project_id,
    storageBucket: googleServices.project_info.storage_bucket,
    messagingSenderId: googleServices.project_info.project_number,
  };
} catch (error) {
  console.error('Error extracting Firebase configuration:', error);
  throw error;
}

// Initialize Firebase with the extracted configuration
try {
  const app = initializeApp(firebaseConfig);
} catch (error) {
  console.error('Error initializing Firebase app:', error);
  throw error;
}

try {
  const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} catch (error) {
  console.error('Error initializing Firebase auth:', error);
  throw error;
}

try {
  const db = getFirestore(app);
} catch (error) {
  console.error('Error getting Firestore instance:', error);
  throw error;
}

try {
  const storage = getStorage(app);
} catch (error) {
  console.error('Error getting Storage instance:', error);
  throw error;
}

export { db, auth, storage };