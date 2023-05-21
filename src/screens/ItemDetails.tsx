import { Text, View, StyleSheet, Image, SafeAreaView, ScrollView, RefreshControl, TouchableOpacity } from "react-native";
import Detail from "@Components/Detail/Detail";
import { ChartData } from "react-native-chart-kit/dist/HelperTypes";
import DigiLineChart from "@Components/Charts/LineChart";
import { calculateCostPerWear, formatTimeAgo } from "@DigiUtils/helperFunctions";
import PlannedOutfit from "@Components/Box/PlannedOutfit";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "App";
import { getDatabase } from "@Database/database";
import { getOutfitsAsync } from "@Database/outfits";
import { useGet } from "@Hooks/useGet";
import { ScrollContainer } from "@DigiUtils/ScrollContainer";
import { Ionicons } from "@expo/vector-icons";
import { getWardrobeItemsById, setItemAsFavorite, updateWearDetails } from "@Database/item";
import DateTimePickerInput from "@Components/Inputs/DateTimePickerInput";
import DetailTag from "@Components/Chip/DetailTag";
import { useEffect, useLayoutEffect, useState } from "react";
import DetailInput from "@Components/Inputs/DetailInput";
import EditableDetail from "@Components/Detail/EditableDetail";
import Input from "@Components/Inputs/Input";
import ImageContainer from "@Components/Box/ImageContainer";

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
  const { data: savedOutfits, isLoading, error, refetch } = useGet(getOutfitsAsync(db));
  const { data, isLoading: loadingItem, error: itemError, refetch: refetchItem } = useGet(getWardrobeItemsById(db, routeItem.uuid));
  const item = data ? data[0] : routeItem;

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
          <TouchableOpacity onPress={() => handleEdit(false)}>
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

  const renderSavedOutfits = () => {
    const filteredOutfits = savedOutfits
      ?.filter((outfit) => outfit.itemImageURLs?.some((i) => item.uuid === i.uuid))
      .map((o) => <PlannedOutfit key={o.uuid} label={o.name} outfitImage={o.imageURL} itemImages={o.itemImageURLs} outfit={o} />);

    if (filteredOutfits && filteredOutfits.length) {
      return (
        <>
          <Text style={{ fontSize: 24, marginLeft: 16 }}>Saved Outfits ({filteredOutfits.length})</Text>
          <View style={{ alignItems: "center", gap: 8 }}>{filteredOutfits}</View>
        </>
      );
    }
    return (
      <View>
        <Text style={{ fontSize: 24, marginLeft: 16 }}>Saved Outfits (0)</Text>
        <View style={{ alignItems: "center", marginTop: 16 }}>
          <Text>No Outfits.</Text>
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
      {editMode && <ImageContainer defaultImage={item.getImage()} setImageCallback={item.setImage} />}
      {!editMode && (
        <View style={styles.image}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={{ resizeMode: "cover", width: "100%", height: "100%" }} />
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
      </View>
    </ScrollContainer>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 480,
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
  },
});
