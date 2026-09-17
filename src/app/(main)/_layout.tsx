import { Stack } from "expo-router";

export default function MainLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="event-detail" />
      <Stack.Screen name="my-bookings" />
      <Stack.Screen name="add-event" />
      <Stack.Screen name="organizer" />
      <Stack.Screen name="edit-event" />
      <Stack.Screen name="event-bookings" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}
