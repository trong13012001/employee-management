import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { SessionProvider } from "./ctx";
import { useApi } from "./api";
import { Redirect, router } from "expo-router";
export {
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  initialRouteName: "login",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const{apiCall}=useApi()
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });
  const authorization=async()=>{
    const res =await apiCall.authorization()
    if(res.status===403){
      SplashScreen.hideAsync();
      <Redirect href="/login" />
    }else{
      SplashScreen.hideAsync();

      router.replace('/')
    }
  }
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    authorization()
  }, []);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}
import { Slot } from "expo-router";
import React from "react";

function RootLayoutNav() {
  return (
    <SessionProvider>
      <Slot />
    </SessionProvider>
  );
}
