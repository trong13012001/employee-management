import { Button, StyleSheet, TextInput, Alert ,Text, View} from "react-native";
import React, { useState } from "react";
import { useSession } from "./ctx";
import { router } from "expo-router";

export default function Login() {
  const { signIn } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email) {
      Alert.alert("Thông báo", "Please type your email.");
      return;
    }
  
    if (!password) {
      Alert.alert("Input Required", "Please type your password.");
      return;
    }
  
    const data = { email, password };
  
    try {
      await signIn(data); // Await the signIn function
      router.replace("/"); // Navigate to the home screen after login

    } catch (error:any) {
      Alert.alert("Login Failed", error.message || "An error occurred.");
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome! 🌈 </Text>
      <Text style={styles.paragraph}>
        This is a simple repo that emulates a login authentication workflow
        using Expo Router, focused on the navigation aspect.
      </Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: "center",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  input: {
    width: "80%",
    borderWidth: 1,
    borderColor: "#000",
    padding: 10,
    margin: 10,
    borderRadius: 4,
  },
});
