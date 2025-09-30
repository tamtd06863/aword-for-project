import { useAuthContext } from "@/hooks/AuthContext";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export function SplashScreenController() {
  const { isLoading } = useAuthContext();

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate loading
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        if (!isLoading) {
          await SplashScreen.hideAsync();
        }
      }
    }

    prepare();
  }, [isLoading]);

  return null;
}
