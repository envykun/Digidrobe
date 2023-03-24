import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface ChipProps {
  label: string;
  onPress?: () => void;
  active?: boolean;
}

export default function Chip({ label, onPress, active = false }: ChipProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.chip, active && styles.active]}>
        <Text style={styles.label}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: 16,
    backgroundColor: "grey",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  label: {
    color: "white",
  },
  active: {
    backgroundColor: "black",
  },
});
