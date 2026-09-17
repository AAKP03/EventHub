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
  apiKey: "AIzaSyCJubk7yPtj0hSpK8ywJabzVAVLZLCAFcc",
  authDomain: "eventhub-44fc0.firebaseapp.com",
  projectId: "eventhub-44fc0",
  storageBucket: "eventhub-44fc0.firebasestorage.app",
  messagingSenderId: "749958001971",
  appId: "1:749958001971:web:06debb9c5fc79dc5e37a46",
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
