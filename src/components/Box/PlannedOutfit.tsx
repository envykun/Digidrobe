import { ItemImagePreview } from "@Models/Outfit";
import { Colors } from "@Styles/colors";
import { useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet, Dimensions, ImageBackground, Image, TouchableOpacity, FlatList } from "react-native";

interface PlannedOutfitProps {
  label?: string;
  outfitImage?: string;
  itemImages?: Array<ItemImagePreview>;
}

export default function PlannedOutfit({ label, outfitImage, itemImages }: PlannedOutfitProps) {
  const navigation = useNavigation();
  if (!outfitImage && !itemImages) {
    return (
      <TouchableOpacity onPress={() => navigation.navigate("OutfitDetails" as never)} style={styles.plannedOutfitBox}>
        <ImageBackground source={require("src/styles/img/noImg.jpg")} resizeMode="cover" style={{ flex: 1, width: "100%", height: "100%" }}>
          <Text style={styles.textBox}>{label}</Text>
        </ImageBackground>
      </TouchableOpacity>
    );
  }

  if (!itemImages) {
    return (
      <TouchableOpacity onPress={() => navigation.navigate("OutfitDetails" as never)} style={styles.plannedOutfitBox}>
        <ImageBackground source={{ uri: outfitImage }} resizeMode="cover" style={styles.outfitImageContainer}>
          <Text style={styles.textBox}>{label}</Text>
        </ImageBackground>
      </TouchableOpacity>
    );
  }

  if (!outfitImage) {
    return (
      <TouchableOpacity onPress={() => navigation.navigate("OutfitDetails" as never)} style={styles.plannedOutfitBox}>
        <View style={styles.itemContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.textBox}>{label}</Text>
          </View>
          {itemImages.map((item, index) => (
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
  }

  return (
    <TouchableOpacity onPress={() => navigation.navigate("OutfitDetails" as never)} style={styles.plannedOutfitBox}>
      {outfitImage && (
        <ImageBackground source={{ uri: outfitImage }} resizeMode="cover" style={styles.outfitImageContainer}>
          <Text style={styles.textBox}>{label}</Text>
        </ImageBackground>
      )}
      {itemImages && (
        <View style={styles.itemContainer}>
          {itemImages.map((item, index) => (
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
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  plannedOutfitBox: {
    width: Dimensions.get("window").width - 16,
    elevation: 2,
    borderRadius: 8,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    height: 240,
    flexDirection: "row",
    gap: 4,
    overflow: "hidden",
    padding: 4,
    position: "relative",
  },
  outfitImageContainer: {
    flex: 1,
    backgroundColor: "aqua",
    height: "100%",
    borderRadius: 6,
    overflow: "hidden",
  },
  itemContainer: {
    flex: 1,
    flexDirection: "row",
    // backgroundColor: "#00cf6f",
    height: "100%",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 4,
    overflow: "hidden",
    // justifyContent: "center",
  },
  itemImageContainer: {
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  itemImageWidth2: {
    width: "48.8%",
  },
  itemImageWidth3: {
    width: "32.5%",
  },
  textContainer: {
    width: "100%",
  },
  textBox: {
    fontSize: 18,
    margin: 4,
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: "#ffffff88",
    alignSelf: "flex-start",
    borderRadius: 4,
  },
  noImg: {
    backgroundColor: Colors.primary,
    // flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
});
