import DetailTag from "@Components/Chip/DetailTag";
import { Text, View, StyleSheet } from "react-native";

export interface DetailProps {
  label: string;
  value?: string | number | Array<string>;
  suffix?: string;
}
export default function Detail({ label, value, suffix }: DetailProps) {
  return (
    <View style={styles.detail}>
      <Text style={{ fontSize: 16, fontWeight: "100" }}>{label}</Text>
      {Array.isArray(value) ? (
        <View style={styles.children}>
          {value.map((d) => (
            <DetailTag key={d} label={d} />
          ))}
        </View>
      ) : (
        <Text style={{ fontSize: 16, maxWidth: 240 }}>
          {value ?? "-"}
          {value || value === 0 ? suffix : null}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  detail: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
    gap: 16,
  },
  children: {
    flexDirection: "row",
    gap: 4,
    flexWrap: "wrap",
    flex: 1,
    justifyContent: "flex-end",
  },
});
