import React from "react";
import { Stack } from "expo-router";

function _Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Index",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="achievements"
        options={{
          headerTitle: "Achievements",
        }}
      />
    </Stack>
  );
}

export default _Layout;
