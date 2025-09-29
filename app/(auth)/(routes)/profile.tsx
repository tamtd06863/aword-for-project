import { useAppSelector } from "@/lib/hooks";
import { supabase } from "@/lib/supabase";
import { getColors } from "@/utls/colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface UserStats {
  streaks: number;
  totalExp: number;
  currentLeague: string;
  topFinishes: number;
}

const Profile = () => {
  const { colorScheme } = useColorScheme();
  const colors = getColors(colorScheme === "dark");
  const user = useAppSelector((state) => state.auth.auth);

  const [stats, setStats] = useState<UserStats>({
    streaks: 0,
    totalExp: 0,
    currentLeague: "Bronze",
    topFinishes: 0,
  });
  const [loading, setLoading] = useState(true);

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const fetchUserStats = async () => {
    try {
      setLoading(true);

      // Set default stats for now (until user_stats table is created)
      setStats({
        streaks: 7,
        totalExp: 1250,
        currentLeague: "Silver",
        topFinishes: 3,
      });

      // TODO: Uncomment when user_stats table is created in Supabase
      // const { data: userStats, error } = await supabase
      //   .from("user_stats")
      //   .select("*")
      //   .eq("user_id", user.userId)
      //   .single();

      // if (error && error.code !== "PGRST116") {
      //   console.error("Error fetching user stats:", error);
      //   return;
      // }

      // if (userStats) {
      //   setStats({
      //     streaks: userStats.streaks || 0,
      //     totalExp: userStats.total_exp || 0,
      //     currentLeague: userStats.current_league || "Bronze",
      //     topFinishes: userStats.top_finishes || 0,
      //   });
      // }
    } catch (error) {
      console.error("Error setting default user stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.userId) {
      fetchUserStats();
    }
  }, [user.userId]);

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
              source={{
                uri: user.avatar_url || "https://i.pravatar.cc/100",
              }}
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
          {user.name || "User"}
        </Text>
        <View className="flex-row items-center justify-center">
          <Text className="text-base" style={{ color: colors.text.secondary }}>
            {user.email || "No email"}
          </Text>
        </View>
      </View>

      {/* Statistics Section */}
      <View className="flex-1 px-6 pt-8">
        <Text
          className="text-xl font-bold mb-6"
          style={{ color: colors.text.primary }}
        >
          Statistics
        </Text>

        {/* Statistics Grid */}
        <View className="flex-1">
          {loading ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color={colors.primary.main} />
              <Text className="mt-4" style={{ color: colors.text.secondary }}>
                Loading statistics...
              </Text>
            </View>
          ) : (
            <>
              {/* Top Row */}
              <View className="flex-row mb-3">
                <StatCard
                  icon="flame"
                  value={stats.streaks.toString()}
                  label="Streaks"
                  iconColor={colors.accent.orange}
                />
                <StatCard
                  icon="flash"
                  value={stats.totalExp.toString()}
                  label="Total exp"
                  iconColor={colors.accent.yellow}
                />
              </View>

              {/* Bottom Row */}
              <View className="flex-row">
                <StatCard
                  icon="diamond"
                  value={stats.currentLeague}
                  label="Current league"
                  iconColor={colors.accent.yellow}
                />
                <StatCard
                  icon="trophy"
                  value={stats.topFinishes.toString()}
                  label="Top 1 finishes"
                  iconColor={colors.accent.yellow}
                />
              </View>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
