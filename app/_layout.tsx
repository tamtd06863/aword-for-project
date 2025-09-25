import { Stack } from "expo-router";
import "./global.css";
import { vars, useColorScheme } from "nativewind";
import { View } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "@/lib/store";
import React from "react";

const themes = {
  blue: {
    light: vars({
      "--color-primary": "6 89 231",
    }),
    dark: vars({
      "--color-primary": "96 165 250",
    }),
  },
};

function Theme(props: { children: React.ReactNode }) {
  const { colorScheme } = useColorScheme();
  return (
    <View
      style={
        colorScheme === "dark"
          ? themes["blue"]["dark"]
          : themes["blue"]["light"]
      }
      className={"flex-1 bg-primary"}
    >
      {props.children}
    </View>
  );
}

function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = React.useRef<AppStore | null>(null);
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}

export default function RootLayout() {
  GoogleSignin.configure({
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    webClientId:
      "201454684001-c3febejgt4d32htaq0hhbu9qe223qkia.apps.googleusercontent.com",
    offlineAccess: false, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    forceCodeForRefreshToken: false, // [Android] related to `serverAuthCode`, read the docs link below *.
  });

  const getCurrentUser = async () => {
    try {
      const response = await GoogleSignin.signInSilently();
      if (isSuccessResponse(response)) {
        setState({ userInfo: response.data });
      } else if (isNoSavedCredentialFoundResponse(response)) {
        // user has not signed in yet, or they have revoked access
      }
    } catch (error) {
      // handle errror
    }
  };

  React.useEffect(() => {
    const fetchUser = async () => {
      await getCurrentUser();
    };
    fetchUser().then((r) => {});
  }, []);

  return (
    <StoreProvider>
      <Theme>
        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack>
      </Theme>
    </StoreProvider>
  );
}
