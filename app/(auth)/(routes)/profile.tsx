import React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@/lib/supabase";
import SignOutButton from "@/components/sign-out-button";

const Profile = () => {
  return (
    <SafeAreaView>
      <SignOutButton />
      <Text>Profile Page</Text>
    </SafeAreaView>
  );
};

export default Profile;
