import { View, Text, StyleSheet, TouchableOpacity, TouchableHighlight } from "react-native";
interface ShortcutItemProps {
  label: string;
  icon?: React.ReactNode;
  onPress?: () => void;
}

export default function ShortcutItem({ label, icon, onPress }: ShortcutItemProps) {
  return (
    <TouchableHighlight style={styles.shortcutTap} onPress={onPress} underlayColor="lightgrey" activeOpacity={0.9}>
      <>
        {icon}
        <Text>{label}</Text>
      </>
    </TouchableHighlight>
  );
}
const styles = StyleSheet.create({
  shortcutTap: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "space-evenly",
    height: "100%",
    aspectRatio: 1 / 1,
  },
});
