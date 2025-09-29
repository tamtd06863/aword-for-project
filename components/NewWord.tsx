import { getColors } from "@/utls/colors";
import { useColorScheme } from "nativewind";
import React from "react";
import { Pressable, SafeAreaView, Text, View } from "react-native";

type NewWordProps = {
  word: string;
  progress?: number; // 0..1
  onContinue?: () => void;
  continueLabel?: string;
};

function clampProgress(value: number | undefined): number {
  if (typeof value !== "number" || Number.isNaN(value)) return 0;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

export default function NewWord(props: NewWordProps) {
  const { colorScheme } = useColorScheme();
  const colors = getColors(colorScheme === "dark");
  const progress = clampProgress(props.progress);
  const label = props.continueLabel ?? "Continue";

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.background.primary }}
    >
      {/* Progress Bar */}
      <View className="px-5 pt-6">
        <View
          className="h-3 w-full rounded-full overflow-hidden"
          style={{ backgroundColor: colors.surface.secondary }}
        >
          <View
            className="h-full rounded-full"
            style={{
              width: `${progress * 100}%`,
              backgroundColor: colors.primary.main,
            }}
          />
        </View>
      </View>

      {/* Word */}
      <View className="flex-1 items-center justify-center px-6">
        <Text
          className="text-4xl font-semibold"
          style={{ color: colors.text.primary }}
        >
          {props.word}
        </Text>
        <View
          className="mt-3 w-40 border-b-4"
          style={{
            borderStyle: "dashed",
            borderBottomColor: colors.accent.yellow,
          }}
        />
      </View>

      {/* Continue Button */}
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
            {label}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
