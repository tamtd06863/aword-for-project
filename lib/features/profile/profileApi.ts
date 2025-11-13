import { supabase } from "@/lib/supabase";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

// Lightweight error shape for queryFn
type Error = { message: string; code?: string };

export interface Profile {
  id: string;
  created_at: string;
  email: string;
  full_name: string;
  avatar_url: string;
  streak_days: number;
  last_active_at: string;
}

export interface UpdateProfileInput {
  full_name?: string;
  email?: string;
}

export interface UpdateAvatarInput {
  imageUri: string;
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
      providesTags: ["Profile"],
    }),
    updateProfile: builder.mutation<Profile, UpdateProfileInput>({
      async queryFn(input, _api, _extraOptions, _baseQuery) {
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
          const updateData: Partial<Profile> = {};

          // Only update fields that are provided
          if (input.full_name !== undefined) {
            updateData.full_name = input.full_name.trim();
          }
          if (input.email !== undefined) {
            updateData.email = input.email.trim();
          }

          // Update profile in Supabase
          const { data, error } = await supabase
            .from("profiles")
            .update(updateData)
            .eq("id", profileId)
            .select(
              "id, created_at, email, full_name, avatar_url, streak_days, last_active_at",
            )
            .single();

          if (error) {
            return {
              error: { message: error.message, code: error.code },
            };
          }

          // Update auth metadata if full_name is being updated
          if (input.full_name !== undefined) {
            const { error: updateError } = await supabase.auth.updateUser({
              data: {
                full_name: input.full_name.trim(),
              },
            });

            if (updateError) {
              console.error("Error updating auth metadata:", updateError);
              // Don't fail the request if auth metadata update fails
            }
          }

          return { data } as { data: Profile };
        } catch (e: any) {
          return {
            error: { message: e?.message ?? "Unknown error", code: "UNKNOWN" },
          };
        }
      },
      invalidatesTags: ["Profile"],
    }),
    updateAvatar: builder.mutation<{ avatar_url: string }, UpdateAvatarInput>({
      async queryFn({ imageUri }, _api, _extraOptions, _baseQuery) {
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
          const filePath = `${profileId}/avatar`;

          // Read file as ArrayBuffer using fetch
          let bytes: Uint8Array;
          try {
            const response = await fetch(imageUri);
            const arrayBuffer = await response.arrayBuffer();
            bytes = new Uint8Array(arrayBuffer);
          } catch (fetchError: any) {
            return {
              error: {
                message:
                  fetchError?.message ||
                  "Failed to read image file. Please try again or select a different image.",
                code: "FILE_READ_ERROR",
              },
            };
          }

          // Determine content type from file extension
          const fileExt = imageUri.split(".").pop()?.toLowerCase() || "jpg";
          const contentType = `image/${fileExt === "jpg" ? "jpeg" : fileExt}`;

          // Upload to Supabase storage with path: profileId/avatar
          const { error: uploadError } = await supabase.storage
            .from("avatars")
            .upload(filePath, bytes, {
              contentType,
              upsert: true,
            });

          if (uploadError) {
            // If bucket doesn't exist or has permission issues
            if (
              uploadError.message.includes("Bucket") ||
              uploadError.message.includes("bucket")
            ) {
              return {
                error: {
                  message:
                    "Storage bucket 'avatars' not found. Please create it in Supabase Storage dashboard.",
                  code: uploadError.message,
                },
              };
            }
            return {
              error: {
                message:
                  uploadError.message || "Failed to upload avatar. Please try again.",
                code: uploadError.message,
              },
            };
          }

          // Update profile with the path (profileId/avatar)
          const { error: updateError } = await supabase
            .from("profiles")
            .update({ avatar_url: filePath })
            .eq("id", profileId);

          if (updateError) {
            return {
              error: { message: updateError.message, code: updateError.code },
            };
          }

          return { data: { avatar_url: filePath } };
        } catch (e: any) {
          return {
            error: { message: e?.message ?? "Unknown error", code: "UNKNOWN" },
          };
        }
      },
      invalidatesTags: ["Profile"],
    }),
  }),
  tagTypes: ["Profile"],
});

export const {
  useGetProfileQuery,
  useLazyGetProfileQuery,
  useUpdateProfileMutation,
  useUpdateAvatarMutation,
} = profileApi;
