import { useTheme } from "@react-navigation/native";
import { Trophy } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
    threshold: 100,
    title: "Rising Learner",
    description: "Complete 100 words",
    wordsLabel: "100 words",
    rank: "Basic",
    tone: "#FFF4E6",
    rarity: "common",
  },
  {
    threshold: 200,
    title: "Vocabulary Specialist",
    description: "Complete 200 words",
    wordsLabel: "200 words",
    rank: "Expert",
    tone: "#E8F8FF",
    rarity: "rare",
  },
  {
    threshold: 500,
    title: "Vocabulary Master",
    description: "Complete 500 words",
    wordsLabel: "500 words",
    rank: "Master",
    tone: "#F3F0FF",
    rarity: "epic",
  },
  {
    threshold: 1000,
    title: "Vocabulary Monarch",
    description: "Complete 1000 words",
    wordsLabel: "1000 words",
    rank: "Legendary",
    tone: "#F0E6FF",
    rarity: "legendary",
  },
  {
    threshold: 2000,
    title: "Vocabulary Machine",
    description: "Complete 2000 words",
    wordsLabel: "2000 words",
    rank: "Mythic",
    tone: "#F0E6FF",
    rarity: "mythic",
  },
  {
    threshold: 5000,
    title: "Living Dictionary",
    description: "Complete 5000 words",
    wordsLabel: "5000 words",
    rank: "Ultimate",
    tone: "#F0E6FF",
    rarity: "ultimate",
  },
];

export default function Achievements() {
  // demo state (replace with real data)
  const [totalWords, setTotalWords] = useState<number>(200);

  // theme primary
  const scheme = useColorScheme();
  const navTheme = useTheme();
  const primary =
    navTheme?.colors?.primary ?? (scheme === "dark" ? "#9B3DF5" : "#2a4cf3");

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

  const demoButtons = useMemo(() => {
    const b = (n: number | "reset") => {
      const onPress = () =>
        n === "reset" ? setTotalWords(0) : setTotalWords(n);
      return (
        <TouchableOpacity
          key={String(n)}
          onPress={onPress}
          style={[
            styles.demoBtn,
            totalWords === n ? { backgroundColor: primary } : null,
          ]}
        >
          <Text
            style={[
              styles.demoBtnText,
              totalWords === n ? { color: "#fff" } : null,
            ]}
          >
            {n === "reset" ? "Reset" : `Set ${n}`}
          </Text>
        </TouchableOpacity>
      );
    };
    return (
      <View style={styles.demoRow}>
        {b(0)}
        {b(100)}
        {b(200)}
        {b(500)}
        {b(1000)}
        {b(2000)}
        {b(5000)}
        {b("reset")}
      </View>
    );
  }, [primary, totalWords]);

  return (
    <View style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header: Trophy icon + title on same row */}
        <View style={styles.headerRow}>
          <View style={[styles.iconCircle, { backgroundColor: primary }]}>
            <Trophy color="#fff" size={22} />
          </View>
          <Text style={[styles.pageTitle, { color: primary, marginLeft: 12 }]}>
            Achievements
          </Text>
        </View>

        {/* Info Card */}
        <View style={[styles.infoCard, { width: CARD_WIDTH }]}>
          <View style={styles.infoTop}>
            <View style={styles.infoLeft}>
              <Text style={styles.infoLabel}>Total Words Learned</Text>
              <Text style={[styles.infoNumber, { color: primary }]}>
                {totalWords} words
              </Text>
            </View>

            <View style={styles.infoRight}>
              <Text style={styles.infoLabel}>Achievements</Text>
              <Text style={styles.infoNumber}>
                {unlockedCount}/{ACHIEVEMENTS.length} unlocked
              </Text>
            </View>
          </View>

          <View style={styles.progressRow}>
            <View style={styles.progressTextRow}>
              <Text style={styles.progressLabel}>
                Progress to next milestone
              </Text>
              <Text style={styles.progressSub}>
                {totalWords}/{nextThreshold} words
              </Text>
            </View>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${progress * 100}%`, backgroundColor: primary },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Demo controls (optional) */}
        <View style={{ width: CARD_WIDTH, marginTop: 12 }}>{demoButtons}</View>

        {/* Achievements list (Trophy icon per card) */}
        <View style={{ width: CARD_WIDTH, marginTop: 14 }}>
          {ACHIEVEMENTS.map((a) => {
            const achieved = totalWords >= a.threshold;
            const rarity = (a as any).rarity ?? "common";
            const rstyle = RARITY_STYLES[rarity] ?? RARITY_STYLES.common;

            return (
              <View
                key={a.threshold}
                style={[
                  styles.achCard,
                  // when unlocked use card background per rarity and subtle border; when locked keep white background but reduced opacity
                  achieved
                    ? {
                        borderColor: rstyle.textColor,
                        backgroundColor: rstyle.cardBg,
                        shadowColor: rstyle.textColor,
                      }
                    : { opacity: 0.6, backgroundColor: "#fff" },
                ]}
              >
                <View
                  style={[
                    styles.achIconWrap,
                    // icon background uses rarity color when unlocked, muted when locked
                    { backgroundColor: achieved ? rstyle.iconBg : "#f2f2f4" },
                  ]}
                >
                  <Trophy
                    color={achieved ? rstyle.textColor : "#aaa"}
                    size={34}
                  />
                </View>

                <View style={styles.achBody}>
                  <Text
                    style={[
                      styles.achTitle,
                      achieved
                        ? { color: rstyle.textColor }
                        : { color: "#888" },
                    ]}
                  >
                    {a.title}
                  </Text>
                  <Text style={styles.achDesc}>{a.description}</Text>
                </View>

                <View style={styles.achBadgeWrap}>
                  <View
                    style={[
                      styles.achBadge,
                      achieved
                        ? { backgroundColor: rstyle.textColor }
                        : { backgroundColor: "#ddd" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.achBadgeText,
                        achieved ? { color: "#fff" } : { color: "#666" },
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
  infoNumber: { fontSize: 16, fontWeight: "700", marginTop: 6 },

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

  /* demo controls */
  demoRow: { flexDirection: "row", marginTop: 8, flexWrap: "wrap" },
  demoBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#eee",
    borderRadius: 10,
    marginRight: 8,
    marginTop: 8,
  },
  demoBtnText: { color: "#333", fontWeight: "600" },

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
