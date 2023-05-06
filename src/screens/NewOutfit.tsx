import { Image, ScrollView, Text, View, StyleSheet, TouchableOpacity, FlatList, Platform } from "react-native";
import { SimpleLineIcons, Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import BottomSheet from "@Components/Modal/BottomSheet";
import { getCategories, getDatabase } from "src/database/database";
import { Category } from "@Models/Category";
import { Item } from "src/classes/Item";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Outfit } from "src/classes/Outfit";
import { randomUUID } from "expo-crypto";
import BottomSheetCard from "@Components/Modal/BottomSheetCard";
import Detail from "@Components/Detail/Detail";
import DateTimePickerInput from "@Components/Inputs/DateTimePickerInput";
import { createOutfit } from "@Database/outfits";
import DetailInput from "@Components/Inputs/DetailInput";
import * as ImagePicker from "expo-image-picker";
import ShortcutItem from "@Components/Shortcut/ShortcutItem";
import OutfitItemPicker from "@Components/OutfitItemPicker/OutfitItemPicker";
import { useGet } from "@Hooks/useGet";
import { getWardrobeItems } from "@Database/item";
import { ScrollContainer } from "@DigiUtils/ScrollContainer";

export type OutfitMap = Map<OutfitCategoryType, Array<Item>>;
export type OutfitCategoryType = "Head" | "UpperBody" | "LowerBody" | "Feet" | "Accessoirs" | "NoCategory";

export default function NewOutfit() {
  const navigation = useNavigation();
  const refresh = () => {
    setCounter((c) => c + 1);
  };

  const newOutfit = useRef<Outfit>(new Outfit({ uuid: randomUUID(), refresh: refresh })).current;
  const [dbCategories, setDbCategories] = useState<Array<Category>>([]);
  const [wardrobe2, setWardrobe] = useState<Array<Item>>([]);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState<boolean>(false);
  const [isBottomSheetOpen2, setIsBottomSheetOpen2] = useState<boolean>(false);
  const [currentCategory, setCurrentCategory] = useState<OutfitCategoryType>("NoCategory");
  const db = getDatabase();
  const { data: wardrobe, isLoading: loadingWardrobe, error: wardrobeError, refetch: refetchWardrobe } = useGet(getWardrobeItems(db));
  const { data: categories, isLoading: loadingCategories, error: categoriesError, refetch: refetchCategories } = useGet(getCategories(db));
  const isFocused = useIsFocused();
  const [counter, setCounter] = useState(0);
  const [image, setImage] = useState<string | null>(null);

  // const [selectedItems, setSelectedItems] = useState<OutfitMap>(new Map());
  // const selectedItems: OutfitMap = new Map();

  useEffect(() => {}, [isFocused]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: ({ tintColor }: any) => (
        <TouchableOpacity onPress={handleCreateOutfit}>
          <Ionicons name="ios-checkmark-circle-outline" size={32} color={tintColor} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleCloseBottomSheet = () => {
    setIsBottomSheetOpen(false);
    setCurrentCategory("NoCategory");
  };

  const handleCreateOutfit = () => {
    createOutfit(db, newOutfit);
    navigation.goBack();
  };

  const closeModal = () => {
    setIsBottomSheetOpen2(false);
  };

  const handleOpenBottomSheet = (category: OutfitCategoryType) => {
    setCurrentCategory(category);
    setIsBottomSheetOpen(true);
  };

  const handleAddItemToOutfit = (item: Item) => {
    newOutfit.addItem(currentCategory, item);
    setIsBottomSheetOpen(false);
    refresh();
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
      newOutfit.imageURL = uri;
      setImage(uri);
    }
  };

  const takeImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      quality: 1,
    });

    if (!result.canceled) {
      const { uri } = result.assets[0];
      newOutfit.imageURL = uri;
      setImage(uri);
    }
  };

  return (
    <ScrollContainer disableRefresh>
      <OutfitItemPicker outfit={newOutfit} onPress={handleOpenBottomSheet} />
      <View style={styles.content}>
        <DetailInput label="Name" inputProps={{ onChange: (value) => (newOutfit.name = value) }} />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text>Plan for:</Text>
          <DateTimePickerInput onChange={(value) => newOutfit.setPlannedDate(value)} />
        </View>
        <View>
          {newOutfit.getAllItems().map((item) => (
            <View key={item.uuid}>
              <Text>{item.name}</Text>
            </View>
          ))}
        </View>
        <View>
          {!newOutfit.hasCategories() ? (
            <Text>No Statistics.</Text>
          ) : (
            newOutfit.getOutfitStatistic().map((stat, index) => <Detail key={index} {...stat} />)
          )}
        </View>
      </View>
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
                  newOutfit.imageURL = undefined;
                  setImage(null);
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
              onPress={() => setIsBottomSheetOpen2(true)}
            />
          </View>
        )}
      </View>
      <BottomSheet isOpen={isBottomSheetOpen2} closeModal={closeModal} title="Choose your source...">
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
      <BottomSheet title="Select a category..." isOpen={isBottomSheetOpen} closeModal={handleCloseBottomSheet}>
        {currentCategory === "NoCategory" ? (
          <FlatList
            data={wardrobe}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={{
              gap: 8,
              marginBottom: 8,
              paddingHorizontal: 8,
            }}
            renderItem={({ item }) => (
              <BottomSheetCard twoColumn label={item.name} imageURL={item.getImage()} onPress={() => handleAddItemToOutfit(item)} />
            )}
            ListEmptyComponent={<Text>No Items in this category.</Text>}
          />
        ) : (
          <FlatList
            data={wardrobe?.filter((item) => item.category?.includes(currentCategory))}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={{
              gap: 8,
              marginBottom: 8,
              paddingHorizontal: 8,
            }}
            renderItem={({ item }) => (
              <BottomSheetCard twoColumn label={item.name} imageURL={item.getImage()} onPress={() => handleAddItemToOutfit(item)} />
            )}
            ListEmptyComponent={<Text>No Items in this category.</Text>}
          />
        )}
      </BottomSheet>
    </ScrollContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: "100%",
  },
  addButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  noImage: {
    height: 80,
  },
  image: {
    height: 480,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    position: "relative",
    paddingBottom: 128,
    backgroundColor: "#f1f1f1",
  },

  content: {
    rowGap: 8,
    marginTop: -32,
    paddingTop: 16,
    paddingHorizontal: 16,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    backgroundColor: "white",
  },
});
