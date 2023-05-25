import DetailTag from "@Components/Chip/DetailTag";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";

export interface DetailProps {
  label: string;
  value?: string | number | Array<string>;
  suffix?: string;
  isColor?: boolean;
  onPressEdit?: () => void;
}
export default function Detail({ label, value, suffix, isColor, onPressEdit }: DetailProps) {
  return (
    <View style={styles.detail}>
      <Text style={{ fontSize: 16, fontWeight: "100" }}>{label}</Text>
      {Array.isArray(value) ? (
        <View style={styles.children}>
          {value.map((d) => (
            <DetailTag key={d} label={d} isColor={isColor} />
          ))}
        </View>
      ) : (
        <TouchableOpacity disabled={!Boolean(onPressEdit)} onPress={onPressEdit}>
          <Text style={{ fontSize: 16, maxWidth: 240 }}>
            {value ?? "-"}
            {value || value === 0 ? suffix : null}
          </Text>
        </TouchableOpacity>
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
