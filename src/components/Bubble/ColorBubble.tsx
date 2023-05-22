import { View, StyleSheet } from "react-native";

export interface ColorBubbleProps {
  color: string;
  size?: number;
}

export default function ColorBubble({ color, size = 16 }: ColorBubbleProps) {
  return <View style={[styles(size, color).colorBubble, styles(size, color).shadowProp]} />;
}

const styles = (size: number, color: string) =>
  StyleSheet.create({
    colorBubble: {
      height: size,
      aspectRatio: 1 / 1,
      borderRadius: 180,
      backgroundColor: color,
    },
    shadowProp: {
      shadowColor: "#171717",
      shadowOffset: { width: -2, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 2,
    },
  });
