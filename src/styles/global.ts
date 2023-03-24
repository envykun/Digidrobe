import { StyleSheet, StatusBar } from "react-native";

export const layout = StyleSheet.create({
  scrollContainer: {
    height: "100%",
  },
  noHeaderSpacing: {
    paddingTop: StatusBar.currentHeight,
    position: "relative",
  },
});
