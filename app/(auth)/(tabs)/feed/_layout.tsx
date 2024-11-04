import Ionicons from "@expo/vector-icons/build/Ionicons";
import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor: "#fff",
        },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="profile/[id]" options={{ headerShown: false }} />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Thread",
          headerShadowVisible: false,
          headerTintColor: "black",
          headerBackTitle: "Back",
          headerTitleAlign: "center",
          headerRight: () => (
            <Ionicons name="notifications-outline" size={24} color="black" />
          ),
        }}
      />
    </Stack>
  );
};

export default Layout;
