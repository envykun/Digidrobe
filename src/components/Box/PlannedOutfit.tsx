import { View, Text, StyleSheet, Dimensions } from "react-native";

export default function PlannedOutfit() {
  return (
    <View style={styles.plannedOutfitBox}>
      <Text>No Outfits planned.</Text>
    </View>
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
  },
});
