import React from 'react';
import { Pressable, SafeAreaView, Text, View } from 'react-native';

type NewWordProps = {
  word: string;
  progress?: number; // 0..1
  onContinue?: () => void;
  continueLabel?: string;
};

function clampProgress(value: number | undefined): number {
  if (typeof value !== 'number' || Number.isNaN(value)) return 0;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

export default function NewWord(props: NewWordProps) {
  const progress = clampProgress(props.progress);
  const label = props.continueLabel ?? 'Continue';

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Progress Bar */}
      <View className="px-5 pt-6">
        <View className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
          <View
            className="h-full bg-blue-600 rounded-full"
            style={{ width: `${progress * 100}%` }}
          />
        </View>
      </View>

      {/* Word */}
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-4xl font-semibold text-black">{props.word}</Text>
        <View
          className="mt-3 w-40 border-b-4 border-yellow-400"
          style={{ borderStyle: 'dashed' }}
        />
      </View>

      {/* Continue Button */}
      <View className="px-5 pb-8">
        <Pressable
          onPress={props.onContinue}
          className="bg-blue-600 rounded-2xl items-center justify-center py-4"
        >
          <Text className="text-white text-base font-semibold">{label}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}


