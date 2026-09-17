import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { useRouter } from "expo-router";
import { API_BASE_URL } from "../../config/api";

type Event = {
  id: string;
  name: string;
  image: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  price: number;
  availableSeats: number;
  totalSeats: number;
};

export default function MainHome() {
  const router = useRouter();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/events`);

      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }

      const data = await response.json();
      setEvents(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load events");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading events...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>{error}</Text>
      </View>
    );
  }

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.name
      .toLowerCase()
      .includes(searchText.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      event.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Discover Events</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search events..."
        value={searchText}
        onChangeText={setSearchText}
      />

      <View style={styles.categoryContainer}>
        {["All", "Music", "Sports", "Workshop"].map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.selectedCategory,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryButtonText,
                selectedCategory === category && styles.selectedCategoryText,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/event-detail",
                params: { eventId: item.id },
              })
            }
          >
            <Image source={{ uri: item.image }} style={styles.image} />

            <View style={styles.cardContent}>
              <Text style={styles.eventName}>{item.name}</Text>

              <Text style={styles.category}>{item.category}</Text>

              <Text style={styles.info}>
                📅 {item.date} • {item.time}
              </Text>

              <Text style={styles.info}>📍 {item.location}</Text>

              <Text style={styles.price}>LKR {item.price}</Text>

              <Text style={styles.seats}>
                {item.availableSeats} seats available
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No events found.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 50,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginHorizontal: 20,
    marginBottom: 15,
  },

  searchInput: {
    backgroundColor: "white",
    marginHorizontal: 20,
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    fontSize: 16,
  },

  categoryContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 10,
    gap: 8,
  },

  categoryButton: {
    backgroundColor: "white",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },

  selectedCategory: {
    backgroundColor: "#ddd",
  },

  categoryButtonText: {
    fontSize: 14,
  },

  selectedCategoryText: {
    fontWeight: "bold",
  },

  list: {
    padding: 20,
    paddingTop: 5,
  },

  card: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 20,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: 180,
  },

  cardContent: {
    padding: 15,
  },

  eventName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },

  category: {
    fontSize: 14,
    marginBottom: 10,
  },

  info: {
    fontSize: 14,
    marginBottom: 5,
  },

  price: {
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 8,
  },

  seats: {
    fontSize: 14,
    marginTop: 5,
  },

  emptyContainer: {
    alignItems: "center",
    paddingTop: 40,
  },

  emptyText: {
    fontSize: 16,
  },
});
