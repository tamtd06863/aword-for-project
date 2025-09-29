import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Switch } from "heroui-native";
import { useColorScheme } from "nativewind";
import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Setting = () => {
  const { toggleColorScheme, colorScheme } = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === "dark");
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [selectedFontSize, setSelectedFontSize] = useState("Medium");
  const [isLanguageExpanded, setIsLanguageExpanded] = useState(false);
  const [isFontSizeExpanded, setIsFontSizeExpanded] = useState(false);

  // Sync local state with colorScheme changes
  useEffect(() => {
    setIsDarkMode(colorScheme === "dark");
  }, [colorScheme]);

  const handleDarkModeToggle = () => {
    toggleColorScheme();
  };

  const SettingCard = ({
    children,
    className = "",
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <View
      className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 ${className}`}
    >
      {children}
    </View>
  );

  const RadioButton = ({
    selected,
    onPress,
  }: {
    selected: boolean;
    onPress: () => void;
  }) => (
    <Pressable
      onPress={onPress}
      className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600 items-center justify-center"
    >
      {selected && <View className="w-3 h-3 rounded-full bg-blue-600" />}
    </Pressable>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <View className="flex-row items-center px-6 py-4">
        <Pressable className="mr-4" onPress={() => router.push("/home")}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={colorScheme === "dark" ? "white" : "#374151"}
          />
        </Pressable>
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">
          Setting
        </Text>
      </View>

      <View className="flex-1 px-6">
        {/* Dark Mode Section */}
        <SettingCard className="mb-4">
          <View className="flex-row items-center justify-between p-4">
            <Text className="text-lg font-medium text-gray-900 dark:text-white">
              Dark mode
            </Text>
            <Switch isSelected={isDarkMode} onPress={handleDarkModeToggle} />
          </View>
        </SettingCard>

        {/* Language Section */}
        <SettingCard className="mb-4">
          <Pressable
            onPress={() => setIsLanguageExpanded(!isLanguageExpanded)}
            className="p-4"
          >
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-medium text-gray-900 dark:text-white">
                Language
              </Text>
              <Ionicons
                name={isLanguageExpanded ? "chevron-up" : "chevron-down"}
                size={20}
                color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
              />
            </View>
          </Pressable>

          {isLanguageExpanded && (
            <View className="px-4 pb-4 border-t border-gray-100">
              <View className="flex-row items-center justify-between py-3">
                <Text className="text-base text-gray-700 dark:text-gray-300">
                  Vietnamese
                </Text>
                <RadioButton
                  selected={selectedLanguage === "Vietnamese"}
                  onPress={() => setSelectedLanguage("Vietnamese")}
                />
              </View>
              <View className="flex-row items-center justify-between py-3">
                <Text className="text-base text-gray-700 dark:text-gray-300">
                  English
                </Text>
                <RadioButton
                  selected={selectedLanguage === "English"}
                  onPress={() => setSelectedLanguage("English")}
                />
              </View>
            </View>
          )}
        </SettingCard>

        {/* Font Size Section */}
        <SettingCard className="mb-4">
          <Pressable
            onPress={() => setIsFontSizeExpanded(!isFontSizeExpanded)}
            className="p-4"
          >
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-medium text-gray-900 dark:text-white">
                Font size
              </Text>
              <Ionicons
                name={isFontSizeExpanded ? "chevron-up" : "chevron-down"}
                size={20}
                color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
              />
            </View>
          </Pressable>

          {isFontSizeExpanded && (
            <View className="px-4 pb-4 border-t border-gray-100">
              <View className="flex-row items-center justify-between py-3">
                <Text className="text-base text-gray-700 dark:text-gray-300">
                  Small
                </Text>
                <RadioButton
                  selected={selectedFontSize === "Small"}
                  onPress={() => setSelectedFontSize("Small")}
                />
              </View>
              <View className="flex-row items-center justify-between py-3">
                <Text className="text-base text-gray-700 dark:text-gray-300">
                  Medium
                </Text>
                <RadioButton
                  selected={selectedFontSize === "Medium"}
                  onPress={() => setSelectedFontSize("Medium")}
                />
              </View>
              <View className="flex-row items-center justify-between py-3">
                <Text className="text-base text-gray-700 dark:text-gray-300">
                  Big
                </Text>
                <RadioButton
                  selected={selectedFontSize === "Big"}
                  onPress={() => setSelectedFontSize("Big")}
                />
              </View>
            </View>
          )}
        </SettingCard>

        {/* Notifications Section */}
        <SettingCard className="mb-4">
          <Pressable className="flex-row items-center justify-between p-4">
            <Text className="text-lg font-medium text-gray-900 dark:text-white">
              Notifications
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
            />
          </Pressable>
        </SettingCard>
      </View>
    </SafeAreaView>
  );
};

export default Setting;
