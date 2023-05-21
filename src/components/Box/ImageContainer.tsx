import ShortcutItem from "@Components/Shortcut/ShortcutItem";
import { TouchableOpacity, View, Image, StyleSheet, Platform } from "react-native";
import { SimpleLineIcons, Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import BottomSheet from "@Components/Modal/BottomSheet";

export interface ImageContainerProps {
  setImageCallback: (imageUri: string | undefined) => void;
  defaultImage?: string;
}

export default function ImageContainer({ setImageCallback, defaultImage }: ImageContainerProps) {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>(defaultImage ?? null);

  const closeModal = () => {
    setIsBottomSheetOpen(false);
  };

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      quality: 1,
    });

    if (!result.canceled) {
      const { uri } = result.assets[0];
      setImageCallback(uri);
      setImage(uri);
    }
  };

  const takeImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      quality: 1,
    });

    if (!result.canceled) {
      const { uri } = result.assets[0];
      setImageCallback(uri);
      setImage(uri);
    }
  };

  return (
    <View style={styles.image}>
      {image ? (
        <View style={{ width: "100%", height: "100%", position: "relative" }}>
          <Image source={{ uri: image }} style={{ resizeMode: "cover", width: "100%", height: "100%" }} />
          <View
            style={{
              position: "absolute",
              bottom: 42,
              right: 12,
              backgroundColor: "#ebebeb",
              borderRadius: 120,
              width: 48,
              height: 48,
              justifyContent: "center",
              alignItems: "center",
              elevation: 2,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setImageCallback(undefined);
                setImage(null);
              }}
            >
              <Ionicons name="ios-trash-bin" size={32} color="#ce0000" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.noImage}>
          <View style={{ height: 80 }}>
            <ShortcutItem
              label="Add Image"
              icon={<SimpleLineIcons name="plus" size={48} color="#E2C895" />}
              onPress={() => setIsBottomSheetOpen(true)}
            />
            {/* 
            <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
              <Ionicons name="information-circle" color={"grey"} size={24} />
              <Text>Ziehe dein geplantes Outfit an und mache ein Foto.</Text>
            </View>
            */}
          </View>
        </View>
      )}
      <BottomSheet isOpen={isBottomSheetOpen} closeModal={closeModal} title="Choose your source...">
        <View style={styles.sheetButton}>
          <ShortcutItem
            label="Files"
            icon={<Ionicons name="ios-folder-open" size={48} color="#E2C895" />}
            onPress={() => {
              closeModal();
              pickImage();
            }}
          />
        </View>
        <View style={styles.sheetButton}>
          <ShortcutItem
            label="Camera"
            icon={<Ionicons name="ios-camera" size={48} color="#E2C895" />}
            onPress={() => {
              closeModal();
              takeImage();
            }}
          />
        </View>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 480,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  noImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#e9e9e9",
    justifyContent: "center",
    alignItems: "center",
  },
  sheetButton: {
    height: 80,
  },
});
