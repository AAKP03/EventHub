// src/app/(auth)/_layout.tsx  (NEW FILE)
//
// A plain stack for the two logged-out screens. No header, since our
// screens already have their own titles built in.

import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="sign-up" />
    </Stack>
  );
}
