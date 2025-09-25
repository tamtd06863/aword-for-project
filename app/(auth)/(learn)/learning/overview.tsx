import { Link } from "expo-router";
import React from "react";
import { Button, Text, View } from "react-native";

const Overview = () => {
  return (
    <View>
      <Text>Overview Page</Text>
      <Link href={"/home"} asChild>
        <Button title={"Home"} onPress={() => {}} />
      </Link>
    </View>
  );
};

export default Overview;
