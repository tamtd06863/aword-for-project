import { useAuthContext } from "@/hooks/AuthContext";
import { Stack } from "expo-router";
import React from "react";

const MainLayout = () => {
  const { session } = useAuthContext();

  return (
    <Stack>
      <Stack.Protected guard={!session}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(routes)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Screen name="(learn)" options={{ headerShown: false }} />
    </Stack>
  );
};

export default MainLayout;
