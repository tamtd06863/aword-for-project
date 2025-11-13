import { useTheme } from "@react-navigation/native";
import { Trophy } from "lucide-react-native";
import React, { useMemo } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { useGetTotalLearnedVocabCountQuery } from "@/lib/features/vocab/vocabApi";
import { getColors } from "@/utls/colors";

type Achievement = {
  threshold: number;
  title: string;
  description: string;
  wordsLabel?: string;
  rank?: string;
  tone?: string;
  rarity?: string;
};

const { width } = Dimensions.get("window");
const CARD_WIDTH = Math.min(520, width * 0.92);

const RARITY_STYLES: Record<
  string,
  { cardBg: string; iconBg: string; textColor: string }
> = {
  common: { cardBg: "#F0FFF4", iconBg: "#D1FAE5", textColor: "#10B981" }, // green
  rare: { cardBg: "#F0F9FF", iconBg: "#E0F2FE", textColor: "#3B82F6" }, // blue
  epic: { cardBg: "#F5F3FF", iconBg: "#EDE9FE", textColor: "#7C3AED" }, // purple
  legendary: { cardBg: "#FFF1F8", iconBg: "#FFE4F0", textColor: "#EC4899" }, // pink
  mythic: { cardBg: "#FFF7ED", iconBg: "#FFEDD5", textColor: "#F97316" }, // orange
  ultimate: { cardBg: "#FFF1F2", iconBg: "#FEE2E2", textColor: "#EF4444" }, // red
};

const ACHIEVEMENTS: Achievement[] = [
  {
    threshold: 10,
    title: "Rising Learner",
    description: "Complete 10 words",
    wordsLabel: "10 words",
    rank: "Basic",
    tone: "#FFF4E6",
    rarity: "common",
  },
  {
    threshold: 20,
    title: "Vocabulary Specialist",
    description: "Complete 20 words",
    wordsLabel: "20 words",
    rank: "Expert",
    tone: "#E8F8FF",
    rarity: "rare",
  },
  {
    threshold: 50,
    title: "Vocabulary Master",
    description: "Complete 50 words",
    wordsLabel: "50 words",
    rank: "Master",
    tone: "#F3F0FF",
    rarity: "epic",
  },
  {
    threshold: 100,
    title: "Vocabulary Monarch",
    description: "Complete 100 words",
    wordsLabel: "100 words",
    rank: "Legendary",
    tone: "#F0E6FF",
    rarity: "legendary",
  },
  {
    threshold: 200,
    title: "Vocabulary Machine",
    description: "Complete 200 words",
    wordsLabel: "200 words",
    rank: "Mythic",
    tone: "#F0E6FF",
    rarity: "mythic",
  },
  {
    threshold: 500,
    title: "Living Dictionary",
    description: "Complete 500 words",
    wordsLabel: "500 words",
    rank: "Ultimate",
    tone: "#F0E6FF",
    rarity: "ultimate",
  },
];

