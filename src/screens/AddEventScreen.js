import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import { useRouter } from "expo-router";
import { API_BASE_URL } from "../config/api";

export default function AddEventScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [totalSeats, setTotalSeats] = useState("");
  const [saving, setSaving] = useState(false);

  const handleAddEvent = async () => {
    if (saving) {
      return;
    }

    if (
      !name.trim() ||
      !description.trim() ||
      !date.trim() ||
      !time.trim() ||
      !location.trim() ||
      !category.trim() ||
      !price.trim() ||
      !totalSeats.trim()
    ) {
      Alert.alert("Validation Error", "Please fill in all required fields.");
      return;
    }

    const eventPrice = Number(price);
    const seats = Number(totalSeats);

    if (isNaN(eventPrice) || eventPrice < 0) {
      Alert.alert("Validation Error", "Please enter a valid price.");
      return;
    }

    if (!Number.isInteger(seats) || seats < 1) {
      Alert.alert("Validation Error", "Total seats must be at least 1.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(`${API_BASE_URL}/api/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          image: image.trim(),
          description: description.trim(),
          date: date.trim(),
          time: time.trim(),
          location: location.trim(),
          category: category.trim(),
          price: eventPrice,
          totalSeats: seats,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create event");
      }

      Alert.alert("Event Created", "The event has been added successfully.", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error("Create event error:", error);

      Alert.alert("Error", error.message || "Unable to create the event.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Add Event</Text>

        <Text style={styles.label}>Event Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter event name"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Image URL</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter image URL"
          value={image}
          onChangeText={setImage}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter event description"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <Text style={styles.label}>Date</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 2026-10-15"
          value={date}
          onChangeText={setDate}
        />

        <Text style={styles.label}>Time</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 6:00 PM"
          value={time}
          onChangeText={setTime}
        />

        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter event location"
          value={location}
          onChangeText={setLocation}
        />

        <Text style={styles.label}>Category</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Music, Sports, Workshop"
          value={category}
          onChangeText={setCategory}
        />

        <Text style={styles.label}>Price (LKR)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter ticket price"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />

        <Text style={styles.label}>Total Seats</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter total seats"
          keyboardType="numeric"
          value={totalSeats}
          onChangeText={setTotalSeats}
        />

        <TouchableOpacity
          style={[styles.button, saving && styles.disabledButton]}
          onPress={handleAddEvent}
          disabled={saving}
        >
          {saving ? (
            <>
              <ActivityIndicator color="white" />
              <Text style={styles.buttonText}>Adding Event...</Text>
            </>
          ) : (
            <Text style={styles.buttonText}>Add Event</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  content: {
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 25,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 10,
  },

  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
  },

  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },

  button: {
    backgroundColor: "#000",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    marginBottom: 30,
    minHeight: 55,
  },

  disabledButton: {
    opacity: 0.6,
  },

  buttonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 4,
  },
});
