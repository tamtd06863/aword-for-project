import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

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
  const title = props.title ?? 'Good job!';
  const continueLabel = props.continueLabel ?? 'Continue';
  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 items-center justify-start px-10 mt-24">
        <Text className="text-5xl font-semibold text-black text-center mb-8">{title}</Text>
        <View className="w-3/4 self-center mt-2">
          {props.stats.map((s, idx) => (
            <View key={idx} className="flex-row items-center mb-5">
              <Ionicons name={s.icon} size={22} color={s.color ?? '#111827'} />
              <Text className="ml-3 text-xl text-black">{s.text}</Text>
            </View>
          ))}
        </View>
      </View>
      <View className="px-5 pb-8">
        <Pressable onPress={props.onContinue} className="bg-blue-600 rounded-2xl items-center justify-center py-4">
          <Text className="text-white text-base font-semibold">{continueLabel}</Text>
        </Pressable>
      </View>
    </View>
  );
}


