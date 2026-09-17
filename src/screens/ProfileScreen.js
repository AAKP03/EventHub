// src/screens/ProfileScreen.js
//
// "View profile" + "Log out" requirements.

import React from "react";
import { useRouter } from "expo-router";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../context/AuthContext";

export default function ProfileScreen() {
  const { profile, user, logOut } = useAuth();
  const router = useRouter();

  if (!profile) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {profile.name?.charAt(0)?.toUpperCase() || "?"}
        </Text>
      </View>

      <Text style={styles.name}>{profile.name}</Text>
      <Text style={styles.email}>{user?.email}</Text>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Phone</Text>
        <Text style={styles.infoValue}>{profile.phone || "Not set"}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Account type</Text>
        <Text style={styles.infoValue}>{profile.role}</Text>
      </View>

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => router.push("/edit-profile")}
      >
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={logOut}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, alignItems: "center" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#4f46e5",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 12,
  },
  avatarText: { color: "#fff", fontSize: 32, fontWeight: "700" },
  name: { fontSize: 20, fontWeight: "700" },
  email: { color: "#666", marginBottom: 20 },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  infoLabel: { color: "#888" },
  infoValue: { fontWeight: "600" },
  editButton: {
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#4f46e5",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: "100%",
    alignItems: "center",
  },
  editButtonText: { color: "#4f46e5", fontWeight: "700" },
  logoutButton: { marginTop: 12, paddingVertical: 12 },
  logoutText: { color: "#d33", fontWeight: "600" },
});
