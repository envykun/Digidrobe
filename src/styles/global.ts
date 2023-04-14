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
