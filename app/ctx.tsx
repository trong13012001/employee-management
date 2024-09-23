import React from "react";
import { useStorageState } from "./useStorageState";
import {useApi} from "./api";
import { Alert } from "react-native";

const AuthContext = React.createContext<{
  signIn: (data:{
    email: string;
    password: string;
  }) => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = React.useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");
  const { apiCall } = useApi()
  const signIn = async (data: { email: string; password: string }) => {
    try {
      const res = await apiCall.login(data);
      if (res.status === 200) {
        setSession(res.access_token); // Save the access token
      } else {
        Alert.alert("Login Failed", "Please check your email and password.");
      }
    } catch (error:any) {
      Alert.alert("Login Failed", error.message || "An error occurred.");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut: () => setSession(null),
        session,
        isLoading,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

