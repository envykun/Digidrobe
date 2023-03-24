import { Text, View, StyleSheet } from "react-native";

interface DetailProps {
  label: string;
  value: string;
}
export default function Detail({ label, value }: DetailProps) {
  return (
    <View style={styles.detail}>
      <Text style={{ fontSize: 16, fontWeight: "100" }}>{label}</Text>
      <Text style={{ fontSize: 16 }}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  detail: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
  },
});
