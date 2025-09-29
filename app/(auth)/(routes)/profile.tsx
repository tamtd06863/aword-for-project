import { supabase } from "@/lib/supabase";
import { getColors } from "@/utls/colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  const { colorScheme } = useColorScheme();
  const colors = getColors(colorScheme === "dark");

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const StatCard = ({
    icon,
    value,
    label,
    iconColor,
  }: {
    icon: string;
    value: string;
    label: string;
    iconColor: string;
  }) => (
    <View
      className="border rounded-xl p-4 flex-1 mx-1"
      style={{
        backgroundColor: colors.background.secondary,
        borderColor: colors.border.primary,
      }}
    >
      <View className="flex-row items-center">
        <Ionicons name={icon as any} size={24} color={iconColor} />
        <View className="ml-3">
          <Text
            className="text-2xl font-bold"
            style={{ color: colors.text.primary }}
          >
            {value}
          </Text>
          <Text className="text-sm" style={{ color: colors.text.secondary }}>
            {label}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.background.primary }}
    >
      {/* Header with Orange Background */}
      <View
        className="pt-4 pb-20 px-6"
        style={{ backgroundColor: colors.accent.orange }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Pressable onPress={() => router.push("/home")}>
              <Ionicons
                name="arrow-back"
                size={24}
                color={colors.text.inverse}
              />
            </Pressable>
            <Text
              className="text-xl font-semibold ml-4"
              style={{ color: colors.text.inverse }}
            >
              Profile
            </Text>
          </View>
          <Pressable>
            <Ionicons
              name="ellipsis-vertical"
              size={24}
              color={colors.text.inverse}
            />
          </Pressable>
        </View>

        {/* Avatar - Centered and overlapping */}
        <View className="items-center">
          <View className="w-24 h-24 rounded-full items-center justify-center">
            <Image
              source={{ uri: "https://i.pravatar.cc/100" }}
              className="w-20 h-20 rounded-full"
            />
          </View>
        </View>
      </View>

      {/* User Information */}
      <View
        className="px-6 pt-4 pb-6 flex flex-col items-start"
        style={{ backgroundColor: colors.background.secondary }}
      >
        <Text
          className="text-3xl font-semibold text-center mb-2"
          style={{ color: colors.text.primary }}
        >
          hhaoz
        </Text>
        <View className="flex-row items-center justify-center">
          <Text className="text-base" style={{ color: colors.text.secondary }}>
            @hhaoz
          </Text>
          <View
            className="w-1 h-1 rounded-full mx-2"
            style={{ backgroundColor: colors.text.secondary }}
          />
          <Text className="text-base" style={{ color: colors.text.secondary }}>
            Joined at May 7th 2025
          </Text>
        </View>
      </View>

      {/* Statistics Section */}
      <View className="flex-1 px-6">
        <Text
          className="text-xl font-bold mb-4"
          style={{ color: colors.text.primary }}
        >
          Statistics
        </Text>

        {/* Statistics Grid */}
        <View className="flex-1">
          {/* Top Row */}
          <View className="flex-row mb-3">
            <StatCard
              icon="flame"
              value="20"
              label="Streaks"
              iconColor="#FF6B35"
            />
            <StatCard
              icon="flash"
              value="1234"
              label="Total exp"
              iconColor="#FFD23F"
            />
          </View>

          {/* Bottom Row */}
          <View className="flex-row">
            <StatCard
              icon="diamond"
              value="Gold"
              label="Current league"
              iconColor="#FFD700"
            />
            <StatCard
              icon="trophy"
              value="20"
              label="Top 1 finishes"
              iconColor="#FFD700"
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
