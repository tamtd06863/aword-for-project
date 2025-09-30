import { Vocabulary } from "@/models/Vocabulary";
import { getColors } from "@/utls/colors";
import { useColorScheme } from "nativewind";
import React, { useState } from "react";
import { View } from "react-native";
import FlashcardNormal from "./flashcard-normal";
import FlashcardSorting from "./flashcard-sorting";

const Flashcard = () => {
  const { colorScheme } = useColorScheme();
  const colors = getColors(colorScheme === "dark");
  const [isSortingMode, setIsSortingMode] = useState(false);
  const [sortingData, setSortingData] = useState<Vocabulary[]>([]);

  const handleEnterSortingMode = (vocabularyData: Vocabulary[]) => {
    setSortingData(vocabularyData);
    setIsSortingMode(true);
  };

  const handleExitSortingMode = () => {
    setIsSortingMode(false);
    setSortingData([]);
  };

  return (
    <View style={{ flex: 1 }}>
      {isSortingMode ? (
        <FlashcardSorting
          seedHistory={sortingData}
          onExitSorting={handleExitSortingMode}
        />
      ) : (
        <FlashcardNormal onEnterSortingMode={handleEnterSortingMode} />
      )}
    </View>
  );
};

export default Flashcard;
