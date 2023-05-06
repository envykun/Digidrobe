import { layout } from "@Styles/global";
import { ScrollView, Text, View, StyleSheet, Dimensions, TouchableOpacity, RefreshControl } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Calendar from "@Components/Calendar/Calendar";
import ShortcutBox from "@Components/Shortcut/ShortcutBox";
import { useEffect, useState } from "react";
import WeatherAndLocation from "@Components/WeatherAndLocation/WeatherAndLocation";
import { OutfitOverview } from "@Models/Outfit";
import { getPlannedOutfitByDate } from "@Database/outfits";
import { getDatabase } from "@Database/database";
import PlannedOutfit from "@Components/Box/PlannedOutfit";
import DigiButton from "@Components/Button/DigiButton";
import { ScrollContainer } from "@DigiUtils/ScrollContainer";
import { ColorsRGB } from "@Styles/colors";

export default function Home() {
  const [quote, setQuote] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);
  const [plannedOutfit, setPlannedOutfit] = useState<Array<OutfitOverview>>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const db = getDatabase();

  useEffect(() => {
    const fetchURL = (url: string) => {
      fetch(url)
        .then((res) => res.json())
        .then((data) => setQuote(data[0].q + " - " + data[0].a))
        .catch((err) => console.log("An error occured.", err));
    };

    fetchURL("https://zenquotes.io/api/today");
  }, []);

  useEffect(() => {
    getPlannedOutfitByDate(db, selectedDate, setPlannedOutfit);
  }, [selectedDate]);

  return (
    <ScrollContainer headerTransparent={false} headerBackgroundColor={ColorsRGB.primary}>
      <View style={[styles.topContainer, layout.noHeaderSpacing]}>
        <View style={{ marginVertical: 16 }}>
          <Text style={{ fontSize: 32, color: "white" }}>Hello, Jule-Sophie!</Text>
          <Text style={{ fontSize: 12, fontStyle: "italic", color: "#808080", marginTop: 4 }}>{quote}</Text>
        </View>
        <WeatherAndLocation />
      </View>
      <LinearGradient colors={["#E2C895", "transparent"]} style={{ alignItems: "center" }}>
        <ShortcutBox />
      </LinearGradient>
      <View style={{ alignItems: "center", paddingVertical: 16, gap: 16 }}>
        <Calendar onChange={setSelectedDate} />
        {plannedOutfit.length > 0 ? (
          plannedOutfit.map((outfit) => (
            <PlannedOutfit key={outfit.uuid} label={outfit.name} outfitImage={outfit.imageURL} itemImages={outfit.itemImageURLs} />
          ))
        ) : (
          <View style={styles.plannedOutfitBox}>
            <Text>You have no outfits planned.</Text>
            <DigiButton title="Plan now" variant="text" onPress={() => console.log("TODO: navigate to plan outfit")} />
          </View>
        )}
        <View style={styles.plannedOutfitBox}>
          <Text>Maybe some other Stuff?</Text>
        </View>
      </View>
    </ScrollContainer>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    padding: 16,
    height: 300,
    backgroundColor: "#E2C895",
    position: "relative",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 40,
    alignItems: "center",
    marginTop: 8,
  },
  plannedOutfitBox: {
    width: Dimensions.get("window").width - 32,
    elevation: 3,
    borderRadius: 8,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    height: 240,
  },
});
