import { TouchableOpacity, Text } from "react-native";
import { BottomSheetItemProps } from "./BottomSheet.interface";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@Styles/colors";

export default function BottomSheetItem({ label, onPress, selected = false }: BottomSheetItemProps) {
  const handlePress = () => {
    onPress && onPress(label);
  };
  return (
    <TouchableOpacity style={{ justifyContent: "center", alignItems: "center", height: 40 }} onPress={handlePress}>
      <Text style={{ fontSize: 16 }}>{label}</Text>
      {selected && <Ionicons name="ios-checkmark" color={Colors.primary} size={18} style={{ position: "absolute", right: "10%" }} />}
    </TouchableOpacity>
  );
}
