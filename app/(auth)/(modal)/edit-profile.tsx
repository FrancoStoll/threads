import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { updateUser } from "../../../convex/users";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { ImagePickerAsset } from "expo-image-picker";
import * as ImagePicker from "expo-image-picker";
const Page = () => {
  const { biostring, linkstring, userId, imageUrl } = useLocalSearchParams<{
    biostring: string;
    linkstring: string;
    userId: string;
    imageUrl: string;
  }>();

  const [bio, setBio] = useState(biostring);
  const [link, setLink] = useState(linkstring);
  const [selectedImage, setSelectedImage] = useState<ImagePickerAsset | null>(
    null
  );

  const updateUser = useMutation(api.users.updateUser);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);

  const router = useRouter();

  const onDone = async () => {
    let storageId = null;
    if (selectedImage) {
      storageId = await updateProfilePicture();
    }
    const toUpdate: any = {
      _id: userId as Id<"users">,
      bio: bio,
      websiteUrl: link,
    };
    if (storageId) {
      toUpdate.imageUrl = storageId;
    }

    console.log(toUpdate);

    await updateUser(toUpdate);

    router.dismiss();
  };

  const updateProfilePicture = async () => {
    const uploadUrl = await generateUploadUrl();

    const response = await fetch(selectedImage!.uri);
    const blob = await response.blob();

    const result = await fetch(uploadUrl, {
      method: "POST",
      body: blob,
      headers: {
        "Content-Type": selectedImage!.mimeType!,
      },
    });
    const { storageId } = await result.json();

    return storageId;
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled) {
      return setSelectedImage(result.assets[0]);
    }
  };

  return (
    <View>
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity onPress={onDone}>
              <Text style={styles.label}>Done</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <TouchableOpacity onPress={pickImage}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage.uri }} style={styles.image} />
        ) : (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        )}
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.label}>Bio</Text>
        <TextInput
          value={bio}
          onChangeText={setBio}
          style={styles.bioInput}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          placeholder="Tell us about yourself"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Link</Text>
        <TextInput
          value={link}
          onChangeText={setLink}
          placeholder="https://www.example.com"
          autoCapitalize="none"
        />
      </View>
    </View>
  );
};
export default Page;
const styles = StyleSheet.create({
  section: {
    padding: 8,
    margin: 16,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 100,
    alignSelf: "center",
  },
  bioInput: {
    height: 100,
  },
});
