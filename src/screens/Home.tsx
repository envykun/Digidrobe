import { layout } from "@Styles/global";
import { ScrollView, Text, View, StyleSheet, Dimensions, TouchableOpacity, RefreshControl } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Calendar from "@Components/Calendar/Calendar";
import ShortcutBox from "@Components/Shortcut/ShortcutBox";
import { useContext, useEffect, useState } from "react";
import WeatherAndLocation from "@Components/WeatherAndLocation/WeatherAndLocation";
import { getPlannedOutfitsByDate } from "@Database/outfits";
import { getDatabase } from "@Database/database";
import DigiButton from "@Components/Button/DigiButton";
import { useGet } from "@Hooks/useGet";
import { ScrollContainer } from "@DigiUtils/ScrollContainer";
import { Colors, ColorsRGB } from "@Styles/colors";
import { useGetQuote } from "@Hooks/useGetQuote";
import Skeleton from "@Components/Skeleton/Skeleton";
import BottomSheetContext from "@Context/BottomSheetContext";
import { useAsyncStorage } from "@Hooks/useAsyncStorage";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { i18n } from "@Database/i18n/i18n";
import { startOfToday } from "date-fns";
import PlannedOutfitCard from "@Components/Card/PlannedOutfitCard";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeScreenParamList, RootStackParamList } from "@Routes/Navigator.interface";

export default function Home() {
  const navigation = useNavigation<HomeScreenParamList>();
  const today = startOfToday();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const db = getDatabase();
  const isFocused = useIsFocused();
  const { data: plannedOutfits, isLoading, error, refetch } = useGet(getPlannedOutfitsByDate(db, selectedDate));
  const { quote, isLoading: isLoadingQuote } = useGetQuote("https://zenquotes.io/api/today");
  const { data: settings, refetch: refetchSettings } = useAsyncStorage();
  const bottomSheet = useContext(BottomSheetContext);

  useEffect(() => {
    // TODO: Fix this refetch for selected date.
    refetch();
  }, [selectedDate]);

  useEffect(() => {
    if (isFocused) {
      refetchSettings();
    }
  }, [isFocused]);

  return (
    <ScrollContainer headerTransparent={false} headerBackgroundColor={ColorsRGB.primary} scrollViewColor={Colors.primary}>
      <View style={[styles.topContainer, layout.noHeaderSpacing]}>
        <View style={{ marginVertical: 16 }}>
          <Text style={{ fontSize: 32, color: "white" }}>
            {i18n.t("welcome")}, {settings?.name}!
          </Text>
          {!settings?.quoteDisabled &&
            (isLoadingQuote ? (
              <View style={{ gap: 2 }}>
                <Skeleton variant="text" height={16} />
                <Skeleton variant="text" height={16} width={"40%"} />
              </View>
            ) : (
              <Text
                style={{
                  fontSize: 12,
                  fontStyle: "italic",
                  color: "#808080",
                  marginTop: 4,
                }}
              >
                {quote}
              </Text>
            ))}
        </View>
        <WeatherAndLocation />
      </View>
      <LinearGradient colors={["#E2C895", "white"]} style={{ alignItems: "center", paddingVertical: 4 }}>
        <ShortcutBox />
      </LinearGradient>
      <View style={{ paddingVertical: 16, gap: 16, backgroundColor: "white" }}>
        <Calendar today={today} selectedDate={selectedDate} onChange={setSelectedDate} />
        <View style={styles.padding}>
          {isLoading && !plannedOutfits ? (
            <Skeleton variant="rounded" height={260} width={"100%"} />
          ) : plannedOutfits && plannedOutfits.length > 0 ? (
            plannedOutfits.map((outfit) => <PlannedOutfitCard key={outfit.uuid} outfit={outfit} />)
          ) : (
            <View style={styles.plannedOutfitBox}>
              <Text>You have no outfits planned.</Text>
              <DigiButton title="Plan now" variant="text" onPress={() => navigation.navigate("Root", { screen: "Outfitter" })} />
            </View>
          )}
        </View>
      </View>
    </ScrollContainer>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    padding: 16,
    height: 300,
    backgroundColor: Colors.primary,
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
    width: "100%",
    elevation: 3,
    borderRadius: 8,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    height: 240,
  },
  padding: {
    paddingHorizontal: 8,
    gap: 8,
  },
});
