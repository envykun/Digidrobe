import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { ChartData } from "react-native-chart-kit/dist/HelperTypes";
import DigiLineChart from "@Components/Charts/LineChart";
import { formatTimeAgo } from "@DigiUtils/helperFunctions";
import OutfitBox from "@Components/Box/OutfitBox";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "App";
import { getDatabase } from "@Database/database";
import { getOutfits } from "@Database/outfits";
import { useGet } from "@Hooks/useGet";
import { ScrollContainer } from "@DigiUtils/ScrollContainer";
import { Ionicons } from "@expo/vector-icons";
import { deleteItem, getWardrobeItemById, setItemAsFavorite, updateItem, updateWearDetails } from "@Database/item";
import DateTimePickerInput from "@Components/Inputs/DateTimePickerInput";
import { useContext, useLayoutEffect, useRef, useState } from "react";
import EditableDetail from "@Components/Detail/EditableDetail";
import Input from "@Components/Inputs/Input";
import ImageContainer from "@Components/Box/ImageContainer";
import { Item } from "@Classes/Item";
import DigiButton from "@Components/Button/DigiButton";
import { deleteAlert } from "@DigiUtils/alertHelper";
import SnackbarContext from "@Context/SnackbarContext";
import DetailImage from "@Components/Image/DetailImage";

const chartData: ChartData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  datasets: [
    {
      data: [2, 17, 8, 31, 24, 12, 16],
    },
  ],
};

type ItemDetailsProps = NativeStackScreenProps<RootStackParamList, "ItemDetails">;

export default function ItemDetails({ route, navigation }: ItemDetailsProps) {
  const routeItem = route.params.item;
  const db = getDatabase();
  const snack = useContext(SnackbarContext);
  const { data: savedOutfits, isLoading, error, refetch } = useGet(getOutfits(db));
  const { data, isLoading: loadingItem, error: itemError, refetch: refetchItem } = useGet(getWardrobeItemById(db, routeItem.uuid));
  const item = useRef<Item>(data ? data : routeItem).current;

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
          <TouchableOpacity onPress={() => handleSaveUpdatedItem(item)}>
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

  const handleSaveUpdatedItem = (currItem: Item) => {
    handleEdit(false);
    updateItem(db, currItem);
  };

  const handleFavoritePress = async () => {
    item.toggleFavorite();
    await setItemAsFavorite(db, item);
    refetch();
  };

  const handleUpdateWears = async (date?: Date) => {
    if (!date) return;
    item.updateWearDetails(date);
    await updateWearDetails(db, item, date);
    refetch();
  };

  const handleDeleteItem = async () => {
    if (!snack) return;
    deleteItem(db, item.uuid)
      .then(() => {
        snack.setMessage(`${item.name} was deleted.`);
        snack.setIsOpen(true);
      })
      .catch((e) => console.log(e))
      .finally(() => navigation.goBack());
  };

  const renderSavedOutfits = () => {
    const filteredOutfits = savedOutfits
      ?.filter((outfit) => outfit.getAllItems().some((i) => item.uuid === i.uuid))
      .map((o) => <OutfitBox key={o.uuid} label={o.name} outfitImage={o.imageURL} itemImages={o.getItemImagePreviews()} outfit={o} />);

    return (
      <View style={{ marginHorizontal: 8 }}>
        <Text style={{ fontSize: 24, marginLeft: 16 }}>Saved Outfits ({filteredOutfits?.length ?? 0})</Text>
        <View style={{ alignItems: "center", marginTop: 16 }}>
          {filteredOutfits && filteredOutfits.length ? (
            <View style={{ alignItems: "center", gap: 8 }}>{filteredOutfits}</View>
          ) : (
            <Text>No Outfits.</Text>
          )}
        </View>
      </View>
    );
  };

  if (error || itemError)
    return (
      <View>
        <Text>Error</Text>
      </View>
    );

  return (
    <ScrollContainer isLoading={isLoading} refetch={refetchItem}>
      {editMode ? (
        <ImageContainer defaultImage={item.getImage()} setImageCallback={(uri) => item.setImage(uri)} />
      ) : (
        <DetailImage image={item.getImage()} />
      )}
      <View style={styles.content}>
        <View style={styles.description}>
          <View style={styles.descriptionInner}>
            {editMode ? (
              <Input
                defaultValue={item.name}
                onChange={(value) => {
                  if (value) item.name = value;
                }}
              />
            ) : (
              <Text style={{ fontSize: 24 }}>{item.name}</Text>
            )}
            <TouchableOpacity onPress={handleFavoritePress} style={{ paddingLeft: 16 }}>
              <Ionicons name={item.isFavorite() ? "heart" : "heart-outline"} size={28} color={item.isFavorite() ? "red" : "black"} />
            </TouchableOpacity>
          </View>
          <View style={styles.descriptionInner}>
            <Text>{item.wears} times worn.</Text>
            <Text>Last worn: {formatTimeAgo(item.lastWorn)}</Text>
          </View>
        </View>
        <View style={styles.description}>
          <DateTimePickerInput text="I wore this" onChange={handleUpdateWears} />
        </View>
        <View style={styles.details}>
          {item.getConstructorKeys().map((i) => (
            <EditableDetail
              edit={i.editable ? editMode : false}
              key={i.key}
              label={i.label}
              detail={{
                ...i.detailProps,
                isColor: i.inputType === "multi-select-color",
                value: i.isDate
                  ? typeof i.value === "string"
                    ? new Date(i.value).toLocaleDateString("de", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : i.value
                  : i.value,
              }}
              detailInput={{
                inputProps: { onChange: i.setter, textInputProps: { keyboardType: i.keyboardType } },
                type: i.inputType,
                defaultValue: i.value,
              }}
            />
          ))}
        </View>
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <DigiLineChart chartData={chartData} />
        </View>
        {renderSavedOutfits()}
        <View style={{ flex: 1, height: 80, width: "100%" }}>
          <DigiButton title="Delete THIS" variant="text" onPress={() => deleteAlert("Item", item.name, handleDeleteItem)} />
        </View>
      </View>
    </ScrollContainer>
  );
}

const styles = StyleSheet.create({
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
  },
});
