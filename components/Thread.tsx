import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { Href, Link } from "expo-router";
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";

type ThreadProps = {
  thread: Doc<"messages"> & { creator: Doc<"users"> };
  style?: {};
};

const Thread = ({ thread, style }: ThreadProps) => {
  const {
    content,
    mediaFiles,
    likeCount,
    commentCount,
    retweetCount,
    creator,
  } = thread;

  const likeMessage = useMutation(api.messages.likeCountMutation);

  return (
    <View style={[styles.container, style]}>
      <Image source={{ uri: creator.imageUrl }} style={styles.avatar} />
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Link href={`/(auth)/(tabs)/feed/profile/${creator._id}` as Href} asChild>
              <Text style={styles.headerTextName}>
                {creator.first_name} {creator.last_name}
              </Text>
            </Link>

            <Text style={styles.timestamp}>
              {new Date(thread._creationTime).toLocaleDateString()}
            </Text>
          </View>
          <Ionicons name="ellipsis-horizontal" size={24} color="black" />
        </View>
        <Text style={styles.content}>{content}</Text>
        {mediaFiles && mediaFiles?.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.mediaContainer}
          >
            {mediaFiles.map((image, index) => (
              <Link
                href={
                  `/(modal)/image/${encodeURIComponent(image)}` as Href<string>
                }
                key={index}
                asChild
              >
                <TouchableOpacity>
                  <Image source={{ uri: image }} style={styles.mediaImage} />
                </TouchableOpacity>
              </Link>
            ))}
          </ScrollView>
        )}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons
              name="heart-outline"
              size={24}
              color="black"
              onPress={() => likeMessage({ threadId: thread._id })}
            />
            <Text style={styles.actionText}>{likeCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={24} color="black" />
            <Text style={styles.actionText}>{commentCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="repeat-outline" size={24} color="black" />
            <Text style={styles.actionText}>{retweetCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Feather name="send" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
export default Thread;
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerText: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerTextName: {
    fontWeight: "bold",
    marginRight: 5,
    gap: 4,
    alignItems: "center",
    fontSize: 16,
  },
  timestamp: {
    color: "#808080",
    fontSize: 12,
  },
  content: {
    fontSize: 16,
    marginBottom: 10,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginTop: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionText: {
    color: "black",
    fontSize: 12,
  },
  mediaImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  mediaContainer: {
    gap: 14,
    paddingRight: 10,
  },
});
