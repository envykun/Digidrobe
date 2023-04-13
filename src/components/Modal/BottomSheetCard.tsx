import { TouchableOpacity, View, StyleSheet, Image, Text } from "react-native";
import { BottomSheetItem } from "./BottomSheet.interface";

export default function BottomSheetCard({ label, onPress, imageURL, twoColumn = false }: BottomSheetItem) {
  return (
    <TouchableOpacity activeOpacity={0.6} style={twoColumn ? styles.twoColumnContainer : styles.bottomSheetCardContainer} onPress={onPress}>
      <View style={styles.image}>
        {imageURL ? (
          <Image source={{ uri: imageURL }} style={{ resizeMode: "cover", width: "100%", height: "100%" }} />
        ) : (
          <Image
            source={require("src/styles/img/noImg.jpg")}
            style={{ resizeMode: "cover", width: "100%", height: "100%", marginTop: -40 }}
          />
        )}
      </View>
      <Text style={styles.textBox}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bottomSheetCardContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    elevation: 3,
    backgroundColor: "white",
    overflow: "hidden",
    position: "relative",
    height: "100%",
    width: "100%",
  },
  twoColumnContainer: {
    flex: 1 / 2,
    justifyContent: "center",
    alignItems: "center",
    height: 180,
    borderRadius: 8,
    elevation: 3,
    backgroundColor: "white",
    overflow: "hidden",
    position: "relative",
  },
  image: {
    height: "100%",
    width: "100%",
  },
  textBox: {
    position: "absolute",
    bottom: 10,
    backgroundColor: "white",
    left: 5,
    right: 5,
    borderRadius: 4,
    padding: 4,
    opacity: 0.9,
  },
});
