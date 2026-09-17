import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";

import { useLocalSearchParams } from "expo-router";
import { API_BASE_URL } from "../config/api";

export default function EventBookingsScreen() {
  const { eventId } = useLocalSearchParams();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadBookings = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/bookings/event/${eventId}`,
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load bookings");
      }

      setBookings(data);
    } catch (error) {
      console.error("Load event bookings error:", error);

      Alert.alert("Error", error.message || "Unable to load bookings.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (eventId) {
      loadBookings();
    }
  }, [eventId]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadBookings();
  };

  const renderBooking = ({ item }) => {
    const isCancelled = item.status === "Cancelled";

    return (
      <View style={styles.card}>
        <Text style={styles.name}>{item.name}</Text>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{item.email}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Phone</Text>
          <Text style={styles.value}>{item.phone}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Seats</Text>
          <Text style={styles.value}>{item.seats}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Price</Text>
          <Text style={styles.value}>LKR {item.price}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Status</Text>
          <Text style={[styles.status, isCancelled && styles.cancelledStatus]}>
            {item.status}
          </Text>
        </View>

        <Text style={styles.bookingId}>Booking ID: {item.id}</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading bookings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Event Bookings</Text>

      <Text style={styles.count}>
        {bookings.length} booking
        {bookings.length !== 1 ? "s" : ""}
      </Text>

      {bookings.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyTitle}>No bookings yet</Text>

          <Text style={styles.emptyText}>
            Bookings for this event will appear here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          renderItem={renderBooking}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 50,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    paddingHorizontal: 20,
  },

  count: {
    fontSize: 15,
    color: "#666",
    paddingHorizontal: 20,
    marginTop: 5,
    marginBottom: 15,
  },

  list: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },

  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  label: {
    fontSize: 14,
    color: "#666",
  },

  value: {
    fontSize: 14,
    fontWeight: "500",
    maxWidth: "65%",
    textAlign: "right",
  },

  status: {
    fontSize: 14,
    fontWeight: "bold",
  },

  cancelledStatus: {
    color: "#888",
  },

  bookingId: {
    fontSize: 12,
    color: "#777",
    marginTop: 12,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  loadingText: {
    marginTop: 10,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
  },
});
