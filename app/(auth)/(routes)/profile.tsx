import React from "react";
import { Button, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@/lib/supabase";

const Profile = () => {
  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <SafeAreaView>
      <Button title={"Logout"} onPress={logout} />
      <Text>Profile Page</Text>
    </SafeAreaView>
  );
};

export default Profile;
