import React from "react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useQuery } from "convex/react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "@/constants/Colors";
import { Href, Link } from "expo-router";

type UserProfileProps = {
  userId?: string;
};

const UserProfile = ({ userId }: UserProfileProps) => {
  const profile = useQuery(api.users.getUserById, {
    userId: userId as Id<"users">,
  });
  const { userProfile } = useUserProfile();

  const isSelf = userId === userProfile?._id;

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.profileTextContainer}>
          <Text style={styles.name}>
            {profile?.first_name} {profile?.last_name}
          </Text>
          <Text style={styles.username}>@{profile?.username}</Text>
        </View>

        <Image source={{ uri: profile?.imageUrl! }} style={styles.image} />
      </View>
      <Text style={styles.bio}>{profile?.bio || "No bio"}</Text>
      <Text style={styles.followers}>
        {profile?.followersCount} · {profile?.websiteUrl ?? "No website"}
      </Text>
      <View style={styles.buttonRow}>
        {isSelf && (
          <>
            <Link
              href={
                `/(modal)/edit-profile?userId=${profile?._id ? encodeURIComponent(profile?._id) : ""}&imageUrl=${profile?.imageUrl ? encodeURIComponent(profile?.imageUrl) : ""}&biostring=${profile?.bio ? encodeURIComponent(profile?.bio) : ""}&linkstring=${profile?.websiteUrl ? encodeURIComponent(profile?.websiteUrl) : ""}` as Href
              }
              asChild
            >
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Edit Profile</Text>
              </TouchableOpacity>
            </Link>

            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Share Profile</Text>
            </TouchableOpacity>
          </>
        )}
        {!isSelf && (
          <>
            <TouchableOpacity style={styles.fullButton}>
              <Text style={styles.fullButtonText}>Follow</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.fullButton}>
              <Text style={styles.fullButtonText}>Mention</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};
export default UserProfile;
const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profileTextContainer: {
    gap: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  username: {
    fontSize: 14,
    color: "#8e8e8e",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  bio: {
    fontSize: 14,
    marginVertical: 16,
  },
  followers: {
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 16,
    justifyContent: "space-evenly",
    marginTop: 16,
  },
  button: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: Colors.border,
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "bold",
  },
  fullButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  fullButtonText: {
    fontWeight: "bold",
    color: "#fff",
  },
});
