import { useState } from "react";
import { StyleSheet, TextInput, TextInputProps, TouchableOpacity, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@Styles/colors";

export interface InputProps {
  placeholder?: string;
  textInputProps?: Partial<TextInputProps>;
  defaultValue?: string;
  onChange?: (value?: any) => void;
  clearButton?: boolean;
  error?: string;
}

export default function Input({ placeholder, textInputProps, defaultValue, onChange, clearButton = false, error }: InputProps) {
  const [text, setText] = useState<string>(defaultValue ?? "");

  const handleChange = (text: string) => {
    setText(text);
    onChange && onChange(text);
  };

  return (
    <View style={styles.container}>
      <TextInput
        {...textInputProps}
        value={text}
        onChangeText={handleChange}
        placeholder={placeholder ?? "Please type..."}
        style={[styles.input, error ? styles.error : {}]}
        onBlur={() => {
          onChange && onChange(text);
        }}
      />
      {clearButton && text && text !== "" && (
        <TouchableOpacity onPress={() => handleChange("")} style={styles.iconStyle}>
          <Ionicons name="close-outline" size={28} color="black" />
        </TouchableOpacity>
      )}
      {error && <Text style={styles.textError}>* {error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    minHeight: 40,
  },
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
  textError: {
    color: Colors.error,
    marginTop: 4,
  },
  error: {
    borderColor: Colors.error,
    borderWidth: 1,
  },
});
