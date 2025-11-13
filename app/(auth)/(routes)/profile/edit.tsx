import {
    useGetProfileQuery,
    useUpdateAvatarMutation,
    useUpdateProfileMutation,
} from "@/lib/features/profile/profileApi";
import { useAppSelector } from "@/lib/hooks";
import { supabase } from "@/lib/supabase";
import { getColors } from "@/utls/colors";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const EditProfile = () => {
  const { colorScheme } = useColorScheme();
  const colors = getColors(colorScheme === "dark");
  const user = useAppSelector((state) => state.auth.auth);
  const { data: profile } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdatingProfile }] =
    useUpdateProfileMutation();
  const [updateAvatar, { isLoading: isUploadingAvatar }] =
    useUpdateAvatarMutation();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  // Helper function to get avatar URL from path
  const getAvatarUrl = (avatarPath: string | null | undefined): string => {
    if (!avatarPath) {
      return user.avatar_url || "https://i.pravatar.cc/150";
    }
    // If it's already a full URL, return it
    if (avatarPath.startsWith("http://") || avatarPath.startsWith("https://")) {
      return avatarPath;
    }
    // Otherwise, it's a path in storage, get public URL
    const { data } = supabase.storage.from("avatars").getPublicUrl(avatarPath);
    return data.publicUrl;
  };

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || user.name || "");
      setEmail(profile.email || user.email || "");
      setPhoneNumber(""); // Phone number not in profile yet
      setAvatarUri(getAvatarUrl(profile.avatar_url));
    } else {
      setFullName(user.name || "");
      setEmail(user.email || "");
      setPhoneNumber("");
      setAvatarUri(getAvatarUrl(user.avatar_url));
    }
  }, [profile, user]);

  const handleSaveProfile = async () => {
    try {
      await updateProfile({
        full_name: fullName.trim(),
      }).unwrap();

      Alert.alert("Success", "Profile updated successfully", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.data?.message || error?.message || "Failed to update profile"
      );
    }
  };

  const handleChangePassword = () => {
    Alert.alert("Change Password", "Password change feature coming soon");
  };

  const handleEditAvatar = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Sorry, we need camera roll permissions to change your avatar!"
        );
        return;
      }

      // Show action sheet
      Alert.alert(
        "Select Avatar",
        "Choose an option",
        [
          {
            text: "Camera",
            onPress: async () => {
              const { status: cameraStatus } =
                await ImagePicker.requestCameraPermissionsAsync();
              if (cameraStatus !== "granted") {
                Alert.alert(
                  "Permission needed",
                  "Sorry, we need camera permissions!"
                );
                return;
              }
              const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
              });

              if (!result.canceled && result.assets[0]) {
                await uploadAvatar(result.assets[0].uri);
              }
            },
          },
          {
            text: "Photo Library",
            onPress: async () => {
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
              });

              if (!result.canceled && result.assets[0]) {
                await uploadAvatar(result.assets[0].uri);
              }
            },
          },
          {
            text: "Cancel",
            style: "cancel",
          },
        ],
        { cancelable: true }
      );
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to open image picker");
    }
  };

  const uploadAvatar = async (imageUri: string) => {
    try {
      const result = await updateAvatar({ imageUri }).unwrap();

      // Update local state with new avatar URL
      // The API returns the path, so we need to convert it to public URL
      if (result.avatar_url) {
        const { data } = supabase.storage
          .from("avatars")
          .getPublicUrl(result.avatar_url);
        setAvatarUri(data.publicUrl);
      }

      Alert.alert("Success", "Avatar updated successfully");
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.data?.message || error?.message || "Failed to upload avatar"
      );
    }
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.background.primary }}
    >
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Header */}
        <View className="px-6 pt-4 pb-4">
          <View className="flex-row items-center justify-between mb-2">
            <Pressable onPress={() => router.back()}>
              <Ionicons
                name="arrow-back"
                size={24}
                color={colors.text.primary}
              />
            </Pressable>
            <View className="flex-1 items-center">
              <Text
                className="text-xl font-bold"
                style={{ color: colors.text.primary }}
              >
                Profile settings
              </Text>
            </View>
            <View style={{ width: 24 }} />
          </View>
          <Text
            className="text-sm text-center"
            style={{ color: colors.text.secondary }}
          >
            Change your personal info.
          </Text>
        </View>

        {/* Profile Picture Section */}
        <View className="items-center px-6 mb-8 mt-4">
          <View className="relative">
            <View className="w-32 h-32 rounded-full overflow-hidden">
              {isUploadingAvatar ? (
                <View
                  className="w-full h-full items-center justify-center"
                  style={{ backgroundColor: colors.surface.secondary }}
                >
                  <ActivityIndicator
                    size="large"
                    color={colors.primary.main}
                  />
                </View>
              ) : (
                <Image
                  source={{
                    uri:
                      avatarUri ||
                      getAvatarUrl(profile?.avatar_url) ||
                      "https://i.pravatar.cc/150",
                  }}
                  className="w-full h-full"
                />
              )}
            </View>
            <Pressable
              className="absolute top-0 right-0 w-8 h-8 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.background.primary }}
              onPress={handleEditAvatar}
              disabled={isUploadingAvatar}
            >
              <Ionicons name="pencil" size={16} color={colors.text.primary} />
            </Pressable>
          </View>
        </View>

        {/* Form Fields */}
        <View className="px-6">
          {/* Full Name */}
          <View
            className="py-4 border-b"
            style={{ borderBottomColor: colors.border.primary }}
          >
            <Text
              className="text-sm mb-2"
              style={{ color: colors.text.secondary }}
            >
              Full name
            </Text>
            <TextInput
              className="text-base"
              style={{ color: colors.text.primary }}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter your full name"
              placeholderTextColor={colors.text.secondary}
            />
          </View>

          {/* Email */}
          <View
            className="py-4 border-b"
            style={{ borderBottomColor: colors.border.primary }}
          >
            <Text
              className="text-sm mb-2"
              style={{ color: colors.text.secondary }}
            >
              Email
            </Text>
            <TextInput
              className="text-base"
              style={{ color: colors.text.primary }}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor={colors.text.secondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Save Button */}
        <View className="px-6 mt-8">
          <Pressable
            className="rounded-2xl py-4 items-center justify-center"
            style={{
              backgroundColor: colors.primary.main,
              opacity: isUpdatingProfile ? 0.6 : 1,
            }}
            onPress={handleSaveProfile}
            disabled={isUpdatingProfile}
          >
            {isUpdatingProfile ? (
              <ActivityIndicator size="small" color={colors.text.inverse} />
            ) : (
              <Text
                className="text-base font-semibold"
                style={{ color: colors.text.inverse }}
              >
                Save settings
              </Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;

