import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  RefreshControl,
} from "react-native";

import { API_BASE_URL } from "../config/api";
import { useAuth } from "../context/AuthContext";

export default function MyBookingsScreen() {
  const { user } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);

  const loadBookings = async () => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/bookings/user/${user.uid}`,
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load bookings");
      }

      setBookings(data);
    } catch (error) {
      console.error("Load bookings error:", error);

      Alert.alert("Error", error.message || "Unable to load your bookings.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [user?.uid]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadBookings();
  };

  const cancelBooking = async (bookingId) => {
    if (cancellingId) {
      return;
    }

    try {
      setCancellingId(bookingId);

      const response = await fetch(
        `${API_BASE_URL}/api/bookings/${bookingId}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to cancel booking");
      }

      Alert.alert(
        "Booking Cancelled",
        "Your booking has been cancelled successfully.",
      );

      await loadBookings();
    } catch (error) {
      console.error("Cancel booking error:", error);

      Alert.alert(
        "Cancellation Failed",
        error.message || "Unable to cancel the booking.",
      );
    } finally {
      setCancellingId(null);
    }
  };

  const confirmCancellation = (bookingId) => {
    Alert.alert(
      "Cancel Booking",
      "Are you sure you want to cancel this booking?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: () => cancelBooking(bookingId),
        },
      ],
    );
  };

  const renderBooking = ({ item }) => {
    const isCancelled = item.status === "Cancelled";
    const isCancelling = cancellingId === item.id;

    return (
      <View style={styles.card}>
        <Text style={styles.eventName}>{item.eventName}</Text>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{item.name}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{item.email}</Text>
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

        {!isCancelled && (
          <TouchableOpacity
            style={[styles.cancelButton, isCancelling && styles.disabledButton]}
            onPress={() => confirmCancellation(item.id)}
            disabled={isCancelling}
          >
            {isCancelling ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.cancelButtonText}>Cancel Booking</Text>
            )}
          </TouchableOpacity>
        )}
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
      <Text style={styles.title}>My Bookings</Text>

      {bookings.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyTitle}>No bookings yet</Text>
          <Text style={styles.emptyText}>
            Your event bookings will appear here.
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
    paddingTop: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    paddingHorizontal: 20,
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

  eventName: {
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

  cancelButton: {
    backgroundColor: "#c62828",
    padding: 13,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15,
  },

  cancelButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
  },

  disabledButton: {
    opacity: 0.6,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  loadingText: {
    marginTop: 10,
    fontSize: 15,
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
