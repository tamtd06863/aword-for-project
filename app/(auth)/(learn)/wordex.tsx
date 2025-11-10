import { Vocabulary } from "@/models/Vocabulary";
import { fetchAllVocabulary } from "@/supabase/vocabulary";
import { getColors } from "@/utls/colors";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppSelector } from "@/lib/hooks";

const Wordex = () => {
  const { colorScheme } = useColorScheme();
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string>("");
  // groupedData is a map: key -> { name: string, words: any[] }
  const [groupedData, setGroupedData] = useState<
    Record<string, { name: string; words: any[] }>
  >({});
  const [loading, setLoading] = useState(true);

  const searchQuery = useAppSelector((state) => state.search.query);

  const colors = getColors(colorScheme === "dark");

  useEffect(() => {
    loadVocabulary();
  }, []);

  const loadVocabulary = async () => {
    try {
      setLoading(true);
      const grouped = await fetchAllVocabulary();

      setGroupedData(grouped);
    } catch (error) {
      console.error("Error loading vocabulary:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter group keys by group name or key (search)
  const filteredGroupKeys = Object.keys(groupedData).filter((key) => {
    const group = groupedData[key];
    const name = group?.name ?? key;
    return (
      name.toLowerCase().includes(search.toLowerCase()) ||
      key.toLowerCase().includes(search.toLowerCase())
    );
  });

  const renderItem: ListRenderItem<Vocabulary> = ({ item }) => (
    <View
      className="mt-3 pl-4 border-l-2 ml-2 pb-3"
      style={{ borderColor: colors.accent.blue }}
    >
      <Text
        className="text-2xl font-bold mb-2"
        style={{ color: colors.text.primary }}
      >
        {item.word}
      </Text>
      <Text className="text-lg mb-2" style={{ color: colors.text.secondary }}>
        {item.phonetic}
      </Text>
      <Text className="text-lg mb-2" style={{ color: colors.text.primary }}>
        {item.definition_vi}
      </Text>

      {/* Example */}
      {item.example_en && (
        <View
          className="mt-2 mb-2 p-2 rounded-lg"
          style={{ backgroundColor: colors.background.primary }}
        >
          <Text
            className="text-base italic mb-1"
            style={{ color: colors.text.secondary }}
          >
            {item.example_en}
          </Text>
          {item.example_vi && (
            <Text
              className="text-base"
              style={{ color: colors.text.secondary }}
            >
              {item.example_vi}
            </Text>
          )}
        </View>
      )}

      {/* Word Anatomy */}
      {(item.prefix || item.infix || item.postfix) && (
        <View className="mt-2">
          <Text
            className="text-base font-bold mb-2"
            style={{ color: colors.text.primary }}
          >
            Anatomy:
          </Text>

          {item.prefix && (
            <View className="flex-row items-center mb-1">
              <View
                className="px-2 py-1 rounded-md mr-2"
                style={{ backgroundColor: colors.accent.red }}
              >
                <Text className="text-xs text-white font-medium">Prefix</Text>
              </View>
              <Text
                className="text-base font-semibold mr-2"
                style={{ color: colors.accent.red }}
              >
                {item.prefix}-
              </Text>
              <Text
                className="text-sm flex-1"
                style={{ color: colors.text.secondary }}
              >
                {item.prefix_meaning}
              </Text>
            </View>
          )}

          {item.infix && (
            <View className="flex-row items-center mb-1">
              <View
                className="px-2 py-1 rounded-md mr-2"
                style={{ backgroundColor: colors.accent.purple }}
              >
                <Text className="text-xs text-white font-medium">Infix</Text>
              </View>
              <Text
                className="text-base font-semibold mr-2"
                style={{ color: colors.accent.purple }}
              >
                -{item.infix}-
              </Text>
              <Text
                className="text-sm flex-1"
                style={{ color: colors.text.secondary }}
              >
                {item.infix_meaning}
              </Text>
            </View>
          )}

          {item.postfix && (
            <View className="flex-row items-center mb-1">
              <View
                className="px-2 py-1 rounded-md mr-2"
                style={{ backgroundColor: colors.accent.green }}
              >
                <Text className="text-xs text-white font-medium">Postfix</Text>
              </View>
              <Text
                className="text-base font-semibold mr-2"
                style={{ color: colors.accent.green }}
              >
                -{item.postfix}
              </Text>
              <Text
                className="text-sm flex-1"
                style={{ color: colors.text.secondary }}
              >
                {item.postfix_meaning}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );

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

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.background.primary }}
    >
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

      {/* Danh sách nhóm (grouped by root/sub-root) */}
      <FlatList
        data={filteredGroupKeys}
        keyExtractor={(key) => key}
        renderItem={({ item: groupKey }) => {
          const group = groupedData[groupKey] ?? { name: groupKey, words: [] };
          return (
            <View
              className="m-3 rounded-xl p-3 shadow"
              style={{ backgroundColor: colors.background.secondary }}
            >
              <TouchableOpacity
                className="flex-row justify-between items-center"
                onPress={() =>
                  setExpanded(expanded === groupKey ? "" : groupKey)
                }
              >
                <View className="flex-1">
                  <Text
                    className="text-3xl font-bold"
                    style={{ color: colors.text.primary }}
                  >
                    {group.name}
                  </Text>
                  <Text
                    className="text-base mt-1"
                    style={{ color: colors.text.secondary }}
                  >
                    {group.words?.length || 0} words
                  </Text>
                </View>
                <Ionicons
                  name={expanded === groupKey ? "chevron-up" : "chevron-down"}
                  size={30}
                  color={colors.text.primary}
                />
              </TouchableOpacity>

              {expanded === groupKey && (
                <View className="mt-3">
                  <FlatList
                    data={group.words}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    scrollEnabled={false}
                  />
                </View>
              )}
            </View>
          );
        }}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center p-6">
            <Text
              className="text-base"
              style={{ color: colors.text.secondary }}
            >
              No vocabulary found.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default Wordex;
