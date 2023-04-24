import { Colors } from "@Styles/colors";
import { TouchableOpacity, View, Image, Text, StyleSheet } from "react-native";

export default function OutfitPointCard({ imageURL, onPress, label }: any) {
  return (
    <TouchableOpacity activeOpacity={0.6} style={styles.bottomSheetCardContainer} onPress={onPress}>
      <View style={styles.image}>
        {imageURL ? (
          <Image source={{ uri: imageURL }} style={{ resizeMode: "cover", width: "100%", height: "100%" }} />
        ) : (
          <View style={styles.textBox}>
            <Text numberOfLines={2} style={styles.text}>
              {label}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bottomSheetCardContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    elevation: 1,
    backgroundColor: "white",
    overflow: "hidden",
    position: "relative",
    height: 40,
    width: 40,
  },
  image: {
    height: "100%",
    width: "100%",
  },
  textBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
    overflow: "hidden",
    backgroundColor: Colors.primary,
  },
  text: {
    fontSize: 8,
  },
});
