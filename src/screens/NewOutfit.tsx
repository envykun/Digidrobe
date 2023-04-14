import WorkInProgress from "@Components/WIP";
import { layout } from "@Styles/global";
import { Image, ScrollView, Text, View, StyleSheet, TouchableOpacity, FlatList, Platform } from "react-native";
import { SimpleLineIcons, Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import OutfitCategory, { OutfitCategoryProp } from "@Components/Box/OutfitCategory";
import BottomSheet from "@Components/Modal/BottomSheet";
import { getCategories, getDatabase, getWardrobeItems } from "src/database/database";
import { Category } from "@Models/Category";
import { Item } from "src/classes/Item";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Outfit } from "src/classes/Outfit";
import { randomUUID } from "expo-crypto";
import BottomSheetCard from "@Components/Modal/BottomSheetCard";
import Detail from "@Components/Detail/Detail";
import DateTimePickerInput from "@Components/Inputs/DateTimePickerInput";
import DigiButton from "@Components/Button/DigiButton";
import { createOutfit } from "@Database/outfits";
import DetailInput from "@Components/Inputs/DetailInput";
import * as ImagePicker from "expo-image-picker";
import ShortcutItem from "@Components/Shortcut/ShortcutItem";
import BottomSheetItem from "@Components/Modal/BottomSheetItem";

export default function NewOutfit() {
  const navigation = useNavigation();
  const refresh = () => {
    console.log("REFRESHING");
    setCounter((c) => c + 1);
  };

  const newOutfit = useRef<Outfit>(new Outfit({ uuid: randomUUID(), refresh: refresh })).current;
  const [dbCategories, setDbCategories] = useState<Array<Category>>([]);
  const [wardrobe, setWardrobe] = useState<Array<Item>>([]);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState<boolean>(false);
  const [isBottomSheetOpen2, setIsBottomSheetOpen2] = useState<boolean>(false);
  const [currentCategory, setCurrentCategory] = useState<Category | undefined>();
  const db = getDatabase();
  const isFocused = useIsFocused();
  const [counter, setCounter] = useState(0);
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    getWardrobeItems(db, setWardrobe);
    getCategories(db, setDbCategories);
  }, [isFocused]);

  const handleOpenBottomSheet = (category?: Category) => {
    setCurrentCategory(category);
    setIsBottomSheetOpen(true);
  };

  const handleCloseBottomSheet = () => {
    setIsBottomSheetOpen(false);
    setCurrentCategory(undefined);
  };

  const handleAddCategory = (category: Category) => {
    setIsBottomSheetOpen(false);
    newOutfit.addCategory(category);
  };

  const handleAddItemToCategory = (item: Item) => {
    setIsBottomSheetOpen(false);
    currentCategory && newOutfit.addItemToCategory(currentCategory.id, item);
    setCurrentCategory(undefined);
  };

  const handleCreateOutfit = () => {
    createOutfit(db, newOutfit);
    navigation.goBack();
  };

  const closeModal = () => {
    setIsBottomSheetOpen2(false);
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
    <ScrollView style={layout.scrollContainer} showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
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
      {newOutfit.getCategories().map((category, index) => (
        <OutfitCategory key={index} {...category} addItem={() => handleOpenBottomSheet(category.category)} outfit={newOutfit} />
      ))}
      <View style={styles.addButtonContainer}>
        <TouchableOpacity onPress={() => handleOpenBottomSheet()}>
          <SimpleLineIcons name="plus" size={42} color="black" />
        </TouchableOpacity>
      </View>
      <BottomSheet title="Select a category..." isOpen={isBottomSheetOpen} closeModal={handleCloseBottomSheet}>
        {!currentCategory ? (
          <FlatList
            data={dbCategories.filter((c) => !newOutfit.getCategoryIds().includes(c.id))}
            renderItem={({ item }) => <BottomSheetItem label={item.label} onPress={() => handleAddCategory(item)} />}
            ListEmptyComponent={<Text>No Categories left.</Text>}
          />
        ) : (
          <FlatList
            data={wardrobe
              .filter((item) => item.category?.includes(currentCategory.label))
              .filter((i) => !newOutfit.getItemIdsByCategory(currentCategory.id).includes(i.uuid))}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={{ gap: 8, marginBottom: 8, paddingHorizontal: 8 }}
            renderItem={({ item }) => (
              <BottomSheetCard twoColumn label={item.name} imageURL={item.getImage()} onPress={() => handleAddItemToCategory(item)} />
            )}
            ListEmptyComponent={<Text>No Items in this category left.</Text>}
          />
        )}
      </BottomSheet>
      <DetailInput label="Name" inputProps={{ onChange: (value) => (newOutfit.name = value) }} />
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text>Planned for:</Text>
        <DateTimePickerInput onChange={(value) => newOutfit.setPlannedDate(value)} />
      </View>
      <View>
        {!newOutfit.hasCategories() ? (
          <Text>No Statistics.</Text>
        ) : (
          newOutfit.getOutfitStatistic().map((stat, index) => <Detail key={index} {...stat} />)
        )}
      </View>
      <DigiButton title="Create Outfit" onPress={() => handleCreateOutfit()} />
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    rowGap: 8,
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
    height: 320,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
});
