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

import { useRouter } from "expo-router";
import { API_BASE_URL } from "../config/api";

export default function OrganizerScreen() {
  const router = useRouter();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadEvents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/events`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load events");
      }

      setEvents(data);
    } catch (error) {
      console.error("Load organizer events error:", error);

      Alert.alert("Error", error.message || "Unable to load events.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadEvents();
  };

  const deleteEvent = async (eventId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/events/${eventId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete event");
      }

      Alert.alert("Event Deleted", "The event has been deleted successfully.");

      await loadEvents();
    } catch (error) {
      console.error("Delete event error:", error);

      Alert.alert(
        "Delete Failed",
        error.message || "Unable to delete the event.",
      );
    }
  };

  const confirmDelete = (eventId) => {
    Alert.alert("Delete Event", "Are you sure you want to delete the event?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteEvent(eventId),
      },
    ]);
  };

  const renderEvent = ({ item }) => {
    return (
      <View style={styles.card}>
        <Text style={styles.eventName}>{item.name}</Text>

        <Text style={styles.info}>Category: {item.category}</Text>

        <Text style={styles.info}>Date: {item.date}</Text>

        <Text style={styles.info}>Location: {item.location}</Text>

        <Text style={styles.info}>Price: LKR {item.price}</Text>

        <Text style={styles.seats}>
          {item.availableSeats} / {item.totalSeats} seats available
        </Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() =>
              router.push({
                pathname: "/edit-event",
                params: { eventId: item.id },
              })
            }
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => confirmDelete(item.id)}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.bookingsButton}
          onPress={() =>
            router.push({
              pathname: "/event-bookings",
              params: { eventId: item.id },
            })
          }
        >
          <Text style={styles.bookingsButtonText}>View Bookings</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading events...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Manage Events</Text>

        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.profileIcon}
            onPress={() => router.push("/profile")}
          >
            <Text style={styles.profileIconText}>👤</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push("/add-event")}
          >
            <Text style={styles.addButtonText}>+ Add Event</Text>
          </TouchableOpacity>
        </View>
      </View>

      {events.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyTitle}>No events found</Text>

          <Text style={styles.emptyText}>Add an event to get started.</Text>
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={renderEvent}
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

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
  },

  headerButtons: {
    flexDirection: "row",
    gap: 8,
  },

  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eeeeee",
  },

  profileIconText: {
    fontSize: 20,
  },

  addButton: {
    backgroundColor: "#000",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },

  addButtonText: {
    color: "white",
    fontSize: 13,
    fontWeight: "bold",
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
    marginBottom: 12,
  },

  info: {
    fontSize: 14,
    marginBottom: 6,
    color: "#555",
  },

  seats: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5,
  },

  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 15,
  },

  editButton: {
    flex: 1,
    backgroundColor: "#000",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  deleteButton: {
    flex: 1,
    backgroundColor: "#c62828",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },

  bookingsButton: {
    backgroundColor: "#eee",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  bookingsButtonText: {
    color: "#222",
    fontWeight: "bold",
    fontSize: 15,
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
  },
});
