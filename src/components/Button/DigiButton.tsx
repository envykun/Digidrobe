import { Colors } from "@Styles/colors";
import { ReactNode } from "react";
import { Button, GestureResponderEvent, TouchableHighlight, StyleSheet, Text, View, Animated } from "react-native";

interface DigiButtonProps {
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
  variant?: DigiButtonVariant;
  icon?: ReactNode;
  badge?: number;
}

type DigiButtonVariant = "default" | "outline" | "contained" | "text";

export default function DigiButton({ title, onPress, variant = "default", icon, badge }: DigiButtonProps) {
  switch (variant) {
    case "contained":
    case "outline":
      return (
        <TouchableHighlight
          underlayColor="#dddddd"
          onPress={onPress}
          style={[styles.button, styles.variantOutline, Boolean(badge) && styles.hasBadge]}
        >
          <>
            {icon}
            <Text>{title}</Text>
            {Boolean(badge) && (
              <Animated.View style={[styles.badge]}>
                <Text style={{ fontSize: 12 }}>{badge}</Text>
              </Animated.View>
            )}
          </>
        </TouchableHighlight>
      );
    case "text":
      return (
        <TouchableHighlight
          underlayColor="#dddddd"
          onPress={onPress}
          style={[styles.button, styles.variantText, Boolean(badge) && styles.hasBadge]}
        >
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
    justifyContent: "center",
  },
  variantText: {},
  variantContained: {},
  variantOutline: {
    borderWidth: 1,
  },
  title: {
    fontSize: 16,
    color: Colors.primary,
  },
  badge: {
    marginLeft: 8,
    borderRadius: 16,
    height: "100%",
    aspectRatio: 1 / 1,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 8,
  },
  hasBadge: {
    paddingRight: 32,
  },
});
