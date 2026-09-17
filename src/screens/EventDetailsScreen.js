import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { useLocalSearchParams, useRouter } from "expo-router";
import { API_BASE_URL } from "../config/api";

export default function EventDetailsScreen() {
  const { eventId } = useLocalSearchParams();
  const router = useRouter();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/events`);

      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }

      const events = await response.json();

      const selectedEvent = events.find((item) => item.id === eventId);

      if (!selectedEvent) {
        setError("Event not found");
        return;
      }

      setEvent(selectedEvent);
    } catch (err) {
      console.error(err);
      setError("Unable to load event");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading event...</Text>
      </View>
    );
  }

  if (error || !event) {
    return (
      <View style={styles.center}>
        <Text>{error || "Event not found"}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: event.image }} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.title}>{event.name}</Text>

        <Text style={styles.category}>{event.category}</Text>

        <Text style={styles.description}>{event.description}</Text>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>{event.date}</Text>

          <Text style={styles.label}>Time</Text>
          <Text style={styles.value}>{event.time}</Text>

          <Text style={styles.label}>Location</Text>
          <Text style={styles.value}>{event.location}</Text>

          <Text style={styles.label}>Price</Text>
          <Text style={styles.value}>LKR {event.price}</Text>

          <Text style={styles.label}>Available Seats</Text>
          <Text style={styles.value}>{event.availableSeats}</Text>
        </View>

        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => {
            router.push({
              pathname: "/booking",
              params: { eventId: event.id },
            });
          }}
        >
          <Text style={styles.bookButtonText}>Book Now</Text>
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

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: "100%",
    height: 250,
  },

  content: {
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },

  category: {
    fontSize: 16,
    marginBottom: 15,
  },

  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },

  infoBox: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 12,
  },

  label: {
    fontSize: 14,
    marginTop: 8,
  },

  value: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },

  bookButton: {
    backgroundColor: "#000",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },

  bookButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
});
