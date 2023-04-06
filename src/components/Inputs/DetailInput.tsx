import { Text, View, StyleSheet } from "react-native";
import Input, { InputProps } from "./Input";
import DateTimePickerInput from "./DateTimePickerInput";

interface DetailInputProps {
  label: string;
  inputProps?: Partial<InputProps>;
  type?: string;
}
export default function DetailInput({ label, inputProps, type }: DetailInputProps) {
  return (
    <View style={styles.detail}>
      <Text style={{ fontSize: 16, fontWeight: "100", minWidth: "30%" }}>{label}</Text>
      {type === "date" ? <DateTimePickerInput /> : <Input {...inputProps} />}
    </View>
  );
}

const styles = StyleSheet.create({
  detail: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
  },
});
