import { layout } from "@Styles/global";
import { ScrollView, Text, View, StyleSheet, Dimensions, TouchableOpacity, RefreshControl } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Calendar from "@Components/Calendar/Calendar";
import ShortcutBox from "@Components/Shortcut/ShortcutBox";
import { SimpleLineIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import WeatherAndLocation from "@Components/WeatherAndLocation/WeatherAndLocation";

export default function Home() {
  const navigation = useNavigation();
  const [quote, setQuote] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchURL = (url: string) => {
      fetch(url)
        .then((res) => res.json())
        .then((data) => setQuote(data[0].q + " - " + data[0].a))
        .catch((err) => console.log("An error occured.", err));
    };

    fetchURL("https://zenquotes.io/api/today");
  }, []);

  return (
    <ScrollView
      style={layout.scrollContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => console.log("TODO: Refresh weather info")} />}
    >
      <View style={[styles.topContainer, layout.noHeaderSpacing]}>
        <View style={styles.topBar}>
          <Text style={{ fontSize: 28, marginLeft: 68 }}>D I G I D R O B E</Text>
          <TouchableOpacity onPress={() => navigation.navigate("UserSettings" as never)}>
            <SimpleLineIcons name="user" size={24} color="black" />
          </TouchableOpacity>
        </View>
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
        <Calendar />
        <View style={styles.plannedOutfitBox}>
          <Text>No Outfits planned.</Text>
        </View>
        <View style={styles.plannedOutfitBox}>
          <Text>Maybe some other Stuff?</Text>
        </View>
      </View>
    </ScrollView>
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
