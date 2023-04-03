import { Text, View, StyleSheet } from "react-native";
import Input, { InputProps } from "./Input";

interface DetailInputProps {
  label: string;
  inputProps?: Partial<InputProps>;
}
export default function DetailInput({ label, inputProps }: DetailInputProps) {
  return (
    <View style={styles.detail}>
      <Text style={{ fontSize: 16, fontWeight: "100", minWidth: "30%" }}>{label}</Text>
      <Input {...inputProps} />
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
