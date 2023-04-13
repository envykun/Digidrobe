import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Text, Platform, TouchableOpacity, View } from "react-native";

export default function DateTimePickerInput() {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState<any>("date");
  const [show, setShow] = useState(false);

  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  const showMode = (currentMode: any) => {
    if (Platform.OS === "android") {
      setShow(false);
      // for iOS, add a button that closes the picker
    }
    setMode(currentMode);
  };

  const showDatePicker = () => {
    showMode("date");
    setShow(true);
  };
  console.log("PICKED DATE", date.toISOString());
  return (
    <View style={{ height: 40, justifyContent: "center" }}>
      {/* <Button onPress={showDatePicker} title="Pick Date" /> */}
      <TouchableOpacity onPress={showDatePicker}>
        <Text style={{ fontSize: 16, maxWidth: 240 }}>
          {date.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })}
        </Text>
      </TouchableOpacity>
      {show && (
        <DateTimePicker testID="dateTimePicker" value={date} mode={mode} is24Hour={true} onChange={onChange} accentColor="#E2C895" />
      )}
    </View>
  );
}
