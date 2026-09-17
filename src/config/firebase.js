// src/config/firebase.js
//
// Initializes Firebase for the app. Get these values from:
// Firebase Console -> Project Settings -> General -> Your apps -> Web app config
//
// Docs: https://firebase.google.com/docs/web/setup

import { initializeApp, getApps, getApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Prevent re-initializing if this file is re-imported (hot reload safety)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Auth must persist the session using AsyncStorage on React Native,
// otherwise the user gets logged out every time the app restarts.
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} catch (e) {
  // initializeAuth throws if already called (e.g. fast refresh) - fall back safely
  auth = getAuth(app);
}

const db = getFirestore(app);

export { app, auth, db };
