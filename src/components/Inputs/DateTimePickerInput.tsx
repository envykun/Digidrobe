import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Text, Platform, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface DateTimePickerInputProps {
  onChange?: (value?: Date) => void;
  text?: string;
  iconSize?: number;
}

export default function DateTimePickerInput({ onChange, text, iconSize }: DateTimePickerInputProps) {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShow(false);
    if (event.type === "set") {
      selectedDate && setDate(selectedDate);
      onChange && onChange(selectedDate);
    }
  };

  const showDatePicker = () => {
    setShow(true);
  };

  return (
    <View style={{ height: 40, justifyContent: "center" }}>
      <TouchableOpacity onPress={showDatePicker} style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
        <Ionicons name="ios-calendar-outline" size={iconSize ?? 20} color="black" />
        <Text style={{ fontSize: 16, maxWidth: 240 }}>
          {text ? text : date.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })}
        </Text>
      </TouchableOpacity>
      {show && (
        <DateTimePicker testID="dateTimePicker" value={date} mode="date" is24Hour={true} onChange={handleChange} accentColor="#E2C895" />
      )}
    </View>
  );
}
