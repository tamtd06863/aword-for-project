import {useAppSelector} from "@/lib/hooks";
import {getColors} from "@/utls/colors";
import {Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import {Link, router} from "expo-router";
import LottieView from "lottie-react-native";
import {useColorScheme} from "nativewind";
import React, {useEffect, useRef} from "react";
import {Animated, Button, Image, Pressable, Text, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import SignOutButton from "@/components/SignOutButton";
import {useUpdateVocabsProgressMutation} from "@/lib/features/vocab/vocabApi";

const Home = () => {
    const flameAnimation = useRef<LottieView>(null);
    const gradientAnimation = useRef(new Animated.Value(0)).current;
    const user = useAppSelector((state) => state.auth.auth);
    const {colorScheme} = useColorScheme();
    const [updateProgress, {isLoading: isUpdatingProgress}] =
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
                                source={{uri: user.avatar_url}}
                                className="w-10 h-10 rounded-full mr-2"
                            />
                            <Text className="text-base font-semibold text-gray-900 dark:text-white">
                                {user.name}
                            </Text>
                        </>
                    ) : (
                        <Image
                            source={{uri: "https://i.pravatar.cc/100"}}
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

            <SignOutButton></SignOutButton>

            <Button title={'test'} onPress={async () => {
                const input = [
                    {
                        "correctAnswer": "decision",
                        "durationSec": 3,
                        "isCorrect": false,
                        "question": "He always makes a !empty when faced with tough choices.",
                        "userAnswer": "concise",
                        "vocabId": "b89d693f-14c2-4f0f-a412-b046c1fd911b"
                    }, {
                        "correctAnswer": "quyết tâm, quyết định",
                        "durationSec": 2,
                        "isCorrect": false,
                        "question": "What is the meaning of the word 'decide'?",
                        "userAnswer": "cái kéo",
                        "vocabId": "b89d693f-14c2-4f0f-a412-b046c1fd911b"
                    }, {
                        "correctAnswer": "concise",
                        "durationSec": 1,
                        "isCorrect": false,
                        "question": "For a !empty solution, please follow the steps outlined.",
                        "userAnswer": "precise",
                        "vocabId": "2b24f7f1-406d-4b28-8964-2b117f1d59cd"
                    }, {
                        "correctAnswer": "kiên quyết, minh bạch",
                        "durationSec": 1,
                        "isCorrect": false,
                        "question": "What does 'decisive' mean?",
                        "userAnswer": "đơn giản, súc tích",
                        "vocabId": "b89d693f-14c2-4f0f-a412-b046c1fd911b"
                    }, {
                        "correctAnswer": "concise",
                        "durationSec": 1,
                        "isCorrect": false,
                        "question": "She gave a !empty answer to the complex question.",
                        "userAnswer": "suicide",
                        "vocabId": "2b24f7f1-406d-4b28-8964-2b117f1d59cd"
                    }, {
                        "correctAnswer": "chính xác, tỉ mỉ",
                        "durationSec": 4,
                        "isCorrect": true,
                        "question": "What does 'precise' mean?",
                        "userAnswer": "chính xác, tỉ mỉ",
                        "vocabId": "69e471d4-a82e-48cc-851d-cef4728b35db"
                    }, {
                        "correctAnswer": "decisive",
                        "durationSec": 2,
                        "isCorrect": false,
                        "question": "He made a !empty move in the last minute of the game.",
                        "userAnswer": "concise",
                        "vocabId": "b89d693f-14c2-4f0f-a412-b046c1fd911b"
                    }, {
                        "correctAnswer": "cái kéo",
                        "durationSec": 1,
                        "isCorrect": false,
                        "question": "What is the meaning of 'scissors'?",
                        "userAnswer": "quyết tâm, quyết định",
                        "vocabId": "8e66024e-a963-4df6-b56f-9ffc02c617e8"
                    }, {
                        "correctAnswer": "suicide",
                        "durationSec": 3,
                        "isCorrect": true,
                        "question": "He was found with a note next to him, it looked like a !empty attempt.",
                        "userAnswer": "suicide",
                        "vocabId": "7fca4c2b-0de4-4252-8655-683cba974a9a"
                    }, {
                        "correctAnswer": "đơn giản, súc tích",
                        "durationSec": 3,
                        "isCorrect": true,
                        "question": "What does 'concise' mean?",
                        "userAnswer": "đơn giản, súc tích",
                        "vocabId": "2b24f7f1-406d-4b28-8964-2b117f1d59cd"
                    }]
                const allWords = [
                    {
                        question: "He always makes a !empty when faced with tough choices.",
                        answer_blocks: ["decision", "precise", "suicide", "concise"],
                        correct_answer: "decision",
                        type: "fill_in_blank",
                        vocab_id: "b89d693f-14c2-4f0f-a412-b046c1fd911b",
                    },
                    {
                        question: "What is the meaning of the word 'decide'?",
                        answer_blocks: [
                            "kiên quyết, minh bạch",
                            "chính xác, tỉ mỉ",
                            "quyết tâm, quyết định",
                            "cái kéo",
                        ],
                        correct_answer: "quyết tâm, quyết định",
                        type: "multiple_choice",
                        vocab_id: "b89d693f-14c2-4f0f-a412-b046c1fd911b",
                    },
                    {
                        question: "For a !empty solution, please follow the steps outlined.",
                        answer_blocks: ["decisive", "concise", "precise", "scissors"],
                        correct_answer: "concise",
                        type: "fill_in_blank",
                        vocab_id: "2b24f7f1-406d-4b28-8964-2b117f1d59cd",
                    },
                    {
                        question: "What does 'decisive' mean?",
                        answer_blocks: [
                            "kiên quyết, minh bạch",
                            "đơn giản, súc tích",
                            "sự quyết tâm, sự quyết định",
                            "tự sát",
                        ],
                        correct_answer: "kiên quyết, minh bạch",
                        type: "multiple_choice",
                        vocab_id: "b89d693f-14c2-4f0f-a412-b046c1fd911b",
                    },
                    {
                        question: "She gave a !empty answer to the complex question.",
                        answer_blocks: ["concise", "suicide", "precise", "decision"],
                        correct_answer: "concise",
                        type: "fill_in_blank",
                        vocab_id: "2b24f7f1-406d-4b28-8964-2b117f1d59cd",
                    },
                    {
                        question: "What does 'precise' mean?",
                        answer_blocks: [
                            "sự quyết tâm, sự quyết định",
                            "chính xác, tỉ mỉ",
                            "tự sát",
                            "cái kéo",
                        ],
                        correct_answer: "chính xác, tỉ mỉ",
                        type: "multiple_choice",
                        vocab_id: "69e471d4-a82e-48cc-851d-cef4728b35db",
                    },
                    {
                        question: "He made a !empty move in the last minute of the game.",
                        answer_blocks: ["precise", "decisive", "suicide", "concise"],
                        correct_answer: "decisive",
                        type: "fill_in_blank",
                        vocab_id: "b89d693f-14c2-4f0f-a412-b046c1fd911b",
                    },
                    {
                        question: "What is the meaning of 'scissors'?",
                        answer_blocks: [
                            "cái kéo",
                            "kiên quyết, minh bạch",
                            "tự sát",
                            "quyết tâm, quyết định",
                        ],
                        correct_answer: "cái kéo",
                        type: "multiple_choice",
                        vocab_id: "8e66024e-a963-4df6-b56f-9ffc02c617e8",
                    },
                    {
                        question:
                            "He was found with a note next to him, it looked like a !empty attempt.",
                        answer_blocks: ["decision", "decisive", "suicide", "scissors"],
                        correct_answer: "suicide",
                        type: "fill_in_blank",
                        vocab_id: "7fca4c2b-0de4-4252-8655-683cba974a9a",
                    },
                    {
                        question: "What does 'concise' mean?",
                        answer_blocks: [
                            "cái kéo",
                            "đơn giản, súc tích",
                            "quyết tâm, quyết định",
                            "chính xác, tỉ mỉ",
                        ],
                        correct_answer: "đơn giản, súc tích",
                        type: "multiple_choice",
                        vocab_id: "2b24f7f1-406d-4b28-8964-2b117f1d59cd",
                    },
                ];


                await updateProgress({questionResults: input, allWords: allWords as any[]})
            }}/>
            {/* Title */}
            <Text className="text-5xl font-semibold text-gray-600 dark:text-gray-300 my-8 text-right">
                30 words
            </Text>

            {/* Menu buttons */}
            <Link href={"/learning"} asChild>
                <Pressable
                    className="mb-6 rounded-2xl shadow-sm"
                    style={{backgroundColor: colors.primary.main}}
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
                                style={{color: colors.text.button}}
                            >
                                Learning
                            </Text>
                            <Text className="text-lg" style={{color: colors.text.button}}>
                                lesson #20
                            </Text>
                        </View>
                    </View>
                </Pressable>
            </Link>

            <Link href={"/flashcard"} asChild>
                <Pressable
                    className="mb-6 rounded-2xl shadow-sm"
                    style={{backgroundColor: colors.primary.main}}
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
                                style={{color: colors.text.button}}
                            >
                                Flashcard
                            </Text>
                            <Text className="text-lg" style={{color: colors.text.button}}>
                                No. of card 30
                            </Text>
                        </View>
                    </View>
                </Pressable>
            </Link>

            <Link href={"/wordex"} asChild>
                <Pressable
                    className="mb-6 rounded-2xl shadow-sm"
                    style={{backgroundColor: colors.primary.main}}
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
                                style={{color: colors.text.button}}
                            >
                                Wordex
                            </Text>
                            <Text className="text-lg" style={{color: colors.text.button}}>
                                Looking for a word
                            </Text>
                        </View>
                    </View>
                </Pressable>
            </Link>

            <Link href={"/leaderboard"} asChild>
                <Pressable
                    className="mb-6 rounded-2xl shadow-sm"
                    style={{backgroundColor: colors.primary.main}}
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
                                style={{color: colors.text.button}}
                            >
                                Leaderboard
                            </Text>
                            <Text className="text-lg" style={{color: colors.text.button}}>
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
