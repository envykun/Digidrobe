import { StyleSheet, StatusBar } from "react-native";

export const layout = StyleSheet.create({
  scrollContainer: {
    height: "100%",
    backgroundColor: "white",
  },
  noHeaderSpacing: {
    paddingTop: StatusBar.currentHeight,
    position: "relative",
  },
});

export const utils = (marginHorizontal?: number | string) =>
  StyleSheet.create({
    divider: {
      borderTopWidth: 1,
      borderColor: "#efefef",
      marginVertical: 8,
      marginHorizontal: marginHorizontal ?? 8,
    },
  });
