import { View, Text, StyleSheet } from "react-native";
import Input, { InputProps } from "./Input";

interface InputWithLabelProps {
  label?: string;
  inputProps?: Partial<InputProps>;
}

export default function InputWithLabel({ label, inputProps }: InputWithLabelProps) {
  return (
    <View style={styles.container}>
      <Text>{label}</Text>
      <Input {...inputProps} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    rowGap: 2,
  },
});
