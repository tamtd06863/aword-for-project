import React from "react";
import { Stack } from "expo-router";
import { useAppDispatch } from "@/lib/hooks";
import { supabase } from "@/lib/supabase";
import { clearAuth, setAuth } from "@/lib/features/auth/authSlice";

const MainLayout = () => {
  const dispatch = useAppDispatch();

  React.useEffect(() => {
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
      }
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(learn)" options={{ headerShown: false }} />
      <Stack.Screen name="(routes)" options={{ headerShown: false }} />
    </Stack>
  );
};

export default MainLayout;