export default function Achievements() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const colors = getColors(isDark);
  const navTheme = useTheme();
  const primary =
    navTheme?.colors?.primary ??
    (isDark ? colors.accent.purple : colors.accent.blue);

  // real data hook
  const { data: learnedCount, isLoading: isLoadingLearned } =
    useGetTotalLearnedVocabCountQuery();
  const totalWords = learnedCount ?? 0;

  const unlocked = useMemo(
    () => ACHIEVEMENTS.filter((a) => totalWords >= a.threshold),
    [totalWords],
  );
  const unlockedCount = unlocked.length;
  const nextMilestone = ACHIEVEMENTS.find((a) => a.threshold > totalWords);
  const nextThreshold = nextMilestone
    ? nextMilestone.threshold
    : ACHIEVEMENTS[ACHIEVEMENTS.length - 1].threshold;
  const progress = nextMilestone ? Math.min(totalWords / nextThreshold, 1) : 1;

  return (
    <View
      style={[
        styles.safe,
        {
          backgroundColor: isDark
            ? colors.background.primary
            : styles.safe.backgroundColor,
        },
      ]}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={[styles.iconCircle, { backgroundColor: primary }]}>
            <Trophy color="#fff" size={22} />
          </View>
          <Text style={[styles.pageTitle, { color: primary, marginLeft: 12 }]}>
            Achievements
          </Text>
        </View>

        {/* Info Card */}
        <View
          style={[
            styles.infoCard,
            {
              width: CARD_WIDTH,
              backgroundColor: isDark
                ? colors.surface.tertiary
                : styles.infoCard.backgroundColor,
              shadowOpacity: isDark ? 0 : styles.infoCard.shadowOpacity,
              borderColor: isDark ? colors.border.primary : "transparent",
              borderWidth: isDark ? 1 : 0,
            },
          ]}
        >
          <View style={styles.infoTop}>
            <View style={styles.infoLeft}>
              <Text
                style={[
                  styles.infoLabel,
                  {
                    color: isDark
                      ? colors.text.secondary
                      : styles.infoLabel.color,
                  },
                ]}
              >
                Total Words Learned
              </Text>
              <Text style={[styles.infoNumber, { color: primary }]}>
                {isLoadingLearned ? "-" : `${totalWords} words`}
              </Text>
            </View>

            <View style={styles.infoRight}>
              <Text
                style={[
                  styles.infoLabel,
                  {
                    color: isDark
                      ? colors.text.secondary
                      : styles.infoLabel.color,
                  },
                ]}
              >
                Achievements
              </Text>
              <Text
                style={[
                  styles.infoNumber,
                  {
                    color: isDark
                      ? colors.text.primary
                      : styles.infoNumber.color,
                  },
                ]}
              >
                {isLoadingLearned
                  ? "-/-"
                  : `${unlockedCount}/${ACHIEVEMENTS.length} unlocked`}
              </Text>
            </View>
          </View>

          <View style={styles.progressRow}>
            <View style={styles.progressTextRow}>
              <Text
                style={[
                  styles.progressLabel,
                  {
                    color: isDark
                      ? colors.text.secondary
                      : styles.progressLabel.color,
                  },
                ]}
              >
                Progress to next milestone
              </Text>
              <Text
                style={[
                  styles.progressSub,
                  {
                    color: isDark
                      ? colors.text.secondary
                      : styles.progressSub.color,
                  },
                ]}
              >
                {isLoadingLearned
                  ? "-/ -"
                  : `${totalWords}/${nextThreshold} words`}
              </Text>
            </View>
            <View
              style={[
                styles.progressBarBg,
                {
                  backgroundColor: isDark
                    ? colors.surface.secondary
                    : styles.progressBarBg.backgroundColor,
                },
              ]}
            >
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${progress * 100}%`, backgroundColor: primary },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Achievements list */}
        <View style={{ width: CARD_WIDTH, marginTop: 14 }}>
          {ACHIEVEMENTS.map((a) => {
            const achieved = totalWords >= a.threshold;
            const rarity = (a as any).rarity ?? "common";
            const rstyle = RARITY_STYLES[rarity] ?? RARITY_STYLES.common;
            const cardBg = achieved
              ? isDark
                ? colors.surface.secondary
                : rstyle.cardBg
              : isDark
                ? colors.surface.primary
                : "#fff";
            const iconBg = achieved
              ? isDark
                ? colors.surface.tertiary
                : rstyle.iconBg
              : isDark
                ? colors.surface.secondary
                : "#f2f2f4";
            const textColor = achieved
              ? rstyle.textColor
              : isDark
                ? colors.text.secondary
                : "#888";

            return (
              <View
                key={a.threshold}
                style={[
                  styles.achCard,
                  {
                    backgroundColor: cardBg,
                    borderColor: achieved
                      ? rstyle.textColor
                      : isDark
                        ? colors.border.secondary
                        : "#F2F2F6",
                    shadowOpacity: isDark ? 0 : styles.achCard.shadowOpacity,
                  },
                ]}
              >
                <View style={[styles.achIconWrap, { backgroundColor: iconBg }]}>
                  <Trophy
                    color={
                      achieved
                        ? rstyle.textColor
                        : isDark
                          ? colors.text.tertiary
                          : "#aaa"
                    }
                    size={34}
                  />
                </View>

                <View style={styles.achBody}>
                  <Text style={[styles.achTitle, { color: textColor }]}>
                    {a.title}
                  </Text>
                  <Text
                    style={[
                      styles.achDesc,
                      {
                        color: isDark
                          ? colors.text.secondary
                          : styles.achDesc.color,
                      },
                    ]}
                  >
                    {a.description}
                  </Text>
                </View>

                <View style={styles.achBadgeWrap}>
                  <View
                    style={[
                      styles.achBadge,
                      {
                        backgroundColor: achieved
                          ? rstyle.textColor
                          : isDark
                            ? colors.surface.secondary
                            : "#ddd",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.achBadgeText,
                        {
                          color: achieved
                            ? "#fff"
                            : isDark
                              ? colors.text.secondary
                              : "#666",
                        },
                      ]}
                    >
                      {a.wordsLabel}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f6f6fb", paddingVertical: 20 },
  container: { alignItems: "center" },

  headerRow: {
    width: CARD_WIDTH,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2a4cf3",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  pageTitle: { fontSize: 18, fontWeight: "700" },

  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  infoTop: { flexDirection: "row", justifyContent: "space-between" },
  infoLeft: {},
  infoRight: { alignItems: "flex-end" },
  infoLabel: { color: "#999", fontSize: 12 },
  infoNumber: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 6,
    color: "#2a4cf3",
  },

  progressRow: { marginTop: 12 },
  progressTextRow: { flexDirection: "row", justifyContent: "space-between" },
  progressLabel: { color: "#666", fontSize: 13 },
  progressSub: { color: "#666", fontSize: 13 },
  progressBarBg: {
    marginTop: 8,
    height: 8,
    backgroundColor: "#eee",
    borderRadius: 8,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 8,
  },

  /* achievement cards */
  achCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F2F2F6",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  achIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  achBody: { flex: 1 },
  achTitle: { fontSize: 15, fontWeight: "700" },
  achDesc: { color: "#666", marginTop: 6, fontSize: 13 },
  achBadgeWrap: { marginLeft: 8 },
  achBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  achBadgeText: { fontWeight: "700" },
});
