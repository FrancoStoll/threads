import { Slot, Stack, useRouter, useSegments } from "expo-router";
import { ClerkProvider, ClerkLoaded, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@/utils/cache";
import { LogBox } from "react-native";
import {
  useFonts,
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from "@expo-google-fonts/dm-sans";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";

const clerkPublishedKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

if (!clerkPublishedKey) {
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
  );
}

LogBox.ignoreLogs(["Clerk: Clerk has been loaded with development keys"]);

// Prevent auto hide splash screen
SplashScreen.preventAutoHideAsync();

const InitialLayout = () => {
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  const { isLoaded, isSignedIn } = useAuth();
  const segment = useSegments();
  const router = useRouter();
  useEffect(() => {
    if (!fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    const inAuthGroup = segment[0] === "(auth)";

    if (!inAuthGroup && isSignedIn) {
      router.replace("/(auth)/(tabs)/feed/");
    } else if (!isSignedIn && inAuthGroup) {
      router.replace("/(public)");
    }
  }, [isSignedIn]);

  return <Slot />;
};

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={clerkPublishedKey!} tokenCache={tokenCache}>
      <ClerkLoaded>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <InitialLayout />
        </ConvexProviderWithClerk>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
