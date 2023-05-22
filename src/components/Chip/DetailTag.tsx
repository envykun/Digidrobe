import ColorBubble from "@Components/Bubble/ColorBubble";
import { View, Text, StyleSheet } from "react-native";

export interface DetailTagProps {
  label: string;
  isColor?: boolean;
}

export default function DetailTag({ label, isColor }: DetailTagProps) {
  if (isColor) {
    return <ColorBubble color={label} size={24} />;
  }

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
    textTransform: "capitalize",
  },
});
