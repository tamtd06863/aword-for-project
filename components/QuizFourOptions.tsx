import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

type QuizFourOptionsProps = {
  progress?: number; // 0..1
  title: string; // e.g. "Nghĩa của tiền tố"
  prompt: string; // e.g. "ad-"
  promptColorClass?: string; // e.g. 'text-red-600'
  options: string[]; // four options
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  correctIndex: number; // index of correct answer
  checked: boolean; // whether user pressed Check
  onCheck?: () => void; // called when pressing Check/Continue
  checkLabel?: string; // label before checked
  continueLabel?: string; // label after checked
  correctMessage?: string;
  incorrectMessage?: string; // can include correct hint
};

function clamp(value?: number) {
  if (typeof value !== 'number' || Number.isNaN(value)) return 0;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

export default function QuizFourOptions(props: QuizFourOptionsProps) {
  const progress = clamp(props.progress);
  const isCheckEnabled = props.selectedIndex !== null && props.selectedIndex !== undefined;
  const checkLabel = props.checkLabel ?? 'Check';
  const continueLabel = props.continueLabel ?? 'Continue';
  const isCorrect =
    props.checked && props.selectedIndex !== null && props.selectedIndex === props.correctIndex;

  return (
    <View className="flex-1 bg-white">
      {/* Progress */}
      <View className="px-5 pt-6">
        <View className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
          <View className="h-full bg-blue-600 rounded-full" style={{ width: `${progress * 100}%` }} />
        </View>
      </View>

      {/* Title */}
      <View className="px-5 mt-6">
        <Text className="text-2xl font-semibold text-black">{props.title}</Text>
      </View>

      {/* Prompt */}
      <View className="flex-1 items-center justify-center px-5">
        <Text className={`text-6xl font-semibold ${props.promptColorClass ?? 'text-black'}`}>{props.prompt}</Text>
      </View>

      {/* Options */}
      <View className={`px-5 ${props.checked ? 'pb-48' : 'pb-5'}`}>
        {props.options.map((opt, idx) => {
          const isSelected = props.selectedIndex === idx;
          let containerClasses = 'bg-gray-100 border-gray-200';
          let textClasses = 'text-black';
          if (isSelected && !props.checked) {
            containerClasses = 'bg-blue-600 border-blue-600';
            textClasses = 'text-white';
          }
          if (props.checked && isSelected) {
            if (idx === props.correctIndex) {
              containerClasses = 'bg-green-500 border-green-500';
              textClasses = 'text-white';
            } else {
              containerClasses = 'bg-red-500 border-red-500';
              textClasses = 'text-white';
            }
          }
          return (
            <Pressable
              key={idx}
              className={`rounded-2xl px-4 py-4 mb-4 border ${containerClasses}`}
              onPress={() => props.onSelect(idx)}
            >
              <Text className={`text-base ${textClasses}`}>{opt}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* Bottom Action Area */}
      {!props.checked ? (
        <View className="px-5 pb-8">
          <Pressable
            onPress={isCheckEnabled ? props.onCheck : undefined}
            disabled={!isCheckEnabled}
            className={`${
              isCheckEnabled ? 'bg-blue-600' : 'bg-gray-300'
            } rounded-2xl items-center justify-center py-4`}
          >
            <Text className={`${isCheckEnabled ? 'text-white' : 'text-gray-500'} text-base font-semibold`}>
              {checkLabel}
            </Text>
          </Pressable>
        </View>
      ) : null}

      {props.checked ? (
        <View className="absolute left-0 right-0 bottom-0">
          <View className={`${isCorrect ? 'bg-green-500' : 'bg-red-500'} rounded-t-3xl px-5 pt-6 pb-8`}> 
            <View className="flex-row items-center mb-4">
              <Ionicons name={isCorrect ? 'checkmark-circle-outline' : 'close-circle-outline'} size={24} color="#ffffff" />
              <Text className="ml-2 text-white text-base font-semibold">
                {isCorrect ? (props.correctMessage ?? 'Chính xác') : (props.incorrectMessage ?? 'Sai')}
              </Text>
            </View>
            <Pressable
              onPress={props.onCheck}
              className="bg-white rounded-2xl items-center justify-center py-4"
            >
              <Text className="text-black text-base font-semibold">{continueLabel}</Text>
            </Pressable>
          </View>
        </View>
      ) : null}
    </View>
  );
}


