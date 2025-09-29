import { Vocabulary } from "@/models/Vocabulary";
import { fetchRandomVocabulary } from "@/supabase/vocabulary";
import { getColors } from "@/utls/colors";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const getPartOfSpeechFull = (pos: string): string => {
  const posLower = pos.toLowerCase();
  switch (posLower) {
    case "n":
      return "noun";
    case "v":
      return "verb";
    case "adj":
      return "adjective";
    case "adv":
      return "adverb";
    case "pron":
      return "pronoun";
    case "prep":
      return "preposition";
    case "conj":
      return "conjunction";
    case "interj":
      return "interjection";
    case "det":
      return "determiner";
    case "aux":
      return "auxiliary";
    default:
      return posLower;
  }
};

const highlightWordInExample = (example: string, word: string, colors: any) => {
  if (!example || !word) return example;

  // Create patterns for common word variations
  const createWordPatterns = (baseWord: string) => {
    const patterns = new Set([baseWord.toLowerCase()]);

    // Common suffixes for verbs
    const verbSuffixes = ["ed", "ing", "s", "es", "er", "est", "ly"];
    verbSuffixes.forEach((suffix) => {
      // Add basic suffix
      patterns.add(baseWord.toLowerCase() + suffix);

      // Handle doubling consonant (e.g., adopt -> adopted)
      if (
        baseWord.length > 2 &&
        baseWord[baseWord.length - 1] === baseWord[baseWord.length - 2]
      ) {
        patterns.add(
          baseWord.toLowerCase() + baseWord[baseWord.length - 1] + suffix
        );
      }
    });

    // Common prefixes
    const prefixes = ["un", "re", "pre", "mis", "dis"];
    prefixes.forEach((prefix) => {
      patterns.add(prefix + baseWord.toLowerCase());
    });

    // Past tense variations (simple heuristic)
    if (baseWord.endsWith("e")) {
      patterns.add(baseWord.toLowerCase() + "d");
    }

    return Array.from(patterns);
  };

  const wordPatterns = createWordPatterns(word);

  // Create regex that matches any of the patterns, sorted by length (longest first)
  const sortedPatterns = wordPatterns.sort((a, b) => b.length - a.length);
  const regexPattern = sortedPatterns
    .map((pattern) => `\\b${pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`)
    .join("|");

  const regex = new RegExp(`(${regexPattern})`, "gi");
  const parts = example.split(regex);

  if (parts.length === 1) return example; // No matches found

  return parts.map((part, index) => {
    // Check if this part is a word variation by testing against regex
    const isWordVariation = regex.test(part);

    if (isWordVariation && index % 2 === 1) {
      // Odd indices are matches
      return (
        <Text
          key={index}
          style={{ fontWeight: "bold", color: colors.accent.blue }}
        >
          {part}
        </Text>
      );
    }
    return part;
  });
};

