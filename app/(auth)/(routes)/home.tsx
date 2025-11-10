import { useAppSelector } from "@/lib/hooks";
import { getColors } from "@/utls/colors";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import LottieView from "lottie-react-native";
import { useColorScheme } from "nativewind";
import React, { useEffect, useRef } from "react";
import { Animated, Button, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUpdateVocabsProgressMutation } from "@/lib/features/vocab/vocabApi";

const Home = () => {
  const flameAnimation = useRef<LottieView>(null);
  const gradientAnimation = useRef(new Animated.Value(0)).current;
  const user = useAppSelector((state) => state.auth.auth);
  const { colorScheme } = useColorScheme();
  const [updateProgress, { isLoading: isUpdatingProgress }] =
    useUpdateVocabsProgressMutation();

  const colors = getColors(colorScheme === "dark");

  useEffect(() => {
    flameAnimation.current?.play();

    // Gradient animation
    const animateGradient = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(gradientAnimation, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: false,
          }),
          Animated.timing(gradientAnimation, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: false,
          }),
        ]),
      ).start();
    };
    animateGradient();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900 px-5 pt-10">
      {/* Header */}
      <View className="flex-row justify-between items-center">
        <Pressable
          onPress={() => router.push("/profile")}
          className="flex-row items-center"
        >
          {user?.avatar_url ? (
            <>
              <Image
                source={{ uri: user.avatar_url }}
                className="w-10 h-10 rounded-full mr-2"
              />
              <Text className="text-base font-semibold text-gray-900 dark:text-white">
                {user.name}
              </Text>
            </>
          ) : (
            <Image
              source={{ uri: "https://i.pravatar.cc/100" }}
              className="w-10 h-10 rounded-full mr-2"
            />
          )}
        </Pressable>

        <View className="flex-row">
          <Link href={"/setting"} asChild>
            <Pressable className="ml-3">
              <Ionicons
                name="settings-outline"
                size={32}
                color={colors.text.primary}
              />
            </Pressable>
          </Link>
        </View>
      </View>

      {/* Streak */}
      <View className="flex-row items-center mt-6 self-end">
        <LottieView
          ref={flameAnimation}
          autoPlay
          loop
          style={{
            width: 40,
            height: 40,
          }}
          source={require("../../../assets/animations/streak-fire.json")}
        />
        <Animated.Text
          className="ml-2 font-semibold text-2xl"
          style={{
            color: gradientAnimation.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: ["#FF6B35", "#FFD23F", "#FF6B35"],
            }),
          }}
        >
          20 streak
        </Animated.Text>
      </View>

      {/* Title */}
      <Text className="text-5xl font-semibold text-gray-600 dark:text-gray-300 my-8 text-right">
        30 words
      </Text>

      {/* Menu buttons */}
      <Link href={"/learning"} asChild>
        <Pressable
          className="mb-6 rounded-2xl shadow-sm"
          style={{ backgroundColor: colors.primary.main }}
        >
          <View className="flex-row items-center p-5">
            <MaterialCommunityIcons
              name="book-open-page-variant"
              size={48}
              color={colors.text.button}
            />
            <View className="ml-5">
              <Text
                className="font-semibold text-3xl"
                style={{ color: colors.text.button }}
              >
                Learning
              </Text>
              <Text className="text-lg" style={{ color: colors.text.button }}>
                lesson #20
              </Text>
            </View>
          </View>
        </Pressable>
      </Link>

      <Link href={"/flashcard"} asChild>
        <Pressable
          className="mb-6 rounded-2xl shadow-sm"
          style={{ backgroundColor: colors.primary.main }}
        >
          <View className="flex-row items-center p-5">
            <MaterialCommunityIcons
              name="cards-outline"
              size={48}
              color={colors.text.button}
            />
            <View className="ml-5">
              <Text
                className="font-semibold text-3xl"
                style={{ color: colors.text.button }}
              >
                Flashcard
              </Text>
              <Text className="text-lg" style={{ color: colors.text.button }}>
                No. of card 30
              </Text>
            </View>
          </View>
        </Pressable>
      </Link>

      <Link href={"/wordex"} asChild>
        <Pressable
          className="mb-6 rounded-2xl shadow-sm"
          style={{ backgroundColor: colors.primary.main }}
        >
          <View className="flex-row items-center p-5">
            <Ionicons
              name="search-outline"
              size={48}
              color={colors.text.button}
            />
            <View className="ml-5">
              <Text
                className="font-semibold text-3xl"
                style={{ color: colors.text.button }}
              >
                Wordex
              </Text>
              <Text className="text-lg" style={{ color: colors.text.button }}>
                Looking for a word
              </Text>
            </View>
          </View>
        </Pressable>
      </Link>

      <Link href={"/leaderboard"} asChild>
        <Pressable
          className="mb-6 rounded-2xl shadow-sm"
          style={{ backgroundColor: colors.primary.main }}
        >
          <View className="flex-row items-center p-5">
            <Ionicons
              name="ribbon-outline"
              size={48}
              color={colors.text.button}
            />
            <View className="ml-5">
              <Text
                className="font-semibold text-3xl"
                style={{ color: colors.text.button }}
              >
                Leaderboard
              </Text>
              <Text className="text-lg" style={{ color: colors.text.button }}>
                Your learning rank
              </Text>
            </View>
          </View>
        </Pressable>
      </Link>
    </SafeAreaView>
  );
};

export default Home;
