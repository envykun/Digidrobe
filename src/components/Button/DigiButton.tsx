import { Colors } from "@Styles/colors";
import { ReactNode } from "react";
import { Button, GestureResponderEvent, TouchableHighlight, StyleSheet, Text } from "react-native";

interface DigiButtonProps {
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
  variant?: DigiButtonVariant;
  icon?: ReactNode;
}

type DigiButtonVariant = "default" | "outline" | "contained" | "text";

export default function DigiButton({ title, onPress, variant = "default", icon }: DigiButtonProps) {
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
          <>
            {icon}
            <Text style={styles.title}>{title}</Text>
          </>
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
    flexDirection: "row",
    columnGap: 4,
    alignItems: "center",
  },
  variantText: {},
  variantContained: {},
  variantOutline: {},
  title: {
    fontSize: 16,
    color: Colors.primary,
  },
});
