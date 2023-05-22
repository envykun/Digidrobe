import { Text, View, StyleSheet } from "react-native";
import Input, { InputProps } from "./Input";
import DateTimePickerInput from "./DateTimePickerInput";
import { useContext, useEffect, useState } from "react";
import MultiSelectWithChips from "./MultiSelectWithChips";
import BottomSheetContext, { BottomSheetContent } from "@Context/BottomSheetContext";
import MultiSelectWithColor from "./MultiSelectWithColor";

export interface DetailInputProps {
  label: string;
  inputProps?: Partial<InputProps>;
  type?: InputType;
  defaultValue?: string | string[];
}

export type InputType = "date" | "autocomplete" | "multi-select" | "multi-select-color" | "default";

export default function DetailInput({ label, inputProps, type = "default", defaultValue }: DetailInputProps) {
  const [selectedValues, setSelectedValues] = useState<Array<string>>(Array.isArray(defaultValue) ? defaultValue : []);
  const bottomSheet = useContext(BottomSheetContext);

  const handleMultiSelect = (value: string) => {
    setSelectedValues((old) => [...old, value]);
  };

  const removeSelectedValue = (value: string) => {
    setSelectedValues((oldValues) => oldValues.filter((v) => v !== value));
  };

  const handleBottomSheet = () => {
    if (!bottomSheet) return;
    bottomSheet.setTitle(`Select ${label}...`);
    bottomSheet.setShowSearch(true);
    bottomSheet.setContentType(label);
    bottomSheet.setSelectedValues(selectedValues);
    bottomSheet.setOnPress(() => handleMultiSelect);
    bottomSheet.setIsOpen(true);
  };

  const handleDateChange = (value?: Date) => {
    inputProps && inputProps.onChange && inputProps.onChange(value?.toISOString());
  };

  useEffect(() => {
    if (type === "multi-select" || type === "multi-select-color") {
      inputProps && inputProps.onChange && inputProps.onChange(selectedValues);
      bottomSheet?.setSelectedValues(selectedValues);
    }
  }, [selectedValues]);

  const renderInput = (inputType?: string) => {
    switch (inputType) {
      case "date":
        return <DateTimePickerInput onChange={handleDateChange} defaultValue={!Array.isArray(defaultValue) ? defaultValue : undefined} />;
      case "multi-select":
        return <MultiSelectWithChips selectedValues={selectedValues} onButtonPress={handleBottomSheet} onChipPress={removeSelectedValue} />;
      case "multi-select-color":
        return <MultiSelectWithColor selectedValues={selectedValues} onButtonPress={handleBottomSheet} onChipPress={removeSelectedValue} />;
      default:
        return <Input {...inputProps} defaultValue={!Array.isArray(defaultValue) ? defaultValue : undefined} />;
    }
  };

  return (
    <View style={styles.detail}>
      <Text style={{ fontSize: 16, fontWeight: "100", minWidth: "30%" }}>{label}</Text>
      {renderInput(type)}
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
