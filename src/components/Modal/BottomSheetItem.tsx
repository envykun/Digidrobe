import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { BottomSheetItemProps } from "./BottomSheet.interface";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@Styles/colors";

export default function BottomSheetItem({ label, onPress, selected = false, color }: BottomSheetItemProps) {
  const handlePress = () => {
    onPress && onPress(label);
  };
  return (
    <TouchableOpacity style={{ justifyContent: "center", alignItems: "center", height: 40 }} onPress={handlePress}>
      {color && <View style={[styles(color).colorBubble, styles(color).shadowProp]} />}
      <Text style={{ fontSize: 16 }}>{label}</Text>
      {selected && <Ionicons name="checkmark" color={Colors.primary} size={18} style={{ position: "absolute", right: "10%" }} />}
    </TouchableOpacity>
  );
}

const styles = (color: string) =>
  StyleSheet.create({
    colorBubble: {
      backgroundColor: color,
      width: 24,
      height: 24,
      borderRadius: 180,
      position: "absolute",
      left: "10%",
    },
    shadowProp: {
      shadowColor: "#171717",
      shadowOffset: { width: -2, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 2,
    },
  });
