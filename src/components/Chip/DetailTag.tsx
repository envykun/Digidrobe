import { View, Text, StyleSheet } from "react-native";

export interface DetailTagProps {
  label: string;
}

export default function DetailTag({ label }: DetailTagProps) {
  return (
    <View style={styles.detail}>
      <Text style={styles.detailText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  detail: {
    borderRadius: 4,
    backgroundColor: "#e0e0e0",
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  detailText: {
    fontSize: 10,
  },
});
