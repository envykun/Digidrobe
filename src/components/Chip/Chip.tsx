import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ChipProps {
  label: string;
  onPress?: () => void;
  active?: boolean;
  showCloseIcon?: boolean;
}

export default function Chip({ label, onPress, active = false, showCloseIcon = false }: ChipProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.chip, active && styles.active, showCloseIcon && styles.iconSpacing]}>
        <Text style={active && styles.label}>{label}</Text>
        {showCloseIcon && <Ionicons name="close-outline" size={20} color="black" style={styles.iconStyle} />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: 8,
    backgroundColor: "lightgrey",
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  label: {
    color: "white",
  },
  active: {
    backgroundColor: "black",
  },
  iconSpacing: {
    paddingRight: 32,
  },
  iconStyle: {
    position: "absolute",
    right: 8,
  },
});
