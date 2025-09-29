import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Leaderboard = () => {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <View className="flex-1 justify-center items-center">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">
          Leaderboard
        </Text>
        <Text className="text-gray-600 dark:text-gray-400 mt-2">
          Coming soon...
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Leaderboard;
