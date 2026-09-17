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

import { useLocalSearchParams, useRouter } from "expo-router";
import { API_BASE_URL } from "../config/api";
import { useAuth } from "../context/AuthContext";

export default function BookingScreen() {
  const router = useRouter();
  const { eventId } = useLocalSearchParams();
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [seats, setSeats] = useState("1");
  const [bookingLoading, setBookingLoading] = useState(false);

  const handleBooking = async () => {
    if (bookingLoading) {
      return;
    }

    if (!name.trim()) {
      Alert.alert("Validation Error", "Please enter your name.");
      return;
    }

    if (!email.trim()) {
      Alert.alert("Validation Error", "Please enter your email.");
      return;
    }

    if (!phone.trim()) {
      Alert.alert("Validation Error", "Please enter your phone number.");
      return;
    }

    if (!seats.trim() || Number(seats) < 1) {
      Alert.alert("Validation Error", "Please enter a valid number of seats.");
      return;
    }

    Alert.alert(
      "Booking Details",
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nSeats: ${seats}`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: async () => {
            if (bookingLoading) {
              return;
            }

            try {
              if (!user) {
                Alert.alert("Error", "You must be logged in to book an event.");
                return;
              }

              setBookingLoading(true);

              const response = await fetch(`${API_BASE_URL}/api/bookings`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  eventId,
                  userId: user.uid,
                  name: name.trim(),
                  email: email.trim(),
                  phone: phone.trim(),
                  seats: Number(seats),
                }),
              });

              const data = await response.json();

              if (!response.ok) {
                throw new Error(data.message || "Booking failed");
              }

              Alert.alert(
                "Booking Confirmed",
                `Your booking has been confirmed.\n\nBooking ID: ${data.bookingId}`,
                [
                  {
                    text: "OK",
                    onPress: () => router.back(),
                  },
                ],
              );
            } catch (error) {
              console.error("Booking error:", error);

              Alert.alert(
                "Booking Failed",
                error.message || "Unable to complete the booking.",
              );
            } finally {
              setBookingLoading(false);
            }
          },
        },
      ],
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Book Event</Text>

        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <Text style={styles.label}>Number of Seats</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter number of seats"
          keyboardType="numeric"
          value={seats}
          onChangeText={setSeats}
        />

        <TouchableOpacity
          style={[
            styles.confirmButton,
            bookingLoading && styles.disabledButton,
          ]}
          onPress={handleBooking}
          disabled={bookingLoading}
        >
          {bookingLoading ? (
            <>
              <ActivityIndicator color="white" />
              <Text style={styles.confirmButtonText}>Confirming...</Text>
            </>
          ) : (
            <Text style={styles.confirmButtonText}>Confirm Booking</Text>
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

  confirmButton: {
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

  confirmButtonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 4,
  },
});
