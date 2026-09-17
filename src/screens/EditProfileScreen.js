// src/screens/EditProfileScreen.js
//
// "Update profile" requirement.

import React, { useState } from "react";
import { useRouter } from "expo-router";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import {
  validateName,
  validatePhone,
  runValidators,
} from "../utils/validation";

export default function EditProfileScreen() {
  const { profile, updateUserProfile } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    name: profile?.name || "",
    phone: profile?.phone || "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  }

  async function handleSave() {
    const validationErrors = runValidators(
      { name: validateName, phone: validatePhone },
      form,
    );
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      await updateUserProfile(form);
      router.back();
    } catch (err) {
      Alert.alert(
        "Update failed",
        "Could not save your changes. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Full name</Text>
        <TextInput
          style={[styles.input, errors.name && styles.inputError]}
          value={form.name}
          onChangeText={(v) => handleChange("name", v)}
          autoCapitalize="words"
        />
        {errors.name ? (
          <Text style={styles.fieldError}>{errors.name}</Text>
        ) : null}
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={[styles.input, errors.phone && styles.inputError]}
          value={form.phone}
          onChangeText={(v) => handleChange("phone", v)}
          keyboardType="phone-pad"
        />
        {errors.phone ? (
          <Text style={styles.fieldError}>{errors.phone}</Text>
        ) : null}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleSave}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Save Changes</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 24 },
  fieldGroup: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: "600", marginBottom: 4, color: "#333" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  inputError: { borderColor: "#d33" },
  fieldError: { color: "#d33", fontSize: 12, marginTop: 4 },
  button: {
    backgroundColor: "#4f46e5",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});
