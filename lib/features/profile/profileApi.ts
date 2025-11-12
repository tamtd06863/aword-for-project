import { supabase } from "@/lib/supabase";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

// Lightweight error shape for queryFn
type Error = { message: string; code?: string };

interface Profile {
  id: string;
  created_at: string;
  email: string;
  full_name: string;
  avatar_url: string;
  streak_days: number;
  last_active_at: string;
}

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery: fakeBaseQuery<Error>(),
  endpoints: (builder) => ({
    getProfile: builder.query<Profile, void>({
      async queryFn(_arg, _api, _extraOptions, _baseQuery) {
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) {
            return {
              error: {
                message: "User not authenticated",
                code: "UNAUTHORIZED",
              },
            };
          }

          const profileId = user.id;

          const { data, error } = await supabase
            .from("profiles")
            .select(
              "id, created_at, email, full_name, avatar_url, streak_days, last_active_at",
            )
            .eq("id", profileId)
            .single();

          if (error) {
            return {
              error: { message: error.message, code: error.code },
            };
          }

          return { data } as { data: Profile };
        } catch (e: any) {
          return {
            error: { message: e?.message ?? "Unknown error", code: "UNKNOWN" },
          };
        }
      },
    }),
  }),
});

export const { useGetProfileQuery, useLazyGetProfileQuery } = profileApi;
