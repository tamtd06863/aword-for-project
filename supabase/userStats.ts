import { supabase } from "@/lib/supabase";
import { UserStats, UserStatsUpdate } from "@/models/UserStats";

export const fetchUserStats = async (
  userId: string
): Promise<UserStats | null> => {
  try {
    const { data, error } = await supabase
      .from("user_stats")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Error fetching user stats:", error);
      return null;
    }

    return data as UserStats;
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return null;
  }
};

export const createUserStats = async (
  userId: string,
  initialStats?: Partial<UserStatsUpdate>
): Promise<UserStats | null> => {
  try {
    const defaultStats = {
      user_id: userId,
      streaks: 0,
      total_exp: 0,
      current_league: "Bronze",
      top_finishes: 0,
      ...initialStats,
    };

    const { data, error } = await supabase
      .from("user_stats")
      .insert(defaultStats)
      .select()
      .single();

    if (error) {
      console.error("Error creating user stats:", error);
      return null;
    }

    return data as UserStats;
  } catch (error) {
    console.error("Error creating user stats:", error);
    return null;
  }
};

export const updateUserStats = async (
  userId: string,
  updates: UserStatsUpdate
): Promise<UserStats | null> => {
  try {
    const { data, error } = await supabase
      .from("user_stats")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      console.error("Error updating user stats:", error);
      return null;
    }

    return data as UserStats;
  } catch (error) {
    console.error("Error updating user stats:", error);
    return null;
  }
};

export const upsertUserStats = async (
  userId: string,
  updates: UserStatsUpdate
): Promise<UserStats | null> => {
  try {
    const { data, error } = await supabase
      .from("user_stats")
      .upsert({
        user_id: userId,
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error upserting user stats:", error);
      return null;
    }

    return data as UserStats;
  } catch (error) {
    console.error("Error upserting user stats:", error);
    return null;
  }
};

export const getLeagueFromExp = (exp: number): string => {
  if (exp >= 10000) return "Diamond";
  if (exp >= 7500) return "Platinum";
  if (exp >= 5000) return "Gold";
  if (exp >= 2500) return "Silver";
  if (exp >= 1000) return "Bronze";
  return "Rookie";
};
