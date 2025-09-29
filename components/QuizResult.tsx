import { getColors } from "@/utls/colors";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import React from "react";
import { Pressable, Text, View } from "react-native";

type StatItem = {
  icon: keyof typeof Ionicons.glyphMap;
  color?: string;
  text: string;
};

type QuizResultProps = {
  title?: string;
  stats: StatItem[];
  onContinue?: () => void;
  continueLabel?: string;
};

export default function QuizResult(props: QuizResultProps) {
  const { colorScheme } = useColorScheme();
  const colors = getColors(colorScheme === "dark");
  const title = props.title ?? "Good job!";
  const continueLabel = props.continueLabel ?? "Continue";
  return (
    <View
      className="flex-1"
      style={{ backgroundColor: colors.background.primary }}
    >
      <View className="flex-1 items-center justify-start px-10 mt-24">
        <Text
          className="text-5xl font-semibold text-center mb-8"
          style={{ color: colors.text.primary }}
        >
          {title}
        </Text>
        <View className="w-3/4 self-center mt-2">
          {props.stats.map((s, idx) => (
            <View key={idx} className="flex-row items-center mb-5">
              <Ionicons
                name={s.icon}
                size={22}
                color={s.color ?? colors.text.primary}
              />
              <Text
                className="ml-3 text-xl"
                style={{ color: colors.text.primary }}
              >
                {s.text}
              </Text>
            </View>
          ))}
        </View>
      </View>
      <View className="px-5 pb-8">
        <Pressable
          onPress={props.onContinue}
          className="rounded-2xl items-center justify-center py-4"
          style={{ backgroundColor: colors.primary.main }}
        >
          <Text
            className="text-base font-semibold"
            style={{ color: colors.text.button }}
          >
            {continueLabel}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
