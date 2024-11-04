import Profile from "@/components/Profile";
import { Id } from "@/convex/_generated/dataModel";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
const Page = () => {
  const { id } = useLocalSearchParams<{ id: Id<"users"> }>();

  return <Profile userId={id} showBackButton />;
};
export default Page;
const styles = StyleSheet.create({});
