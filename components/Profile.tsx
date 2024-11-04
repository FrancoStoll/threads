import React from "react";
import { Id } from "@/convex/_generated/dataModel";
import { useUserProfile } from "@/hooks/useUserProfile";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "@clerk/clerk-expo";
import { Href, Link, useRouter } from "expo-router";
import UserProfile from "./UserProfile";
import Tabs from "./Tabs";
import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Thread from "./Thread";
import { Doc } from "../convex/_generated/dataModel";

type ProfileProps = {
  userId?: Id<"users">;
  showBackButton?: boolean;
};

const Profile = ({ userId, showBackButton }: ProfileProps) => {
  const { userProfile } = useUserProfile();
  const { top } = useSafeAreaInsets();
  const { signOut } = useAuth();
  const router = useRouter();

  const { results, status, loadMore } = usePaginatedQuery(
    api.messages.getThreads,
    { userId: userId || userProfile?._id },
    {
      initialNumItems: 10,
    }
  );

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <FlatList
        data={results}
        renderItem={({ item, index }) => (
          <Link href={`/(auth)/(tabs)/feed/${item._id}` as Href} asChild>
          <TouchableOpacity>
            <Thread
              style={{ marginBottom: index === results.length - 1 ? 40 : 0 }}
              thread={item as Doc<"messages"> & { creator: Doc<"users"> }}
            />
          </TouchableOpacity>
        </Link>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>You haven't posted anything yet!</Text>
        }
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: StyleSheet.hairlineWidth,
              backgroundColor: Colors.border,
            }}
          />
        )}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              {showBackButton ? (
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => router.back()}
                >
                  <Ionicons name="arrow-back" size={24} color="black" />
                  <Text>Back</Text>
                </TouchableOpacity>
              ) : (
                <MaterialCommunityIcons name="web" size={24} />
              )}
              <View style={styles.headerIcons}>
                <Ionicons name="logo-instagram" size={24} color="black" />
                <TouchableOpacity onPress={() => signOut()}>
                  <Ionicons name="log-out" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </View>
            {userId && <UserProfile userId={userId} />}
            {!userId && userProfile && <UserProfile userId={userProfile._id} />}
            <Tabs onTabChange={() => {}} />
          </>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    alignItems: "center",
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerIcons: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  emptyText: {
    fontSize: 17,
    color: "#8e8e8e",
    textAlign: "center",
    marginVertical: 16,
  },
});

export default Profile;
