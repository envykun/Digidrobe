import { StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from "react-native";

interface CalendarDateItemProps {
  date: number;
  day: string;
  selected?: boolean;
  current?: boolean;
  past?: boolean;
  onPress?: () => void;
}

export default function CalendarDateItem({ date, day, selected = false, current = false, past = false, onPress }: CalendarDateItemProps) {
  return (
    <TouchableHighlight onPress={onPress} style={styles.dateItem}>
      <View style={[styles.dateItem, selected && styles.selected, current && styles.current, past && !selected && styles.past]}>
        <Text style={[current && !selected && styles.currentText, past && !selected && styles.past]}>{date}</Text>
        <Text style={[current && !selected && styles.currentText, past && !selected && styles.past]}>{day}</Text>
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  dateItem: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    elevation: 1,
    borderRadius: 8,
    backgroundColor: "white",
  },
  selected: {
    backgroundColor: "#E2C895",
    borderColor: "#E2C895",
  },
  current: {
    borderColor: "#E2C895",
  },
  currentText: {
    color: "#E2C895",
  },
  past: {
    color: "#9b9b9b",
    backgroundColor: "#eeeeee",
  },
});
