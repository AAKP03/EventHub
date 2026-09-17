// src/screens/SignUpScreen.js

import React, { useState } from "react";
import { useRouter } from "expo-router";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validatePhone,
  runValidators,
} from "../utils/validation";

export default function SignUpScreen() {
  const { signUp } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [role, setRole] = useState("attendee");

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [authError, setAuthError] = useState("");

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  }

  async function handleSubmit() {
    setAuthError("");

    const validationErrors = runValidators(
      {
        name: validateName,
        email: validateEmail,
        phone: validatePhone,
        password: validatePassword,
        confirmPassword: (v) => validateConfirmPassword(form.password, v),
      },
      form,
    );

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);

    try {
      await signUp({
        ...form,
        role,
      });
    } catch (err) {
      setAuthError(mapFirebaseError(err.code));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create your EventHub account</Text>

      <Field
        label="Full name"
        value={form.name}
        onChangeText={(v) => handleChange("name", v)}
        error={errors.name}
        autoCapitalize="words"
      />

      <Field
        label="Email"
        value={form.email}
        onChangeText={(v) => handleChange("email", v)}
        error={errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Field
        label="Phone (optional)"
        value={form.phone}
        onChangeText={(v) => handleChange("phone", v)}
        error={errors.phone}
        keyboardType="phone-pad"
      />

      <Field
        label="Password"
        value={form.password}
        onChangeText={(v) => handleChange("password", v)}
        error={errors.password}
        secureTextEntry
      />

      <Field
        label="Confirm password"
        value={form.confirmPassword}
        onChangeText={(v) => handleChange("confirmPassword", v)}
        error={errors.confirmPassword}
        secureTextEntry
      />

      <Text style={styles.roleLabel}>Account Type</Text>

      <View style={styles.roleContainer}>
        <TouchableOpacity
          style={[
            styles.roleButton,
            role === "attendee" && styles.selectedRole,
          ]}
          onPress={() => setRole("attendee")}
        >
          <Text
            style={[
              styles.roleButtonText,
              role === "attendee" && styles.selectedRoleText,
            ]}
          >
            Attendee
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.roleButton,
            role === "organizer" && styles.selectedRole,
          ]}
          onPress={() => setRole("organizer")}
        >
          <Text
            style={[
              styles.roleButtonText,
              role === "organizer" && styles.selectedRoleText,
            ]}
          >
            Organizer
          </Text>
        </TouchableOpacity>
      </View>

      {authError ? <Text style={styles.authError}>{authError}</Text> : null}

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={styles.link}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Field({ label, error, ...inputProps }) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        style={[styles.input, error && styles.inputError]}
        {...inputProps}
      />

      {error ? <Text style={styles.fieldError}>{error}</Text> : null}
    </View>
  );
}

function mapFirebaseError(code) {
  switch (code) {
    case "auth/email-already-in-use":
      return "An account with this email already exists.";

    case "auth/invalid-email":
      return "That email address looks invalid.";

    case "auth/weak-password":
      return "Password is too weak.";

    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";

    default:
      return "Something went wrong. Please try again.";
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
    justifyContent: "center",
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 24,
  },

  fieldGroup: {
    marginBottom: 14,
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
    color: "#333",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },

  inputError: {
    borderColor: "#d33",
  },

  fieldError: {
    color: "#d33",
    fontSize: 12,
    marginTop: 4,
  },

  roleLabel: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },

  roleContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },

  roleButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#fff",
  },

  selectedRole: {
    backgroundColor: "#4f46e5",
    borderColor: "#4f46e5",
  },

  roleButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },

  selectedRoleText: {
    color: "#fff",
  },

  authError: {
    color: "#d33",
    marginBottom: 12,
    textAlign: "center",
  },

  button: {
    backgroundColor: "#4f46e5",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },

  link: {
    color: "#4f46e5",
    textAlign: "center",
    marginTop: 16,
  },
});
