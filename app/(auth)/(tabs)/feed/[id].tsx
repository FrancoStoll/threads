import Thread from "@/components/Thread";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
const Page = () => {
  const { id } = useLocalSearchParams<{ id: Id<"messages"> }>();

  const thread = useQuery(api.messages.getThreadById, { messageId: id });

  return (
    <View>
      <ScrollView>
        {thread ? <Thread thread={thread as Doc<"messages"> & { creator: Doc<"users"> }} /> : <ActivityIndicator />}
      </ScrollView>
    </View>
  );
};
export default Page;
const styles = StyleSheet.create({});
