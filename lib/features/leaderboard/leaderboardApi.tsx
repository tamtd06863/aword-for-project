import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { leaderboardSupabase } from "@/lib/supabase";
import type { Profile } from "@/lib/features/profile/profileApi";

// Lightweight error shape for queryFn
type RtqError = { message: string; code?: string };

export type LeaderboardEntry = {
  profile: Profile;
  points_total: number;
  rank: number;
  last_event_at: string;
};

function parseLeaderboardPayload(payload: any): LeaderboardEntry[] {
  let raw = payload;

  // RPC may return a JSON string; parse it
  if (typeof raw === "string") {
    try {
      raw = JSON.parse(raw);
    } catch {
      return [];
    }
  }

  // If payload is wrapped or a single object, normalize to array
  if (!Array.isArray(raw)) {
    if (raw && Array.isArray(raw.leaderboard)) raw = raw.leaderboard;
    else if (raw && Array.isArray(raw.data)) raw = raw.data;
    else raw = raw ? [raw] : [];
  }

  // Basic shaping/validation
  return (raw as any[]).map((item) => {
    const profile = item.profile ?? {};
    return {
      profile: {
        id: String(profile.id ?? ""),
        created_at: String(profile.created_at ?? ""),
        email: String(profile.email ?? ""),
        full_name: String(profile.full_name ?? ""),
        avatar_url: String(profile.avatar_url ?? ""),
        streak_days: Number(profile.streak_days ?? 0),
        last_active_at: String(profile.last_active_at ?? ""),
      },
      points_total: Number(item.points_total ?? 0),
      rank: Number(item.rank ?? 0),
      last_event_at: String(item.last_event_at ?? ""),
    } as LeaderboardEntry;
  });
}

export const leaderboardApi = createApi({
  reducerPath: "leaderboardApi",
  baseQuery: fakeBaseQuery<RtqError>(),
  endpoints: (builder) => ({
    getCurrentWeekLeaderboard: builder.query<LeaderboardEntry[], void>({
      async queryFn() {
        try {
          const { data, error } = await leaderboardSupabase.rpc(
            "get_current_week_leaderboard_json",
          );

          if (error) {
            return { error: { message: error.message, code: error.code } };
          }

          const parsed = parseLeaderboardPayload(data);
          return { data: parsed };
        } catch (e: any) {
          return { error: { message: e?.message ?? "Unknown error" } };
        }
      },
      keepUnusedDataFor: 0,
      providesTags: ["Leaderboard"],
    }),
  }),
  tagTypes: ["Leaderboard"],
});

export const {
  useGetCurrentWeekLeaderboardQuery,
  useLazyGetCurrentWeekLeaderboardQuery,
} = leaderboardApi;
