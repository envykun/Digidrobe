import { useState } from "react";
import { StyleSheet, TextInput, TextInputProps } from "react-native";

export interface InputProps {
  placeholder?: string;
  textInputProps?: Partial<TextInputProps>;
  onChange?: (value?: string) => void;
}

export default function Input({
  placeholder,
  textInputProps,
  onChange,
}: InputProps) {
  const [text, setText] = useState<string>("");

  const handleChange = (text: string) => {
    setText(text);
    onChange && onChange(text);
  };

  return (
    <TextInput
      {...textInputProps}
      value={text}
      onChangeText={handleChange}
      placeholder={placeholder ?? "Please type..."}
      style={styles.input}
      onBlur={() => {
        onChange && onChange(text);
      }}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: "#d8d8d876",
    height: 40,
    flex: 1,
    zIndex: 1,
  },
});
