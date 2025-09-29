import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import React, { useState } from "react";
import {
  FlatList,
  ListRenderItem,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type WordType = {
  word: string;
  phonetic: string;
  meaning: string;
};

const data: Record<string, WordType[]> = {
  "ad-": [
    {
      word: "adjust",
      phonetic: "/əˈʤʌst/",
      meaning: "ad(hướng đến) + just(chính xác/đúng)",
    },
    {
      word: "adverb",
      phonetic: "/ˈædˌvɜrb/",
      meaning: "ad(hướng đến) + verb(động từ)",
    },
    {
      word: "adventure",
      phonetic: "/ədˈvɛnʧər/",
      meaning: "ad(hướng đến) + vent(đi) + ure(hậu tố)",
    },
  ],
  "con-, com-, co": [
    {
      word: "connect",
      phonetic: "/kəˈnɛkt/",
      meaning: "con(cùng) + nect(nối)",
    },
    {
      word: "combine",
      phonetic: "/ˈkɑmˌbaɪn/",
      meaning: "com(cùng) + bine(ràng buộc)",
    },
  ],
  "sub-": [
    {
      word: "submarine",
      phonetic: "/ˈsʌbməˌrin/",
      meaning: "sub(dưới) + marine(biển)",
    },
    {
      word: "subway",
      phonetic: "/ˈsʌbˌweɪ/",
      meaning: "sub(dưới) + way(đường)",
    },
  ],
};

const Wordex = () => {
  const { colorScheme } = useColorScheme();
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string>("");

  const filteredPrefixes = Object.keys(data).filter((prefix) =>
    prefix.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem: ListRenderItem<WordType> = ({ item }) => (
    <View className="mt-2 pl-2">
      <Text className="text-base font-semibold text-gray-900 dark:text-white">
        {item.word}
      </Text>
      <Text className="text-sm text-gray-600 dark:text-gray-400">
        {item.phonetic}
      </Text>
      <Text className="text-xs text-gray-500 dark:text-gray-500">
        {item.meaning}
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      {/* Thanh Search */}
      {/*<View className="flex-row items-center bg-blue-600 px-3 py-2">*/}
      {/*    <Ionicons name="arrow-back" size={24} color="#fff"/>*/}
      {/*    <TextInput*/}
      {/*        className="flex-1 mx-3 text-white text-base"*/}
      {/*        placeholder="Search here..."*/}
      {/*        placeholderTextColor="#ccc"*/}
      {/*        value={search}*/}
      {/*        onChangeText={setSearch}*/}
      {/*    />*/}
      {/*    <Ionicons name="search" size={22} color="#fff"/>*/}
      {/*</View>*/}

      {/* Danh sách Prefix */}
      {filteredPrefixes.map((prefix) => (
        <View
          key={prefix}
          className="m-3 rounded-xl bg-gray-100 dark:bg-gray-800 p-3 shadow"
        >
          <TouchableOpacity
            className="flex-row justify-between items-center"
            onPress={() => setExpanded(expanded === prefix ? "" : prefix)}
          >
            <Text className="text-lg font-bold text-gray-900 dark:text-white">
              {prefix}
            </Text>
            <Ionicons
              name={expanded === prefix ? "remove" : "add"}
              size={22}
              color={colorScheme === "dark" ? "white" : "#000"}
            />
          </TouchableOpacity>

          {expanded === prefix && (
            <FlatList
              data={data[prefix]}
              keyExtractor={(item, idx) => item.word + idx}
              renderItem={renderItem}
            />
          )}
        </View>
      ))}
    </View>
  );
};

export default Wordex;
