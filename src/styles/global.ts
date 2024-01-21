import { StyleSheet, StatusBar, DimensionValue } from "react-native";
import { Colors } from "./colors";

export const layout = StyleSheet.create({
  scrollContainer: {
    height: "100%",
  },
  noHeaderSpacing: {
    paddingTop: StatusBar.currentHeight,
    position: "relative",
  },
});

export const utils = (marginHorizontal?: DimensionValue) =>
  StyleSheet.create({
    divider: {
      borderTopWidth: 1,
      borderColor: "#efefef",
      marginVertical: 8,
      marginHorizontal: marginHorizontal ?? 8,
    },
  });
