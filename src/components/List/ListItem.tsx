import DigiButton from "@Components/Button/DigiButton";
import { View, Text, StyleSheet } from "react-native";

export interface ListItemProps {
  text: string;
  subText?: string;
  buttonText?: string;
  onPress?: () => void;
}

export default function ListItem({ text, subText, buttonText, onPress }: ListItemProps) {
  return (
    <View style={styles.listItem}>
      <View>
        <Text style={styles.text}>{text}</Text>
        {subText && <Text style={styles.subText}>{subText}</Text>}
      </View>
      {buttonText && <DigiButton title="Remove" variant="text" onPress={onPress} />}
    </View>
  );
}

const styles = StyleSheet.create({
  listItem: {
    height: 60,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 16,
    fontWeight: "100",
  },
  subText: {
    fontSize: 12,
    fontWeight: "100",
    fontStyle: "italic",
    color: "#979797",
  },
});
