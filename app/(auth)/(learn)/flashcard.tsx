import { getColors } from "@/utls/colors";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import React, { useRef, useState } from "react";
import { Animated, Dimensions, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const Flashcard = () => {
  const { colorScheme } = useColorScheme();
  const [isFlipped, setIsFlipped] = useState(false);
  const flipAnimation = useRef(new Animated.Value(0)).current;

  const colors = getColors(colorScheme === "dark");

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

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.background.primary }}
    >
      <View className="flex-1 justify-center items-center">
        {/* Flashcard Container */}
        <View className="relative w-full max-w-sm h-80">
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
              className="rounded-2xl shadow-lg justify-center items-center self-center"
              style={{
                width: 320,
                height: 320,
                padding: 24,
                backgroundColor: colors.background.secondary,
                shadowColor: colors.text.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              {/* Refresh Button */}
              <Pressable className="absolute top-4 right-4">
                <Ionicons
                  name="refresh"
                  size={20}
                  color={colors.text.secondary}
                />
              </Pressable>

              {/* Word */}
              <Text
                className="text-4xl font-bold text-center mb-4"
                style={{ color: colors.text.primary }}
              >
                adventure
              </Text>

              {/* Golden Dotted Line */}
              <View className="w-32 h-1">
                <View className="flex-row justify-center">
                  {[...Array(8)].map((_, i) => (
                    <View
                      key={i}
                      className="w-2 h-1 rounded-full mx-1"
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
              className="rounded-2xl shadow-lg justify-center self-center"
              style={{
                width: 320,
                height: 320,
                padding: 24,
                backgroundColor: colors.background.secondary,
                shadowColor: colors.text.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              {/* Refresh Button */}
              <Pressable className="absolute top-4 right-4">
                <Ionicons
                  name="refresh"
                  size={20}
                  color={colors.text.secondary}
                />
              </Pressable>

              {/* Word with Syllables */}
              <View className="flex-row items-center mb-2">
                <View className="flex-row items-center">
                  <Text
                    className="text-lg font-semibold"
                    style={{ color: colors.accent.red }}
                  >
                    ad
                  </Text>
                  <Text
                    className="text-sm mx-1"
                    style={{ color: colors.text.secondary }}
                  >
                    •
                  </Text>
                  <Text
                    className="text-lg font-semibold"
                    style={{ color: colors.text.primary }}
                  >
                    vent
                  </Text>
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
                    ure
                  </Text>
                </View>
                <Pressable className="ml-3">
                  <Ionicons
                    name="volume-high"
                    size={16}
                    color={colors.text.secondary}
                  />
                </Pressable>
              </View>

              {/* Pronunciation */}
              <Text
                className="text-sm mb-3"
                style={{ color: colors.text.secondary }}
              >
                /əd'ven(t)SHər/
              </Text>

              {/* Word Type */}
              <Text
                className="text-sm absolute top-4 left-6"
                style={{ color: colors.text.secondary }}
              >
                noun
              </Text>

              {/* Translation */}
              <Text
                className="text-lg font-medium mb-3"
                style={{ color: colors.text.primary }}
              >
                Chuyến phiêu lưu, mạo hiểm
              </Text>

              {/* Example */}
              <Text
                className="text-sm mb-6"
                style={{ color: colors.text.secondary }}
              >
                Her recent adventures in Italy.
              </Text>

              {/* Anatomy Section */}
              <View>
                <Text
                  className="font-bold text-base mb-3"
                  style={{ color: colors.text.primary }}
                >
                  Anatomy
                </Text>

                {/* Prefix */}
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
                      className="ml-3 text-sm font-semibold"
                      style={{ color: colors.text.primary }}
                    >
                      ad-
                    </Text>
                  </View>
                  <Text
                    className="flex-1 ml-8 text-sm text-left"
                    style={{ color: colors.text.secondary }}
                  >
                    Hướng đến
                  </Text>
                </View>

                {/* Origin */}
                <View className="flex-row items-center mb-2">
                  <View className="flex-row items-center w-40">
                    <View
                      className="rounded-l-full px-3 py-1 w-[60px]"
                      style={{ backgroundColor: colors.text.primary }}
                    >
                      <Text className="text-white text-xs font-medium text-center">
                        Origin
                      </Text>
                    </View>
                    <Text
                      className="ml-3 text-sm font-semibold"
                      style={{ color: colors.text.primary }}
                    >
                      -vent-
                    </Text>
                  </View>
                  <Text
                    className="flex-1 ml-8 text-sm text-left"
                    style={{ color: colors.text.secondary }}
                  >
                    Đi
                  </Text>
                </View>

                {/* Postfix */}
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
                      className="ml-3 text-sm font-semibold"
                      style={{ color: colors.text.primary }}
                    >
                      -ure
                    </Text>
                  </View>
                  <Text
                    className="flex-1 ml-8 text-sm text-left"
                    style={{ color: colors.text.secondary }}
                  >
                    hậu tố
                  </Text>
                </View>
              </View>
            </Pressable>
          </Animated.View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Flashcard;