const Flashcard = () => {
  const { colorScheme } = useColorScheme();
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentWord, setCurrentWord] = useState<Vocabulary | null>(null);
  const [loading, setLoading] = useState(true);
  const [headerWidth, setHeaderWidth] = useState<number | null>(null);
  const flipAnimation = useRef(new Animated.Value(0)).current;

  const colors = getColors(colorScheme === "dark");

  const fetchRandomWord = async () => {
    try {
      setLoading(true);

      const vocabulary = await fetchRandomVocabulary();

      if (vocabulary) {
        setCurrentWord(vocabulary);
        setIsFlipped(false); // Reset flip state when loading new word
      } else {
        console.log("No vocabulary found");
        setCurrentWord(null);
      }
    } catch (error) {
      console.error("Error fetching vocabulary:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = () => {
    fetchRandomWord();
  };

  useEffect(() => {
    fetchRandomWord();
  }, []);

  const flipCard = () => {
    if (isFlipped) {
      Animated.spring(flipAnimation, {
        toValue: 0,
        tension: 10,
        friction: 8,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(flipAnimation, {
        toValue: 1,
        tension: 10,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }
    setIsFlipped(!isFlipped);
  };

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "360deg"],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
  };

  if (loading) {
    return (
      <SafeAreaView
        className="flex-1"
        style={{ backgroundColor: colors.background.primary }}
      >
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors.primary.main} />
          <Text className="mt-4" style={{ color: colors.text.secondary }}>
            Loading vocabulary...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentWord) {
    return (
      <SafeAreaView
        className="flex-1"
        style={{ backgroundColor: colors.background.primary }}
      >
        <View className="flex-1 justify-center items-center px-6">
          <Text
            className="text-xl font-semibold text-center mb-4"
            style={{ color: colors.text.primary }}
          >
            No vocabulary available
          </Text>
          <Text
            className="text-base text-center mb-6"
            style={{ color: colors.text.secondary }}
          >
            Please check your internet connection or try again later.
          </Text>
          <Pressable
            onPress={fetchRandomWord}
            className="rounded-2xl items-center justify-center py-4 px-8"
            style={{ backgroundColor: colors.primary.main }}
          >
            <Text
              className="text-base font-semibold"
              style={{ color: colors.text.button }}
            >
              Retry
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.background.primary }}
    >
      <View className="flex-1 justify-center items-center px-6">
        {/* Flashcard Container */}
        <View className="relative w-full flex-1 max-h-[500px] min-h-[400px]">
          {/* Front Side */}
          <Animated.View
            style={[
              {
                position: "absolute",
                backfaceVisibility: "hidden",
                width: "100%",
              },
              frontAnimatedStyle,
            ]}
          >
            <Pressable
              onPress={flipCard}
              className="rounded-2xl shadow-lg justify-center items-center self-center w-full h-full"
              style={{
                padding: 24,
                backgroundColor: colors.background.secondary,
                shadowColor: colors.text.primary,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 4,
              }}
            >
              {/* Refresh Button */}
              <Pressable
                className="absolute top-4 right-4"
                onPress={fetchRandomWord}
              >
                <Ionicons
                  name="refresh"
                  size={20}
                  color={colors.text.secondary}
                />
              </Pressable>

              {/* Word with POS */}
              <View
                className="flex-row items-center justify-center mb-4"
                onLayout={(event) => {
                  const measuredWidth = event.nativeEvent.layout.width;
                  setHeaderWidth(measuredWidth);
                }}
              >
                <Text
                  className="text-5xl font-bold"
                  style={{ color: colors.text.primary }}
                >
                  {currentWord.word}
                </Text>
                <Text
                  className="text-base ml-3"
                  style={{ color: colors.text.secondary }}
                >
                  {getPartOfSpeechFull(currentWord.pos)}
                </Text>
              </View>

              {/* Golden Dotted Line */}
              <View className="h-1" style={{ width: headerWidth ?? undefined }}>
                <View className="flex-row justify-between">
                  {[...Array(8)].map((_, i) => (
                    <View
                      key={i}
                      className="w-4 h-1 rounded-full"
                      style={{ backgroundColor: colors.accent.yellow }}
                    />
                  ))}
                </View>
              </View>
            </Pressable>
          </Animated.View>

          {/* Back Side */}
          <Animated.View
            style={[
              {
                position: "absolute",
                backfaceVisibility: "hidden",
                width: "100%",
              },
              backAnimatedStyle,
            ]}
          >
            <Pressable
              onPress={flipCard}
              className="rounded-2xl shadow-lg justify-center self-center w-full h-full"
              style={{
                padding: 24,
                backgroundColor: colors.background.secondary,
                shadowColor: colors.text.primary,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 4,
              }}
            >
              {/* Refresh Button */}
              <Pressable
                className="absolute top-4 right-4"
                onPress={fetchRandomWord}
              >
                <Ionicons
                  name="refresh"
                  size={20}
                  color={colors.text.secondary}
                />
              </Pressable>

              {/* Word with Syllables and POS */}
              <View className="flex-row items-center mb-2">
                <View className="flex-row items-center">
                  {currentWord?.prefix && (
                    <>
                      <Text
                        className="text-lg font-semibold"
                        style={{ color: colors.accent.red }}
                      >
                        {currentWord.prefix}
                      </Text>
                      <Text
                        className="text-sm mx-1"
                        style={{ color: colors.text.secondary }}
                      >
                        •
                      </Text>
                    </>
                  )}
                  <Text
                    className="text-lg font-semibold"
                    style={{ color: colors.text.primary }}
                  >
                    {currentWord?.word
                      ?.replace(currentWord?.prefix || "", "")
                      .replace(currentWord?.postfix || "", "") || "word"}
                  </Text>
                  {currentWord?.postfix && (
                    <>
                      <Text
                        className="text-sm mx-1"
                        style={{ color: colors.text.secondary }}
                      >
                        •
                      </Text>
                      <Text
                        className="text-lg font-semibold"
                        style={{ color: colors.accent.green }}
                      >
                        {currentWord.postfix}
                      </Text>
                    </>
                  )}
                </View>
                <Text
                  className="text-sm ml-4 mr-2"
                  style={{ color: colors.text.secondary }}
                >
                  {getPartOfSpeechFull(currentWord.pos)}
                </Text>
                <Pressable className="ml-1">
                  <Ionicons
                    name="volume-high"
                    size={16}
                    color={colors.text.secondary}
                  />
                </Pressable>
              </View>

              {/* Pronunciation */}
              <Text
                className="text-base mb-3"
                style={{ color: colors.text.secondary }}
              >
                {currentWord.ipa}
              </Text>

              {/* Translation */}
              <Text
                className="text-xl font-medium mb-3"
                style={{ color: colors.text.primary }}
              >
                {currentWord.definition_vi}
              </Text>

              {/* Example */}
              <Text
                className="text-base mb-2"
                style={{ color: colors.text.secondary }}
              >
                {highlightWordInExample(
                  currentWord.example_en,
                  currentWord.word,
                  colors
                )}
              </Text>

              {/* Example Vietnamese */}
              {currentWord.example_vi && (
                <Text
                  className="text-base mb-6"
                  style={{ color: colors.text.secondary }}
                >
                  {currentWord.example_vi}
                </Text>
              )}

              {/* Anatomy Section */}
              <View>
                <Text
                  className="font-bold text-lg mb-3"
                  style={{ color: colors.text.primary }}
                >
                  Anatomy
                </Text>

                {/* Prefix */}
                {currentWord.prefix && (
                  <View className="flex-row items-center mb-2">
                    <View className="flex-row items-center w-40">
                      <View
                        className="rounded-l-full px-3 py-1 w-[60px]"
                        style={{ backgroundColor: colors.accent.red }}
                      >
                        <Text className="text-white text-xs font-medium text-center">
                          Prefix
                        </Text>
                      </View>
                      <Text
                        className="ml-3 text-base font-semibold"
                        style={{ color: colors.text.primary }}
                      >
                        {currentWord.prefix}-
                      </Text>
                    </View>
                    <Text
                      className="flex-1 ml-8 text-base text-left"
                      style={{ color: colors.text.secondary }}
                    >
                      {currentWord.prefix_meaning}
                    </Text>
                  </View>
                )}

                {/* Infix */}
                {currentWord.infix && (
                  <View className="flex-row items-center mb-2">
                    <View className="flex-row items-center w-40">
                      <View
                        className="rounded-l-full px-3 py-1 w-[60px]"
                        style={{ backgroundColor: colors.accent.purple }}
                      >
                        <Text className="text-white text-xs font-medium text-center">
                          Infix
                        </Text>
                      </View>
                      <Text
                        className="ml-3 text-base font-semibold"
                        style={{ color: colors.text.primary }}
                      >
                        -{currentWord.infix}-
                      </Text>
                    </View>
                    <Text
                      className="flex-1 ml-8 text-base text-left"
                      style={{ color: colors.text.secondary }}
                    >
                      {currentWord.infix_meaning}
                    </Text>
                  </View>
                )}

                {/* Postfix */}
                {currentWord.postfix && (
                  <View className="flex-row items-center">
                    <View className="flex-row items-center w-40">
                      <View
                        className="rounded-l-full px-3 py-1 w-[60px]"
                        style={{ backgroundColor: colors.accent.green }}
                      >
                        <Text className="text-white text-xs font-medium text-center">
                          Postfix
                        </Text>
                      </View>
                      <Text
                        className="ml-3 text-base font-semibold"
                        style={{ color: colors.text.primary }}
                      >
                        -{currentWord.postfix}
                      </Text>
                    </View>
                    <Text
                      className="flex-1 ml-8 text-base text-left"
                      style={{ color: colors.text.secondary }}
                    >
                      {currentWord.postfix_meaning}
                    </Text>
                  </View>
                )}
              </View>
            </Pressable>
          </Animated.View>
        </View>

        {/* Complete Button */}
        {currentWord && !loading && (
          <View className="mt-6 w-full">
            <Pressable
              onPress={handleComplete}
              className="rounded-2xl items-center justify-center py-4 w-full"
              style={{ backgroundColor: colors.primary.main }}
            >
              <Text
                className="text-lg font-semibold"
                style={{ color: colors.text.button }}
              >
                Complete
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Flashcard;
