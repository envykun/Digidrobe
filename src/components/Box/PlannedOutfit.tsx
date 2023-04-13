import { useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet, Dimensions, ImageBackground, Image, TouchableOpacity } from "react-native";

interface PlannedOutfitProps {
  label?: string;
  outfitImage?: string;
  itemImages?: Array<string>;
}

export default function PlannedOutfit({ label, outfitImage, itemImages }: PlannedOutfitProps) {
  const navigation = useNavigation();
  if (!outfitImage && !itemImages) {
    return (
      <TouchableOpacity onPress={() => navigation.navigate("OutfitDetails" as never)} style={styles.plannedOutfitBox}>
        <ImageBackground source={require("src/styles/img/noImg.jpg")} resizeMode="cover" style={{ flex: 1, width: "100%", height: "100%" }}>
          <Text style={{ fontSize: 18, marginLeft: 8, marginTop: 4 }}>{label}</Text>
        </ImageBackground>
      </TouchableOpacity>
    );
  }

  if (!itemImages) {
    return (
      <TouchableOpacity onPress={() => navigation.navigate("OutfitDetails" as never)} style={styles.plannedOutfitBox}>
        <ImageBackground source={{ uri: outfitImage }} resizeMode="cover" style={{ flex: 1, width: "100%", height: "100%" }}>
          <Text style={{ fontSize: 18, marginLeft: 8, marginTop: 4 }}>{label}</Text>
        </ImageBackground>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={() => navigation.navigate("OutfitDetails" as never)} style={styles.plannedOutfitBox}>
      {outfitImage && (
        <View style={{ flex: 1, height: "100%" }}>
          <View style={styles.textContainer}>
            <Text style={{ fontSize: 18, marginLeft: 8, marginTop: 4 }}>{label}</Text>
          </View>
          <View style={styles.outfitImageContainer}>
            <Image source={{ uri: outfitImage }} style={{ resizeMode: "cover", width: "100%", height: "100%" }} />
          </View>
        </View>
      )}
      {itemImages && (
        <View style={styles.itemContainer}>
          {itemImages.map((itemImg, index) => (
            <View key={index} style={styles.itemImageContainer}>
              <Image
                source={{ uri: itemImg }}
                style={{ resizeMode: "cover", width: "100%", height: "100%" }}
                onError={(error) => console.log("Failed loading image", error)}
              />
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
  },
  itemContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#00cf6f",
    height: "100%",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 4,
  },
  itemImageContainer: {
    width: "48.8%",
    backgroundColor: "pink",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  textContainer: {
    width: "100%",
  },
});
