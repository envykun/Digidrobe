import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ColorBubble from "@Components/Bubble/ColorBubble";

interface ChipProps {
  label: string;
  onPress?: () => void;
  active?: boolean;
  showCloseIcon?: boolean;
  colorBubble?: string;
}

export default function Chip({ label, onPress, active = false, showCloseIcon = false, colorBubble }: ChipProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[styles.chip, active && styles.active, showCloseIcon && styles.iconSpacingRight, !!colorBubble && styles.iconSpacingLeft]}
      >
        {colorBubble && (
          <View style={styles.colorBubble}>
            <ColorBubble color={colorBubble} />
          </View>
        )}
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
  iconSpacingRight: {
    paddingRight: 32,
  },
  iconSpacingLeft: {
    paddingLeft: 32,
  },
  iconStyle: {
    position: "absolute",
    right: 8,
  },
  colorBubble: {
    position: "absolute",
    left: 8,
  },
});
