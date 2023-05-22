import { useState } from "react";
import { StyleSheet, TextInput, TextInputProps, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface InputProps {
  placeholder?: string;
  textInputProps?: Partial<TextInputProps>;
  defaultValue?: string;
  onChange?: (value?: any) => void;
  clearButton?: boolean;
}

export default function Input({ placeholder, textInputProps, defaultValue, onChange, clearButton = false }: InputProps) {
  const [text, setText] = useState<string>(defaultValue ?? "");

  const handleChange = (text: string) => {
    setText(text);
    onChange && onChange(text);
  };

  return (
    <>
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
      {clearButton && text && text !== "" && (
        <TouchableOpacity onPress={() => handleChange("")} style={styles.iconStyle}>
          <Ionicons name="close-outline" size={28} color="black" />
        </TouchableOpacity>
      )}
    </>
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
    position: "relative",
  },
  iconStyle: {
    position: "absolute",
    zIndex: 2,
    right: 0,
    height: 40,
    aspectRatio: 1 / 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 160,
  },
});
