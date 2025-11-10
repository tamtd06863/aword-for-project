import { supabase } from "@/lib/supabase";
import React from "react";
import { Pressable, Text } from "react-native";
import { useColorScheme } from "nativewind";

async function onSignOutButtonPress() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error signing out:", error);
  }
}

export default function SignOutButton() {
  const { colorScheme } = useColorScheme();

  return (
    <Pressable
      className={`rounded-2xl shadow-sm `}
      style={{
        backgroundColor: colorScheme === "dark" ? "#C73133" : "#C73133",
      }}
      onPress={onSignOutButtonPress}
    >
      <Text
        className="p-4 text-center font-medium"
        style={{ color: "#FFFFFF" }}
      >
        Sign Out
      </Text>
    </Pressable>
  );
}
