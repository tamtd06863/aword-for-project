import { useAuthContext } from "@/hooks/use-auth-context";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { FormField } from "heroui-native";
import { useColorScheme } from "nativewind";
import React, { useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

const LearnLayout = () => {
  const router = useRouter();
  const { session } = useAuthContext();
  const { colorScheme } = useColorScheme();
  const [searchValue, setSearchValue] = useState("");

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: colorScheme === "dark" ? "#1E3A8A" : "#0659E7",
        },
        headerTintColor: "white",
        headerTitleStyle: { color: "white" },
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ marginLeft: 12 }}
          >
            <Ionicons name="arrow-back" size={22} color="white" />
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen
        name="wordex"
        options={{
          header: () => (
            <View
              style={{
                backgroundColor: colorScheme === "dark" ? "#111827" : "#F9FAFB",
                paddingBottom: 20,
              }}
            >
              <View
                style={{
                  backgroundColor:
                    colorScheme === "dark" ? "#1E3A8A" : "#0659E7",
                  paddingHorizontal: 12,
                  paddingTop: 100,
                  paddingBottom: 38,
                  flexDirection: "row",
                  alignItems: "center",
                  borderBottomLeftRadius: 16,
                  borderBottomRightRadius: 16,
                }}
              >
                {/* Nút back */}
                <TouchableOpacity onPress={() => router.back()}>
                  <Ionicons name="arrow-back" size={22} color="white" />
                </TouchableOpacity>

                {/* Ô search */}
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <FormField
                    isSelected={!!searchValue}
                    onSelectedChange={(isSelected) => {
                      if (!isSelected) setSearchValue("");
                    }}
                  >
                    <FormField.Content>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          backgroundColor:
                            colorScheme === "dark"
                              ? "rgba(255, 255, 255, 0.1)"
                              : "rgba(255, 255, 255, 0.9)",
                          borderRadius: 12,
                          borderWidth: 1,
                          borderColor:
                            colorScheme === "dark"
                              ? "rgba(255, 255, 255, 0.2)"
                              : "rgba(255, 255, 255, 0.3)",
                          paddingHorizontal: 12,
                          paddingVertical: 12,
                        }}
                      >
                        <Ionicons
                          name="search"
                          size={18}
                          color={
                            colorScheme === "dark"
                              ? "rgba(255, 255, 255, 0.7)"
                              : "rgba(0, 0, 0, 0.6)"
                          }
                          style={{ marginRight: 8 }}
                        />
                        <TextInput
                          value={searchValue}
                          onChangeText={setSearchValue}
                          style={{
                            flex: 1,
                            fontSize: 16,
                            color: colorScheme === "dark" ? "white" : "black",
                          }}
                          placeholder="Search here..."
                          placeholderTextColor={
                            colorScheme === "dark"
                              ? "rgba(255, 255, 255, 0.6)"
                              : "rgba(0, 0, 0, 0.5)"
                          }
                        />
                      </View>
                    </FormField.Content>
                  </FormField>
                </View>
              </View>
            </View>
          ),
        }}
      />

      <Stack.Protected guard={!!session}>
        <Stack.Screen name="flashcard" options={{ title: "Flashcard" }} />
        <Stack.Screen name="leaderboard" options={{ title: "Leaderboard" }} />
        <Stack.Screen
          name="learning"
          options={{
            title: "Learn",
          }}
        />
      </Stack.Protected>
    </Stack>
  );
};

export default LearnLayout;
