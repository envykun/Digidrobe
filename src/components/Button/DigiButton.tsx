import { Colors } from "@Styles/colors";
import { Button, GestureResponderEvent, TouchableHighlight, StyleSheet, Text } from "react-native";

interface DigiButtonProps {
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
  variant?: DigiButtonVariant;
}

type DigiButtonVariant = "default" | "outline" | "contained" | "text";

export default function DigiButton({ title, onPress, variant = "default" }: DigiButtonProps) {
  switch (variant) {
    case "contained":
    case "outline":
      return (
        <TouchableHighlight underlayColor="#dddddd" onPress={onPress} style={styles.variantOutline}>
          <Text>{title}</Text>
        </TouchableHighlight>
      );
    case "text":
      return (
        <TouchableHighlight underlayColor="#dddddd" onPress={onPress} style={[styles.button, styles.variantText]}>
          <Text style={styles.title}>{title}</Text>
        </TouchableHighlight>
      );
    default:
      return <Button title={title} onPress={onPress} />;
  }
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    padding: 8,
  },
  variantText: {},
  variantContained: {},
  variantOutline: {},
  title: {
    fontSize: 16,
    color: Colors.primary,
  },
});
