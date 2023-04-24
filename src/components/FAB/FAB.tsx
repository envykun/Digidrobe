import { ReactElement } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@Styles/colors";

export interface FABProps {
  icon?: ReactElement;
  onPress?: () => void;
}

export default function FAB({ icon, onPress }: FABProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.4}>
      {icon ?? <Ionicons name="add" size={36} color="black" />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 24,
    right: 12,
    backgroundColor: Colors.primary,
    borderRadius: 150,
    width: 54,
    height: 54,
    justifyContent: "center",
    alignItems: "center",
    elevation: 1,
    paddingLeft: 2,
  },
});
