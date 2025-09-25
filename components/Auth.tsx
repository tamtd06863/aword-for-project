// import statusCodes along with GoogleSignin
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { Button, Text } from "react-native";
import React from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setAuth } from "@/lib/features/auth/authSlice";
import { supabase } from "@/lib/supabase";

const Auth = () => {
  const [state, setState] = React.useState<{ userInfo?: any }>({});
  const userId = useAppSelector((state) => state.auth.auth.userId);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    console.log("userInfo changed", state.userInfo);
  }, [state]);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      console.log("Google sign-in response:", response.data?.idToken);

      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: response.data?.idToken,
      });

      if (error) {
        console.log("Supabase sign-in error:", error.message);
      }

      if (isSuccessResponse(response)) {
        setState({ userInfo: response.data });
      } else {
        // sign in was cancelled by user
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            // operation (eg. sign in) already in progress
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // Android only, play services not available or outdated
            break;
          default:
          // some other error happened
        }
      } else {
        // an error that's not related to google sign in occurred
      }
    }
  };

  return (
    <>
      {state.userInfo ? (
        <Text>Welcome {state.userInfo.user.name}</Text>
      ) : (
        <Button title={"Sign in with Google"} onPress={signIn} />
      )}
    </>
  );
};

export default Auth;
