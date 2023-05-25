import { Text, View, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { SimpleLineIcons, Ionicons } from "@expo/vector-icons";
import { useContext, useEffect, useReducer, useRef, useState } from "react";
import { getDatabase } from "src/database/database";
import { Item } from "src/classes/Item";
import { useNavigation } from "@react-navigation/native";
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
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "App";
import BottomSheetContext from "@Context/BottomSheetContext";
import { BaseCategories, BaseCategory } from "@Database/constants";
import { utils } from "@Styles/global";
import ImageContainer from "@Components/Box/ImageContainer";

export default function NewOutfit() {
  const refresh = useReducer((x) => x + 1, 0)[1];
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const newOutfit = useRef<Outfit>(new Outfit({ uuid: randomUUID(), refresh: refresh })).current;
  const db = getDatabase();
  const { data: wardrobe, refetch: refetchWardrobe } = useGet(getWardrobeItems(db));
  const bottomSheet = useContext(BottomSheetContext);

  useEffect(() => {
    navigation.setOptions({
      headerRight: ({ tintColor }: any) => (
        <TouchableOpacity onPress={handleCreateOutfit}>
          <Ionicons name="ios-checkmark-circle-outline" size={32} color={tintColor} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleCreateOutfit = () => {
    createOutfit(db, newOutfit);
    navigation.goBack();
  };

  const handleOpenBottomSheet = (baseCategory: BaseCategory) => {
    const filteredData = wardrobe?.filter(
      (item) =>
        !newOutfit
          .getAllItems()
          .map((item) => item.uuid)
          .includes(item.uuid)
    );
    if (!bottomSheet) return;
    bottomSheet.setTitle(`Select from ${BaseCategories[baseCategory]}...`);

    bottomSheet.setContent(
      <FlatList
        data={filteredData?.filter((item) => item.baseCategory === baseCategory)}
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
            onPress={() => handleAddItemToOutfit(baseCategory, item)}
          />
        )}
        ListEmptyComponent={<Text>No Items in this category.</Text>}
      />
    );

    bottomSheet.setIsOpen(true);
  };

  const handleAddItemToOutfit = (baseCategory: BaseCategory, item: Item) => {
    newOutfit.addItem(baseCategory, item);
    bottomSheet?.resetBottomSheet();
  };

  return (
    <ScrollContainer disableRefresh>
      <OutfitItemPicker outfit={newOutfit} onPress={handleOpenBottomSheet} />
      <View style={styles.content}>
        <DetailInput label="Name" inputProps={{ onChange: (value) => (newOutfit.name = value) }} />
        <DetailInput label="Tags" inputProps={{ onChange: (value) => newOutfit.addTags(value) }} type="multi-select" />
        <DetailInput
          label="Plan for"
          type="date"
          inputProps={{
            onChange: (value) => value && newOutfit.setPlannedDate(new Date(value)),
          }}
        />
        <View style={utils().divider} />
        <View style={{ marginVertical: 12, borderRadius: 80, overflow: "hidden" }}>
          <ImageContainer
            setImageCallback={(uri) => {
              newOutfit.imageURL = uri;
            }}
          />
        </View>
        <View style={utils().divider} />
        <View>
          {!newOutfit.hasCategories() ? (
            <Text style={{ fontSize: 16, fontWeight: "100", paddingTop: 8, paddingLeft: 8 }}>No Statistics.</Text>
          ) : (
            Object.values(newOutfit.getOutfitStatistic()).map((stat) => <Detail key={stat.label} {...stat} />)
          )}
        </View>
      </View>
    </ScrollContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    rowGap: 8,
    marginTop: -32,
    paddingTop: 16,
    paddingHorizontal: 16,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    backgroundColor: "white",
    marginBottom: 32,
  },
});
