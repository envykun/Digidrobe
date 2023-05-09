import { ItemImagePreview, OutfitOverview } from "@Models/Outfit";
import { Colors } from "@Styles/colors";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "App";
import { View, Text, StyleSheet, Dimensions, ImageBackground, Image, TouchableOpacity, FlatList } from "react-native";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import DetailTag from "@Components/Chip/DetailTag";
import DateTimePickerInput from "@Components/Inputs/DateTimePickerInput";
import { calculateOutfitContainerSize } from "@DigiUtils/helperFunctions";

interface PlannedOutfitProps {
  label?: string;
  outfitImage?: string;
  itemImages?: Array<ItemImagePreview>;
  outfit: OutfitOverview;
  planOutfitCallback?: (value?: Date | undefined) => void;
}

export default function PlannedOutfit({ label, outfitImage, itemImages, outfit, planOutfitCallback }: PlannedOutfitProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const handleNavigation = () => {
    navigation.navigate("OutfitDetails", { outfit: outfit });
  };

  let imageTouchable = null;

  if (!outfitImage && !itemImages) {
    imageTouchable = (
      <TouchableOpacity onPress={handleNavigation} style={styles.plannedOutfitBox}>
        <ImageBackground
          source={require("src/styles/img/noImg.jpg")}
          resizeMode="cover"
          style={{ flex: 1, width: "100%", height: "100%" }}
        ></ImageBackground>
      </TouchableOpacity>
    );
  } else if (!itemImages) {
    imageTouchable = (
      <TouchableOpacity onPress={handleNavigation} style={styles.plannedOutfitBox}>
        <ImageBackground source={{ uri: outfitImage }} resizeMode="cover" style={styles.outfitImageContainer}></ImageBackground>
      </TouchableOpacity>
    );
  } else if (!outfitImage) {
    imageTouchable = (
      <TouchableOpacity onPress={handleNavigation} style={styles.plannedOutfitBox}>
        <View style={styles.itemContainer}>
          <View style={styles.textContainer}></View>
          {itemImages?.map((item, index) => (
            <View key={index} style={[styles.itemImageContainer, styles.itemImageWidth3]}>
              {item.imageURL ? (
                <Image source={{ uri: item.imageURL }} style={{ resizeMode: "cover", width: "100%", height: "100%" }} />
              ) : (
                <View style={styles.noImg}>
                  <Text>{item.name}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </TouchableOpacity>
    );
  } else {
    imageTouchable = (
      <TouchableOpacity onPress={handleNavigation} style={styles.plannedOutfitBox}>
        {outfitImage && (
          <ImageBackground source={{ uri: outfitImage }} resizeMode="cover" style={styles.outfitImageContainer}></ImageBackground>
        )}
        {itemImages && (
          <View style={styles.itemContainer}>
            {itemImages.slice(0, 5).map((item, index) => (
              <View key={index} style={[styles.itemImageContainer, styles.itemImageWidth2]}>
                {item.imageURL ? (
                  <Image source={{ uri: item.imageURL }} style={{ resizeMode: "cover", width: "100%", height: "100%" }} />
                ) : (
                  <View style={styles.noImg}>
                    <Text>{item.name}</Text>
                  </View>
                )}
              </View>
            ))}
            {itemImages.length > 5 && (
              <View style={[styles.itemImageContainer, styles.itemImageWidth2]}>
                <View style={styles.additionalImages}>
                  <Text style={{ fontSize: 24, color: "#b1b1b1" }}>+{itemImages.length - 5}</Text>
                </View>
              </View>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.box}>
      <View style={styles.descriptionInner}>
        <View>
          <Text style={{ fontSize: 20 }}>{label}</Text>
          <Text style={{ fontSize: 10, fontStyle: "italic", color: "gray" }}>
            <SimpleLineIcons name="clock" size={8} color="black" /> Last worn: -
          </Text>
        </View>
        <TouchableOpacity onPress={undefined} style={[]}>
          <Ionicons name={"bookmark-outline"} size={28} color={"black"} />
        </TouchableOpacity>
      </View>
      {imageTouchable}
      <View
        style={{
          flexDirection: "row",
          gap: 8,
          alignItems: "center",
          marginBottom: 8,
          paddingHorizontal: 16,
          paddingTop: 8,
        }}
      >
        <View style={{ flex: 1, flexDirection: "row", gap: 8, alignItems: "center" }}>
          <Ionicons name="ios-pricetags-outline" color="black" />
          <View style={{ flex: 1, flexDirection: "row", gap: 4, alignItems: "center", flexWrap: "wrap" }}>
            <DetailTag label="Sommer" />
            <DetailTag label="Sommer" />
            <DetailTag label="Sommer" />
          </View>
        </View>
        <DateTimePickerInput text="Plan" iconSize={14} onChange={planOutfitCallback} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: "#f8f8f8",
    borderRadius: 16,
    overflow: "hidden",
  },
  plannedOutfitBox: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    height: calculateOutfitContainerSize({ inset: 16, gap: 4 }).outfitImageHeight,
    flexDirection: "row",
    gap: 4,
    overflow: "hidden",
    position: "relative",
    paddingHorizontal: 8,
  },
  outfitImageContainer: {
    flex: 1,
    height: "100%",
    borderRadius: 32,
    overflow: "hidden",
  },
  itemContainer: {
    flex: 1,
    flexDirection: "row",
    height: "100%",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 4,
    overflow: "hidden",
  },
  itemImageContainer: {
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    overflow: "hidden",
  },
  itemImageWidth2: {
    width: calculateOutfitContainerSize({ inset: 16, gap: 4 }).itemImageWidth,
  },
  itemImageWidth3: {
    width: "32.5%",
  },
  textContainer: {
    width: "100%",
  },
  noImg: {
    backgroundColor: Colors.primary,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  additionalImages: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  descriptionInner: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: "center",
    marginVertical: 8,
  },
});
