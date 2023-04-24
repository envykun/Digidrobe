import { Text, View, StyleSheet, Image, SafeAreaView, ScrollView, RefreshControl } from "react-native";
import { layout } from "@Styles/global";
import Detail from "@Components/Detail/Detail";
import { ChartData } from "react-native-chart-kit/dist/HelperTypes";
import DigiLineChart from "@Components/Charts/LineChart";
import { calculateCostPerWear, formatTimeAgo } from "@DigiUtils/helperFunctions";
import PlannedOutfit from "@Components/Box/PlannedOutfit";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "App";
import { getDatabase } from "@Database/database";
import { getOutfitsAsync } from "@Database/outfits";
import { OutfitOverview } from "@Models/Outfit";
import { useGet } from "@Hooks/useGet";

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
  const item = route.params.item;
  const db = getDatabase();
  const { data: savedOutfits, isLoading, error, refetch } = useGet<OutfitOverview[]>(getOutfitsAsync(db));

  if (isLoading)
    return (
      <View>
        <Text>Loading</Text>
      </View>
    );

  if (error)
    return (
      <View>
        <Text>Loading</Text>
      </View>
    );

  return (
    <SafeAreaView>
      <ScrollView
        style={layout.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
      >
        <View style={styles.image}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={{ resizeMode: "cover", width: "100%", height: "100%" }} />
          ) : (
            <Image source={require("../styles/img/noImg.jpg")} style={{ resizeMode: "cover", width: "100%", height: "100%" }} />
          )}
        </View>
        <View style={styles.content}>
          <View style={styles.description}>
            <Text style={{ fontSize: 24 }}>{item.name}</Text>
            <View style={styles.descriptionInner}>
              <Text>{item.wears} times worn.</Text>
              <Text>Last worn: {formatTimeAgo(item.lastWorn)}</Text>
            </View>
          </View>
          <View style={styles.details}>
            <Detail label="Cost" value={item.cost} suffix="€" />
            <Detail
              label="Cost per wear"
              value={item.cost && item.wears > 0 ? calculateCostPerWear(item.cost, item.wears) : item.cost}
              suffix="€"
            />
            <Detail label="Category" value={item.getArrayByType("category")} />
            <Detail label="Brand" value={item.brand} />
            <Detail label="Model" value={item.model} />
            <Detail label="Size" value={item.size} />
            <Detail label="Fabric" value={item.getArrayByType("fabric")} />
            <Detail
              label="Bought"
              value={item.bought && new Date(item.bought).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })}
            />
            <Detail label="Bought from" value={item.boughtFrom} />
            <Detail label="Notes" value={item.notes} />
          </View>
          <View style={{ width: "100%", justifyContent: "center", alignItems: "center" }}>
            <DigiLineChart chartData={chartData} />
          </View>
          <Text style={{ fontSize: 24, marginLeft: 16 }}>Saved Outfits (12)</Text>
          <View style={{ alignItems: "center", gap: 8 }}>
            {savedOutfits
              ?.filter((outfit) => outfit.itemImageURLs?.some((i) => item.uuid === i.uuid))
              .map((o) => (
                <PlannedOutfit key={o.uuid} label={o.name} outfitImage={o.imageURL} itemImages={o.itemImageURLs} />
              ))}
          </View>
          <View style={{ marginVertical: 64, alignItems: "center" }}>
            <Text style={{ color: "red" }}>Delete item</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 320,
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
