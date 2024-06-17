import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Load the Google Services JSON file
const googleServices = require('./google-services.json');

// Extract the necessary configuration
const firebaseConfig = {
  apiKey: googleServices.client[0].api_key[0].current_key,
  appId: googleServices.client[0].client_info.mobilesdk_app_id,
  projectId: googleServices.project_info.project_id,
  storageBucket: googleServices.project_info.storage_bucket,
  messagingSenderId: googleServices.project_info.project_number,
};

// Initialize Firebase with the extracted configuration
const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
const db = getFirestore(app);
const storage = getStorage(app);

export { db, auth, storage };