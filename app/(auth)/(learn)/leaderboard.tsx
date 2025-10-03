import { Avatar } from "heroui-native";
import React from "react";
import { Image, ScrollView, Text, View } from "react-native";
import Foundation from "@expo/vector-icons/Foundation";
import { Divider } from "heroui-native";

const Leaderboard = () => {
  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      {/*<View className="flex-1 justify-center items-center">*/}
      {/*  <Text className="text-2xl font-bold text-gray-900 dark:text-white">*/}
      {/*    Leaderboard*/}
      {/*  </Text>*/}
      {/*  <Text className="text-gray-600 dark:text-gray-400 mt-2">*/}
      {/*    Coming soon...*/}
      {/*  </Text>*/}
      {/*</View>*/}

      <Ranks />
      <Divider />

      <ScrollView className={"flex-1 pt-2 h-full"}>
        <View className="px-5 py-5">
          {/* Promoted Section */}
          <View className={"flex flex-col gap-5"}>
            {leaderboardData.promoted.map((user, index) => (
              <View
                key={user.id}
                className={"w-full flex flex-row gap-2 items-center"}
              >
                <Text className={"font-bold"}>{index + 1}</Text>
                <ProfileCard
                  key={user.id}
                  id={user.id.toString()}
                  avatar={user.avatar}
                  points={user.points}
                />
              </View>
            ))}
          </View>

          <View
            className={
              "w-full flex flex-row items-center justify-center gap-3 my-5"
            }
          >
            <Foundation name="arrow-up" size={28} color="#31C75E" />
            <Text className={"text-[#31C75E] font-bold"}>Promotion group</Text>
            <Foundation name="arrow-up" size={28} color="#31C75E" />
          </View>

          {/* Regular Section */}
          <View className={"flex flex-col gap-5"}>
            {leaderboardData.regular.map((user, index) => (
              <View
                key={user.id}
                className={"w-full flex flex-row gap-2 items-center"}
              >
                <Text className={"font-bold"}>
                  {index + leaderboardData.promoted.length + 1}
                </Text>
                <ProfileCard
                  key={user.id}
                  id={user.id.toString()}
                  avatar={user.avatar}
                  points={user.points}
                />
              </View>
            ))}
          </View>

          <View
            className={
              "w-full flex flex-row items-center justify-center gap-3 my-5"
            }
          >
            <Foundation name="arrow-down" size={28} color="#C73133" />
            <Text className={"text-[#C73133] font-bold"}>Relegation group</Text>
            <Foundation name="arrow-down" size={28} color="#C73133" />
          </View>

          {/* Demoted Section */}
          <View className={"flex flex-col gap-5"}>
            {leaderboardData.demoted.map((user, index) => (
              <View
                key={user.id}
                className={"w-full flex flex-row gap-2 items-center"}
              >
                <Text className={"font-bold"}>
                  {index +
                    leaderboardData.promoted.length +
                    leaderboardData.regular.length +
                    1}
                </Text>
                <ProfileCard
                  key={user.id}
                  id={user.id.toString()}
                  avatar={user.avatar}
                  points={user.points}
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const ProfileCard = (props: { id: string; avatar: string; points: number }) => {
  const { id, avatar, points } = props;
  return (
    <View className="flex-row items-center justify-between flex-1">
      <View className="flex-row items-center gap-2">
        <Avatar size="sm" alt="">
          <Avatar.Image source={{ uri: avatar }} />
          <Avatar.Fallback>JD</Avatar.Fallback>
        </Avatar>
        <Text className="text-lg font-semibold text-gray-900 dark:text-white">
          User {id}
        </Text>
      </View>
      <Text className="text-gray-600 dark:text-gray-400">{points} pts</Text>
    </View>
  );
};

const Ranks = () => {
  return (
    <View className={"h-fit py-6"}>
      <ScrollView
        horizontal
        className={"w-full "}
        showsHorizontalScrollIndicator={false}
      >
        <View className={"px-5 flex flex-row gap-4"}>
          {ranks.map((rank) => (
            <View key={rank.id} className="flex h-fit items-center">
              <Image source={rank.image} style={{ width: 72, height: 72 }} />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const ranks = [
  {
    id: 20,
    image: require("../../../assets/images/bronze.png"),
    name: "Bronze Rank",
  },
  {
    id: 21,
    image: require("../../../assets/images/silver.png"),
    name: "Silver Rank",
  },
  {
    id: 22,
    image: require("../../../assets/images/gold.png"),
    name: "Gold Rank",
  },
  {
    id: 23,
    image: require("../../../assets/images/platinum.png"),
    name: "Platinum Rank",
  },
  {
    id: 24,
    image: require("../../../assets/images/diamond.png"),
    name: "Diamond Rank",
  },
];

const leaderboardData = {
  promoted: [
    {
      id: 1,
      avatar: "https://i.pravatar.cc/100?img=1",
      name: "Alice",
      points: 1500,
    },
    {
      id: 2,
      avatar: "https://i.pravatar.cc/100?img=2",
      name: "Bob",
      points: 1400,
    },
    {
      id: 3,
      avatar: "https://i.pravatar.cc/100?img=3",
      name: "Charlie",
      points: 1300,
    },
  ],
  regular: [
    {
      id: 4,
      avatar: "https://i.pravatar.cc/100?img=4",
      name: "David",
      points: 1200,
    },
    {
      id: 5,
      avatar: "https://i.pravatar.cc/100?img=5",
      name: "Eve",
      points: 1100,
    },
    {
      id: 6,
      avatar: "https://i.pravatar.cc/100?img=6",
      name: "Frank",
      points: 1000,
    },
    {
      id: 7,
      avatar: "https://i.pravatar.cc/100?img=7",
      name: "Grace",
      points: 900,
    },
    {
      id: 8,
      avatar: "https://i.pravatar.cc/100?img=8",
      name: "Heidi",
      points: 800,
    },
    {
      id: 9,
      avatar: "https://i.pravatar.cc/100?img=9",
      name: "Ivan",
      points: 700,
    },
    {
      id: 10,
      avatar: "https://i.pravatar.cc/100?img=10",
      name: "Judy",
      points: 600,
    },
  ],
  demoted: [
    {
      id: 11,
      avatar: "https://i.pravatar.cc/100?img=11",
      name: "Mallory",
      points: 500,
    },
    {
      id: 12,
      avatar: "https://i.pravatar.cc/100?img=12",
      name: "Niaj",
      points: 400,
    },
    {
      id: 13,
      avatar: "https://i.pravatar.cc/100?img=13",
      name: "Olivia",
      points: 300,
    },
  ],
};

const TopThreeCard = (props: {
  id: string;
  avatar: string;
  name: string;
  points: number;
  rank: number;
}) => {
  const bgColors = ["bg-yellow-300", "bg-gray-300", "bg-orange-300"];
  return (
    <View key={props.id} className="flex-row items-center justify-between mb-4">
      <View
        className={`flex-1 m-2 p-4 rounded-xl items-center ${bgColors[props.rank - 1]}`}
      >
        <Text className="text-lg font-semibold text-gray-900 dark:text-white mt-2">
          {props.name}
        </Text>
        <Text className="text-gray-600 dark:text-gray-400">
          {props.points} pts
        </Text>
        <View className="px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 mt-2">
          <Text className="text-sm font-bold text-gray-900 dark:text-white">
            #{props.rank}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Leaderboard;
