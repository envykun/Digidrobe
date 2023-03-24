import { PropsWithChildren } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

interface FilterBarProps {}

export default function FilterBar({ children }: PropsWithChildren<FilterBarProps>) {
  return (
    <ScrollView horizontal contentContainerStyle={styles.filterBar}>
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  filterBar: {
    flexDirection: "row",
    gap: 8,
    height: 80,
    alignItems: "center",
    paddingHorizontal: 8,
  },
});
