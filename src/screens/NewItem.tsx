import { Text, View, StyleSheet, Image, SafeAreaView, ScrollView, Platform, TouchableOpacity } from "react-native";
import { layout } from "@Styles/global";
import { Item } from "src/classes/Item";
import DetailInput from "@Components/Inputs/DetailInput";
import Input from "@Components/Inputs/Input";
import ShortcutItem from "@Components/Shortcut/ShortcutItem";
import { SimpleLineIcons, Ionicons } from "@expo/vector-icons";
import BottomSheet from "@Components/Modal/BottomSheet";
import { useEffect, useState } from "react";

import * as ImagePicker from "expo-image-picker";

export default function NewItem() {
  const newItem = new Item({ name: "" });
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>(null);

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
      setImage(uri);
      newItem.image = uri;
    }
  };

  const takeImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      quality: 1,
    });

    if (!result.canceled) {
      const { uri } = result.assets[0];
      setImage(uri);
      newItem.image = uri;
    }
  };

  return (
    <SafeAreaView>
      <ScrollView style={layout.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.image}>
          {image ? (
            <View style={{ width: "100%", height: "100%", position: "relative" }}>
              <Image source={{ uri: image }} style={{ resizeMode: "cover", width: "100%", height: "100%" }} />
              <View
                style={{
                  position: "absolute",
                  bottom: 12,
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
                    setImage(null);
                    newItem.image = undefined;
                  }}
                >
                  <Ionicons name="ios-trash-bin" size={32} color="#ce0000" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.noImage}>
              <ShortcutItem
                label="Add Image"
                icon={<SimpleLineIcons name="plus" size={48} color="#E2C895" />}
                onPress={() => setIsBottomSheetOpen(true)}
              />
            </View>
          )}
        </View>
        <View style={styles.content}>
          <View style={styles.description}>
            <Text style={{ fontSize: 24 }}>Name</Text>
            <Input
              onChange={(text) => {
                newItem.name = text;
              }}
            />
          </View>
          <View style={styles.details}>
            {newItem.getConstructorKeys().map((prop) => (
              <View key={prop.key} style={{ flex: 1 }}>
                <DetailInput label={prop.label} inputProps={{ onChange: prop.setter }} />
              </View>
            ))}
          </View>
          <View style={{ marginVertical: 64, alignItems: "center" }}>
            <Text style={{ color: "#E2C895" }} onPress={() => console.log("Item Updated", newItem)}>
              Save Item
            </Text>
          </View>
        </View>
        <BottomSheet isOpen={isBottomSheetOpen} closeModal={closeModal} title="Choose your source...">
          <View style={styles.noImage}>
            <ShortcutItem
              label="Files"
              icon={<Ionicons name="ios-folder-open" size={48} color="#E2C895" />}
              onPress={() => {
                closeModal();
                pickImage();
              }}
            />
          </View>
          <View style={styles.noImage}>
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 320,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  noImage: {
    height: 80,
  },
  content: {
    marginBottom: 32,
    height: "100%",
    gap: 8,
    elevation: 3,
  },
  description: {
    marginTop: 16,
    paddingHorizontal: 16,
    marginVertical: 8,
    flexDirection: "row",
    columnGap: 16,
    alignItems: "center",
  },
  descriptionInner: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 8,
  },
  details: {
    flexDirection: "column",
    padding: 8,
  },
});
