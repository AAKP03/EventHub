import { Stack, useRouter } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "../context/AuthContext";

function RootNavigator() {
  const { user, profile, initializing } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!initializing && user && profile) {
      if (profile.role === "organizer") {
        router.replace("/organizer");
      } else {
        router.replace("/");
      }
    }
  }, [initializing, user, profile]);

  if (initializing || (user && !profile)) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Protected guard={!!user}>
        <Stack.Screen name="(main)" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={!user}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
