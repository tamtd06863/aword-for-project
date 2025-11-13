import { Stack } from "expo-router";
import React from "react";
import { useColorScheme } from "nativewind";
import { getColors } from "@/utls/colors";

function ProfileLayout() {
  const { colorScheme } = useColorScheme();
  const colors = getColors(colorScheme === "dark");

  const headerCommon = {
    // Use primary.main for header background (matches Learn layout)
    headerStyle: { backgroundColor: colors.primary.main },
    // Use header text color token for icons/titles
    headerTintColor: colors.text.header,
    headerTitleStyle: { color: colors.text.header },
  } as const;

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
        name="edit"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="achievements"
        options={{
          headerTitle: "Achievements",
          ...headerCommon,
        }}
      />
    </Stack>
  );
}

export default ProfileLayout;
