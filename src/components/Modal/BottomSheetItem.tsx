import { TouchableOpacity, Text } from "react-native";
import { BottomSheetItemProps } from "./BottomSheet.interface";

export default function BottomSheetItem({ label, onPress }: BottomSheetItemProps) {
  const handlePress = () => {
    onPress && onPress(label);
  };
  return (
    <TouchableOpacity style={{ justifyContent: "center", alignItems: "center", height: 40 }} onPress={handlePress}>
      <Text style={{ fontSize: 16 }}>{label}</Text>
    </TouchableOpacity>
  );
}
