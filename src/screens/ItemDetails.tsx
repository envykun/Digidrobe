import { Text, View, StyleSheet, Image, SafeAreaView, ScrollView, Dimensions } from "react-native";
import { layout } from "@Styles/global";
import { Item } from "@Models/Item";
import Detail from "@Components/Detail/Detail";
import { LineChart } from "react-native-chart-kit";
import { ChartData } from "react-native-chart-kit/dist/HelperTypes";
import DigiLineChart from "@Components/Charts/LineChart";
import { calculateCostPerWear } from "@DigiUtils/helperFunctions";
import PlannedOutfit from "@Components/Box/PlannedOutfit";

const chartData: ChartData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  datasets: [
    {
      data: [2, 17, 8, 31, 24, 12, 16],
    },
  ],
};
export default function ItemDetails({}) {
  return (
    <SafeAreaView>
      <ScrollView style={layout.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.image}>
          <Image source={{ uri: "https://picsum.photos/480" }} style={{ resizeMode: "cover", width: "100%", height: "100%" }} />
        </View>
        <View style={styles.content}>
          <View style={styles.description}>
            <Text style={{ fontSize: 24 }}>Adidas Joggers</Text>
            <View style={styles.descriptionInner}>
              <Text>X times worn</Text>
              <Text>Last worn X months ago</Text>
            </View>
          </View>
          <View style={styles.details}>
            <Detail label="Cost" value="67€" />
            <Detail label="Cost per wear" value={calculateCostPerWear(67, 3).toString() + "€"} />
            <Detail label="Category" value="Jacket; Outer" />
            <Detail label="Brand" value="Nike" />
            <Detail label="Size" value="37" />
            <Detail label="Fabric" value="Cotton; Nylon" />
            <Detail label="Bought" value={new Date().toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })} />
            <Detail label="Bought from" value="Amazon" />
            <Detail label="Notes" value="Lorem ipsum dolor sit amet" />
          </View>
          <View style={{ width: "100%", justifyContent: "center", alignItems: "center" }}>
            <DigiLineChart chartData={chartData} />
          </View>
          <Text style={{ fontSize: 24, marginLeft: 16 }}>Saved Outfits (12)</Text>
          <View style={{ alignItems: "center", gap: 8 }}>
            {[...new Array(6)].map((x, y) => (
              <PlannedOutfit key={y} />
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
    marginBottom: 32,
    height: "100%",
    gap: 8,
    elevation: 3,
  },
  description: {
    paddingHorizontal: 16,
    marginVertical: 8,
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
