import Card from "@Components/Card/Card";
import OutfitDetailCard from "@Components/Card/OutfitDetailCard";
import Detail from "@Components/Detail/Detail";
import BottomSheetCard from "@Components/Modal/BottomSheetCard";
import WorkInProgress from "@Components/WIP";
import { getDatabase } from "@Database/database";
import { ScrollContainer } from "@DigiUtils/ScrollContainer";
import { formatTimeAgo } from "@DigiUtils/helperFunctions";
import { useGet } from "@Hooks/useGet";
import { layout } from "@Styles/global";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "App";
import { View, StyleSheet, Image, Text, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePickerInput from "@Components/Inputs/DateTimePickerInput";

type OutfitDetailsProps = NativeStackScreenProps<RootStackParamList, "OutfitDetails">;

export default function OutfitDetails({ route }: OutfitDetailsProps) {
  const outfit = route.params.outfit;
  const db = getDatabase();

  const handleFavoritePress = () => {
    // outfit.toggleBookmark();
    // setItemAsFavorite(db, item);
    // refetch();
  };

  return (
    <ScrollContainer isLoading={false}>
      <View style={styles.image}>
        {outfit.imageURL ? (
          <Image source={{ uri: outfit.imageURL }} style={{ resizeMode: "cover", width: "100%", height: "100%" }} />
        ) : (
          <Image source={require("../styles/img/noImg.jpg")} style={{ resizeMode: "cover", width: "100%", height: "100%" }} />
        )}
      </View>
      <View style={styles.content}>
        <View style={styles.description}>
          <View style={styles.descriptionInner}>
            <Text style={{ fontSize: 24 }}>{outfit.name}</Text>
            <TouchableOpacity onPress={handleFavoritePress} style={[]}>
              <Ionicons name={"bookmark-outline"} size={28} color={"black"} />
            </TouchableOpacity>
          </View>
          <View style={styles.descriptionInner}>
            <Text>{0} times worn.</Text>
            {/* <Text>Last worn: {formatTimeAgo(item.lastWorn)}</Text> */}
            <Text>Last worn: -</Text>
          </View>
        </View>
        <View style={styles.buttonsContainer}>
          <DateTimePickerInput text="Plan" />
          <DateTimePickerInput text="Add Wear" />
        </View>
        <View style={styles.details}>
          <Detail label="Total Cost" value={1337} suffix="€" />
          <Detail label="Items" value={7} />
          <Detail label="Colors" value={"Beige, Grün"} />
          <Detail label="Tags" value={"Sommer, luftig"} />
        </View>
        <View style={styles.details}>
          {outfit.itemImageURLs?.map((item) => (
            <OutfitDetailCard key={item.uuid} item={item} />
          ))}
        </View>
      </View>
      <Text>Delete Button Here</Text>
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
