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

const chartData: ChartData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  datasets: [
    {
      data: [2, 17, 8, 31, 24, 12, 16],
    },
  ],
};

type ItemDetailsProps = NativeStackScreenProps<RootStackParamList, "ItemDetails">;

export default function ItemDetails({ route }: ItemDetailsProps) {
  const routeItem = route.params.item;
  const db = getDatabase();
  const { data: savedOutfits, isLoading, error, refetch } = useGet(getOutfitsAsync(db));
  const { data, isLoading: loadingItem, error: itemError, refetch: refetchItem } = useGet(getWardrobeItemsById(db, routeItem.uuid));
  const item = data ? data[0] : routeItem;

  if (error || itemError)
    return (
      <View>
        <Text>Error</Text>
      </View>
    );

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

  return (
    <ScrollContainer isLoading={isLoading} refetch={refetchItem}>
      <View style={styles.image}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={{ resizeMode: "cover", width: "100%", height: "100%" }} />
        ) : (
          <Image source={require("../styles/img/noImg.jpg")} style={{ resizeMode: "cover", width: "100%", height: "100%" }} />
        )}
      </View>
      <View style={styles.content}>
        <View style={styles.description}>
          <View style={styles.descriptionInner}>
            <Text style={{ fontSize: 24 }}>{item.name}</Text>
            <TouchableOpacity onPress={handleFavoritePress} style={[]}>
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
          <Detail label="Cost" value={item.cost} suffix="€" />
          <Detail
            label="Cost per wear"
            value={item.cost && item.wears > 0 ? calculateCostPerWear(item.cost, item.wears) : item.cost}
            suffix="€"
          />
          <Detail label="Category">
            {item.category?.map((category) => (
              <DetailTag key={category} label={category} />
            ))}
          </Detail>
          <Detail label="Brand" value={item.brand} />
          <Detail label="Model" value={item.model} />
          <Detail label="Size" value={item.size} />
          <Detail label="Fabric">
            {item.fabric?.map((fabric) => (
              <DetailTag key={fabric} label={fabric} />
            ))}
          </Detail>
          <Detail
            label="Bought"
            value={
              item.bought &&
              new Date(item.bought).toLocaleDateString("de", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            }
          />
          <Detail label="Bought from" value={item.boughtFrom} />
          <Detail label="Notes" value={item.notes} />
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
        <View style={{ marginVertical: 64, alignItems: "center" }}>
          <Text style={{ color: "red" }}>Delete item</Text>
        </View>
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
