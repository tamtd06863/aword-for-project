import React from "react";
import { Stack } from "expo-router";
import { useAppDispatch } from "@/lib/hooks";
import {
  GoogleSignin,
  isNoSavedCredentialFoundResponse,
  isSuccessResponse,
} from "@react-native-google-signin/google-signin";
import { supabase } from "@/lib/supabase";
import { clearAuth, setAuth } from "@/lib/features/auth/authSlice";

const MainLayout = () => {
  const dispatch = useAppDispatch();

  GoogleSignin.configure({
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    webClientId:
      "201454684001-c3febejgt4d32htaq0hhbu9qe223qkia.apps.googleusercontent.com",
    offlineAccess: false, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    forceCodeForRefreshToken: false, // [Android] related to `serverAuthCode`, read the docs link below *.
  });

  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    if (event === "INITIAL_SESSION") {
      // handle initial session
      if (session && session.user && session.user.email) {
        dispatch(
          setAuth({
            userId: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata.full_name,
            avatar_url: session.user.user_metadata.avatar_url,
          }),
        );
      }
    } else if (event === "SIGNED_IN") {
      if (session && session.user && session.user.email) {
        dispatch(
          setAuth({
            userId: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata.full_name,
            avatar_url: session.user.user_metadata.avatar_url,
          }),
        );
      }
      // handle sign in event
      console.log(event, session);
    } else if (event === "SIGNED_OUT") {
      // handle sign out event
      dispatch(clearAuth());
      GoogleSignin.signOut()
        .then(() => {
          // Sign-out successful.
          console.log("Google sign out successful");
        })
        .catch((error) => {
          // An error happened.
          if (isNoSavedCredentialFoundResponse(error)) {
            // no saved credentials found
            console.log("No saved credentials found");
          } else {
            console.error("Error signing out from Google:", error);
          }
        });
    }
  });

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(learn)" options={{ headerShown: false }} />
      <Stack.Screen name="(routes)" options={{ headerShown: false }} />
    </Stack>
  );
};

export default MainLayout;
