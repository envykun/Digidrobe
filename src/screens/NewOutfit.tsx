import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SimpleLineIcons, Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import BottomSheet from "@Components/Modal/BottomSheet";
import { getCategories, getDatabase } from "src/database/database";
import { Item } from "src/classes/Item";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Outfit } from "src/classes/Outfit";
import { randomUUID } from "expo-crypto";
import BottomSheetCard from "@Components/Modal/BottomSheetCard";
import Detail from "@Components/Detail/Detail";
import { createOutfit } from "@Database/outfits";
import DetailInput from "@Components/Inputs/DetailInput";
import OutfitItemPicker from "@Components/OutfitItemPicker/OutfitItemPicker";
import { useGet } from "@Hooks/useGet";
import { getWardrobeItems } from "@Database/item";
import { ScrollContainer } from "@DigiUtils/ScrollContainer";

export type OutfitMap = Map<OutfitCategoryType, Array<Item>>;
export type OutfitCategoryType =
  | "Head"
  | "UpperBody"
  | "LowerBody"
  | "Feet"
  | "Accessoirs"
  | "NoCategory";

export default function NewOutfit() {
  const navigation = useNavigation();
  const refresh = () => {
    setCounter((c) => c + 1);
  };

  const newOutfit = useRef<Outfit>(
    new Outfit({ uuid: randomUUID(), refresh: refresh })
  ).current;
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState<boolean>(false);
  const [currentCategory, setCurrentCategory] =
    useState<OutfitCategoryType>("NoCategory");
  const db = getDatabase();
  const {
    data: wardrobe,
    isLoading: loadingWardrobe,
    error: wardrobeError,
    refetch: refetchWardrobe,
  } = useGet(getWardrobeItems(db));
  const {
    data: categories,
    isLoading: loadingCategories,
    error: categoriesError,
    refetch: refetchCategories,
  } = useGet(getCategories(db));
  const isFocused = useIsFocused();
  const [counter, setCounter] = useState(0);

  // const [selectedItems, setSelectedItems] = useState<OutfitMap>(new Map());
  // const selectedItems: OutfitMap = new Map();

  useEffect(() => {}, [isFocused]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: ({ tintColor }: any) => (
        <TouchableOpacity onPress={handleCreateOutfit}>
          <Ionicons
            name="ios-checkmark-circle-outline"
            size={32}
            color={tintColor}
          />
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

  const handleOpenBottomSheet = (category: OutfitCategoryType) => {
    setCurrentCategory(category);
    setIsBottomSheetOpen(true);
  };

  const handleAddItemToOutfit = (item: Item) => {
    newOutfit.addItem(currentCategory, item);
    setIsBottomSheetOpen(false);
    refresh();
  };

  return (
    <ScrollContainer disableRefresh>
      <OutfitItemPicker outfit={newOutfit} onPress={handleOpenBottomSheet} />
      <View style={styles.content}>
        <DetailInput
          label="Name"
          inputProps={{ onChange: (value) => (newOutfit.name = value) }}
        />
        <DetailInput
          label="Plan for"
          type="date"
          inputProps={{
            onChange: (value) =>
              value && newOutfit.setPlannedDate(new Date(value)),
          }}
        />
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
            newOutfit
              .getOutfitStatistic()
              .map((stat, index) => <Detail key={index} {...stat} />)
          )}
        </View>
      </View>
      <BottomSheet
        title="Select a category..."
        isOpen={isBottomSheetOpen}
        closeModal={handleCloseBottomSheet}
      >
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
              <BottomSheetCard
                twoColumn
                label={item.name}
                imageURL={item.getImage()}
                onPress={() => handleAddItemToOutfit(item)}
              />
            )}
            ListEmptyComponent={<Text>No Items in this category.</Text>}
          />
        ) : (
          <FlatList
            data={wardrobe?.filter((item) =>
              item.category?.includes(currentCategory)
            )}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={{
              gap: 8,
              marginBottom: 8,
              paddingHorizontal: 8,
            }}
            renderItem={({ item }) => (
              <BottomSheetCard
                twoColumn
                label={item.name}
                imageURL={item.getImage()}
                onPress={() => handleAddItemToOutfit(item)}
              />
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
