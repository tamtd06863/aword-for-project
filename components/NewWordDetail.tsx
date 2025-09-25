import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

type WordPart = {
  text: string;
  colorClass?: string; // e.g. 'text-red-600'
};

type AnatomyItem = {
  badgeLabel: string; // Prefix, Origin, Postfix
  badgeColorClass: string; // e.g. 'bg-red-600'
  part: string; // ad-, -vent-, -ure
  meaning: string; // Vietnamese meaning
};

type NewWordDetailProps = {
  progress?: number; // 0..1
  wordParts: WordPart[];
  ipa: string;
  pos: string;
  viDefinition: string;
  example?: string;
  anatomy: AnatomyItem[];
  onContinue?: () => void;
  continueLabel?: string;
  onSpeak?: () => void;
};

function clamp(value?: number) {
  if (typeof value !== 'number' || Number.isNaN(value)) return 0;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

export default function NewWordDetail(props: NewWordDetailProps) {
  const progress = clamp(props.progress);
  const continueLabel = props.continueLabel ?? 'Continue';

  return (
    <View className="flex-1 bg-white">
      {/* Top progress */}
      <View className="px-5 pt-6">
        <View className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
          <View className="h-full bg-blue-600 rounded-full" style={{ width: `${progress * 100}%` }} />
        </View>
      </View>

      {/* Header word line */}
      <View className="px-5 mt-6 flex-row items-center justify-between">
        <View className="flex-row flex-wrap items-center">
          {props.wordParts.map((p, idx) => (
            <Text key={idx} className={`text-4xl font-semibold mr-1 ${p.colorClass ?? 'text-black'}`}>{p.text}</Text>
          ))}
          <Pressable onPress={props.onSpeak} accessibilityRole="button" accessibilityLabel="Play pronunciation" className="ml-2">
            <Ionicons name="volume-high-outline" size={24} color="#374151" />
          </Pressable>
        </View>
        <Text className="text-gray-700 text-xl">{props.pos}</Text>
      </View>

      {/* IPA */}
      <View className="px-5 mt-2">
        <Text className="text-gray-700 text-xl">{props.ipa}</Text>
      </View>

      {/* Vietnamese definition & example */}
      <View className="px-5 mt-6">
        <Text className="text-2xl font-semibold text-black">{props.viDefinition}</Text>
        {props.example ? (
          <Text className="text-base text-gray-600 mt-3">{props.example}</Text>
        ) : null}
      </View>

      {/* Anatomy */}
      <View className="px-5 mt-10">
        <Text className="text-2xl font-bold text-black">Anatomy</Text>
        <View className="mt-6">
          {props.anatomy.map((item, idx) => (
            <View key={idx} className="flex-row items-center mb-4">
              <View className="flex-row items-center w-40">
              <View className={`h-10 w-20 items-center justify-center rounded-l-full ${item.badgeColorClass}`}>
                <Text className="text-white font-semibold">{item.badgeLabel}</Text>
                </View>
                <Text className="ml-3 text-xl font-semibold text-black">{item.part}</Text>
              </View>
              <Text className="flex-1 ml-16 text-lg text-gray-800 text-left">{item.meaning}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Continue Button */}
      <View className="px-5 pb-8 mt-auto">
        <Pressable onPress={props.onContinue} className="bg-blue-600 rounded-2xl items-center justify-center py-4">
          <Text className="text-white text-base font-semibold">{continueLabel}</Text>
        </Pressable>
      </View>
    </View>
  );
}


