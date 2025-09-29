import FlowPager from "@/components/FlowPager";
import NewWord from "@/components/NewWord";
import NewWordDetail from "@/components/NewWordDetail";
import QuizFourOptions from "@/components/QuizFourOptions";
import QuizResult from "@/components/QuizResult";
import { getColors } from "@/utls/colors";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import React from "react";
import { View } from "react-native";

const Index = () => {
  const { colorScheme } = useColorScheme();
  const colors = getColors(colorScheme === "dark");
  const [step, setStep] = React.useState(0);
  const [selected, setSelected] = React.useState<number | null>(null);
  const [checked, setChecked] = React.useState(false);

  return (
    <View
      className="flex-1"
      style={{ backgroundColor: colors.background.primary }}
    >
      <FlowPager index={step}>
        <NewWord
          word="adventure"
          progress={0.15}
          onContinue={() => setStep(1)}
        />

        <NewWordDetail
          progress={0.3}
          wordParts={[
            { text: "ad" },
            { text: "·" },
            { text: "vent" },
            { text: "·" },
            { text: "ure" },
          ]}
          pos="noun"
          ipa="/ədˈvɛn(t)SHər/"
          viDefinition="Chuyến phiêu lưu, mạo hiểm"
          example="Her recent adventures in Italy"
          anatomy={[
            {
              badgeLabel: "Prefix",
              part: "ad-",
              meaning: "Hướng đến",
            },
            {
              badgeLabel: "Origin",
              part: "-vent-",
              meaning: "Đi",
            },
            {
              badgeLabel: "Postfix",
              part: "-ure",
              meaning: "hậu tố",
            },
          ]}
          onContinue={() => setStep(2)}
        />

        <QuizFourOptions
          progress={0.45}
          title="Nghĩa của tiền tố"
          prompt="ad-"
          promptColorClass="text-red-600"
          options={[
            "A. phù hợp, thích hợp",
            "B. thẳng đến",
            "C. hướng đến",
            "D. hấp dẫn, thu hút",
          ]}
          selectedIndex={selected}
          onSelect={(i) => {
            setSelected(i);
            if (checked) setChecked(false);
          }}
          correctIndex={2}
          checked={checked}
          onCheck={() => {
            if (!checked) setChecked(true);
            else setStep(3);
          }}
          checkLabel="Check"
          continueLabel="Continue"
          correctMessage="Chính xác"
          incorrectMessage="Nghĩa của tiền tố ad- là: hướng đến"
        />

        <QuizResult
          stats={[
            {
              icon: "timer-outline",
              color: colors.accent.purple,
              text: "2:30 - Super fast",
            },
            {
              icon: "flame-outline",
              color: colors.accent.red,
              text: "10 in a row",
            },
            {
              icon: "flash-outline",
              color: colors.accent.yellow,
              text: "40 exp",
            },
          ]}
          onContinue={() => router.replace("/home")}
        />
      </FlowPager>
    </View>
  );
};

export default Index;
