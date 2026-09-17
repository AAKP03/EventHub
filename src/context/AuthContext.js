import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile as updateFirebaseAuthProfile,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        setUser(firebaseUser);

        if (firebaseUser) {
          const userRef = doc(db, "users", firebaseUser.uid);
          const snap = await getDoc(userRef);

          if (snap.exists()) {
            setProfile(snap.data());
          } else {
            // Create a profile if the Firebase Auth user
            // exists but the Firestore document does not.
            const newProfile = {
              name: firebaseUser.displayName || "",
              email: firebaseUser.email || "",
              phone: "",
              role: "attendee",
              createdAt: serverTimestamp(),
            };

            await setDoc(userRef, newProfile);
            setProfile(newProfile);
          }
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.log("Firestore profile error:", error);

        // Authentication can still work even if Firestore
        // temporarily fails.
        setProfile({
          name: firebaseUser?.displayName || "",
          email: firebaseUser?.email || "",
          phone: "",
          role: "attendee",
        });
      } finally {
        setInitializing(false);
      }
    });

    return unsubscribe;
  }, []);

  async function signUp({ name, email, password, phone }) {
    const credential = await createUserWithEmailAndPassword(
      auth,
      email.trim(),
      password,
    );

    await updateFirebaseAuthProfile(credential.user, {
      displayName: name.trim(),
    });

    const profileData = {
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : "",
      role: "attendee",
      createdAt: serverTimestamp(),
    };

    await setDoc(doc(db, "users", credential.user.uid), profileData);

    setProfile(profileData);

    return credential.user;
  }

  async function logIn({ email, password }) {
    const credential = await signInWithEmailAndPassword(
      auth,
      email.trim(),
      password,
    );

    return credential.user;
  }

  async function logOut() {
    await signOut(auth);
  }

  async function updateUserProfile(updates) {
    if (!user) {
      throw new Error("No authenticated user.");
    }

    const cleanUpdates = {
      ...updates,
    };

    await updateDoc(doc(db, "users", user.uid), cleanUpdates);

    if (updates.name) {
      await updateFirebaseAuthProfile(user, {
        displayName: updates.name.trim(),
      });
    }

    setProfile((prev) => ({
      ...prev,
      ...updates,
    }));
  }

  const value = {
    user,
    profile,
    initializing,
    signUp,
    logIn,
    logOut,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return ctx;
}
