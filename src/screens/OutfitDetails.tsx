import OutfitDetailCard from "@Components/Card/OutfitDetailCard";
import Detail from "@Components/Detail/Detail";
import BottomSheetCard from "@Components/Modal/BottomSheetCard";
import { getDatabase } from "@Database/database";
import { ScrollContainer } from "@DigiUtils/ScrollContainer";
import { formatTimeAgo } from "@DigiUtils/helperFunctions";
import { useGet } from "@Hooks/useGet";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "App";
import { View, StyleSheet, Image, Text, TouchableOpacity, Dimensions, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePickerInput from "@Components/Inputs/DateTimePickerInput";
import { Outfit } from "@Classes/Outfit";
import { useContext, useLayoutEffect, useReducer, useState } from "react";
import Input from "@Components/Inputs/Input";
import EditableDetail from "@Components/Detail/EditableDetail";
import OutfitItemPicker from "@Components/OutfitItemPicker/OutfitItemPicker";
import BottomSheetContext from "@Context/BottomSheetContext";
import { getWardrobeItems } from "@Database/item";
import { BaseCategories, BaseCategory } from "@Database/constants";
import { Item } from "@Classes/Item";
import { utils } from "@Styles/global";
import {
  addToPlannedOutfits,
  deleteOutfit,
  removePlannedDate,
  setOutfitAsBookmarked,
  updateOutfit,
  updateOutfitWearDetails,
} from "@Database/outfits";
import ListItem from "@Components/List/ListItem";
import ImageContainer from "@Components/Box/ImageContainer";
import SnackbarContext from "@Context/SnackbarContext";
import DigiButton from "@Components/Button/DigiButton";
import { deleteAlert } from "@DigiUtils/alertHelper";

type OutfitDetailsProps = NativeStackScreenProps<RootStackParamList, "OutfitDetails">;

export default function OutfitDetails({ route, navigation }: OutfitDetailsProps) {
  const outfit = route.params.outfit;
  const refresh = useReducer((x) => x + 1, 0)[1];
  const db = getDatabase();
  const bottomSheet = useContext(BottomSheetContext);
  const snack = useContext(SnackbarContext);
  const { data: wardrobe, refetch: refetchWardrobe } = useGet(getWardrobeItems(db));

  const [editMode, setEditMode] = useState<boolean>(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: ({ tintColor }: any) => (
        <TouchableOpacity onPress={() => handleEdit(true)}>
          <Ionicons name="ios-create-outline" size={24} color={tintColor} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleEdit = (edit: boolean) => {
    if (edit) {
      setEditMode(true);
      navigation.setOptions({
        headerRight: ({ tintColor }: any) => (
          <TouchableOpacity onPress={() => handleSaveUpdatedOutfit(outfit)}>
            <Ionicons name="ios-checkmark-circle-outline" size={32} color={tintColor} />
          </TouchableOpacity>
        ),
      });
    } else {
      setEditMode(false);
      navigation.setOptions({
        headerRight: ({ tintColor }: any) => (
          <TouchableOpacity onPress={() => handleEdit(true)}>
            <Ionicons name="ios-create-outline" size={24} color={tintColor} />
          </TouchableOpacity>
        ),
      });
    }
  };

  const handleSaveUpdatedOutfit = async (currOutfit: Outfit) => {
    handleEdit(false);
    updateOutfit(db, currOutfit)
      .then(() => snack && snack.setMessage(`Saved changes for ${currOutfit.name}.`))
      .catch((e) => snack && snack.setMessage(`There was an error: ${e}`))
      .finally(() => snack && snack.setIsOpen(true));
  };

  const handleDeleteOutfit = async () => {
    if (!snack) return;
    deleteOutfit(db, outfit.uuid)
      .then(() => {
        snack.setMessage(`${outfit.name} was deleted.`);
        snack.setIsOpen(true);
      })
      .catch((e) => console.log(e))
      .finally(() => navigation.goBack());
  };

  const handleFavoritePress = () => {
    outfit.toggleBookmark();
    setOutfitAsBookmarked(db, outfit);
    refresh();
  };

  const handleOpenBottomSheet = (baseCategory: BaseCategory) => {
    const filteredData = wardrobe?.filter(
      (item) =>
        !outfit
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
    outfit.addItem(baseCategory, item);
    bottomSheet?.resetBottomSheet();
  };

  const handleUpdateWears = async (date?: Date) => {
    if (!date) return;
    outfit.updateWearDetails(date);
    await updateOutfitWearDetails(db, outfit, date);
    refresh();
  };

  const handlePlanOutfit = async (date?: Date) => {
    if (!date) return;
    outfit.setPlannedDate(date);
    await addToPlannedOutfits(db, outfit.uuid, date);
    refresh();
  };

  const handleRemovePlanned = async (date: Date) => {
    outfit.removePlannedDate(date);
    await removePlannedDate(db, outfit.uuid, date);
    refresh();
  };

  return (
    <ScrollContainer isLoading={false}>
      {editMode ? (
        <OutfitItemPicker outfit={outfit} onPress={handleOpenBottomSheet} />
      ) : (
        <View style={styles.image}>
          {outfit.imageURL ? (
            <Image source={{ uri: outfit.imageURL }} style={{ resizeMode: "cover", width: "100%", height: "100%" }} />
          ) : (
            <Image source={require("../styles/img/noImg.jpg")} style={{ resizeMode: "cover", width: "100%", height: "100%" }} />
          )}
        </View>
      )}
      <View style={styles.content}>
        <View style={styles.description}>
          <View style={styles.descriptionInner}>
            {editMode ? (
              <Input
                defaultValue={outfit.name}
                onChange={(value) => {
                  if (value) outfit.name = value;
                }}
              />
            ) : (
              <Text style={{ fontSize: 24 }}>{outfit.name}</Text>
            )}
            <TouchableOpacity onPress={handleFavoritePress} style={{ paddingLeft: 16 }}>
              <Ionicons
                name={outfit.isBookmarked() ? "bookmark" : "bookmark-outline"}
                size={28}
                color={outfit.isBookmarked() ? "#eeca00" : "black"}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.descriptionInner}>
            <Text>{outfit.wears} times worn.</Text>
            <Text>Last worn: {formatTimeAgo(outfit.lastWorn)}</Text>
          </View>
        </View>
        <View style={styles.buttonsContainer}>
          <DateTimePickerInput text="Plan" onChange={handlePlanOutfit} />
          <DateTimePickerInput text="Add Wear" onChange={handleUpdateWears} />
        </View>
        <View style={utils(16).divider} />
        <View style={styles.details}>
          <Text style={{ fontSize: 18, marginLeft: 8, marginBottom: 8 }}>Details</Text>
          {Object.values(outfit.getOutfitStatistic()).map((stat) => (
            <Detail key={stat.label} {...stat} />
          ))}
          <EditableDetail
            label="Tags"
            edit={editMode}
            detail={{ value: outfit.tags }}
            detailInput={{
              defaultValue: outfit.tags,
              type: "multi-select",
              inputProps: { onChange: (value) => value && outfit.addTags(value) },
            }}
          />
        </View>
        <View style={utils(16).divider} />
        {editMode ? (
          <View style={{ marginVertical: 12, borderRadius: 80, overflow: "hidden", marginHorizontal: 16 }}>
            <ImageContainer
              defaultImage={outfit.imageURL}
              setImageCallback={(uri) => {
                outfit.imageURL = uri;
              }}
            />
          </View>
        ) : (
          <View style={{ marginVertical: 16 }}>
            <Text style={{ fontSize: 18, marginLeft: 16, marginBottom: 8 }}>Planned</Text>
            {outfit.hasPlannedDates() ? (
              outfit
                .getPlannedDatesPrettyfied()
                ?.map((d) => (
                  <ListItem
                    key={d.localeString}
                    text={d.localeString}
                    subText={formatTimeAgo(d.origin)}
                    buttonText="Remove"
                    onPress={() => handleRemovePlanned(d.origin)}
                  />
                ))
            ) : (
              <View style={{ justifyContent: "center", alignItems: "center", marginBottom: 16 }}>
                <Text>Nothing Planned.</Text>
              </View>
            )}
          </View>
        )}
        <View style={utils(16).divider} />
        <View style={styles.details}>
          {outfit.getAllItems().map((item) => (
            <OutfitDetailCard key={item.uuid} item={item} />
          ))}
        </View>
        <View style={{ flex: 1, height: 80, width: "100%" }}>
          <DigiButton title="Delete Outfit" variant="text" onPress={() => deleteAlert("Outfit", outfit.name, handleDeleteOutfit)} />
        </View>
      </View>
    </ScrollContainer>
  );
}

const styles = StyleSheet.create({
  image: {
    height: Dimensions.get("screen").height * 0.66, // Take 2/3 of the available screen.
    overflow: "hidden",
  },
  content: {
    backgroundColor: "white",
    marginTop: -32,
    marginBottom: 32,
    height: "100%",
    paddingTop: 8,
    gap: 8,
    elevation: 3,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  description: {
    paddingHorizontal: 24,
    marginVertical: 16,
  },
  descriptionInner: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 8,
  },
  details: {
    flexDirection: "column",
    padding: 8,
    rowGap: 8,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 16,
  },
});
