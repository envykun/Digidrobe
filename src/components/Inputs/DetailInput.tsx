import { Text, View, StyleSheet } from "react-native";
import Input, { InputProps } from "./Input";
import DateTimePickerInput from "./DateTimePickerInput";
import { PropsWithChildren, useContext, useEffect, useState } from "react";
import MultiSelectWithChips from "./MultiSelectWithChips";
import BottomSheetContext from "@Context/BottomSheetContext";
import MultiSelectWithColor from "./MultiSelectWithColor";
import Select from "./Select";
import { GenericBottomSheetItem } from "@Models/Generic";
import { transformValueToBottomSheetItem } from "@DigiUtils/helperFunctions";

export interface DetailInputProps {
  label: string;
  inputProps?: Partial<InputProps>;
  type?: InputType;
  defaultValue?: string | string[];
}

export type InputType =
  | "date"
  | "autocomplete"
  | "multi-select"
  | "multi-select-color"
  | "select"
  | "default";

export default function DetailInput({
  label,
  inputProps,
  type = "default",
  defaultValue,
  children,
}: PropsWithChildren<DetailInputProps>) {
  const defaultValueParsed = defaultValue
    ? transformValueToBottomSheetItem(defaultValue)
    : defaultValue;
  const [selectedValues, setSelectedValues] = useState<
    GenericBottomSheetItem[]
  >(Array.isArray(defaultValueParsed) ? defaultValueParsed : []);
  const bottomSheet = useContext(BottomSheetContext);

  const handleMultiSelect = (value: GenericBottomSheetItem) => {
    setSelectedValues((old) => [...old, value]);
  };

  const removeSelectedValue = (id: string) => {
    setSelectedValues((oldValues) => oldValues.filter((v) => v.id !== id));
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
    inputProps &&
      inputProps.onChange &&
      inputProps.onChange(value?.toISOString());
  };

  useEffect(() => {
    if (type === "multi-select" || type === "multi-select-color") {
      inputProps && inputProps.onChange && inputProps.onChange(selectedValues);
      bottomSheet?.setSelectedValues(selectedValues);
    }
  }, [selectedValues]);

  const renderInput = (inputType?: InputType) => {
    switch (inputType) {
      case "date":
        return (
          <DateTimePickerInput
            onChange={handleDateChange}
            defaultValue={
              !Array.isArray(defaultValue) ? defaultValue : undefined
            }
          />
        );
      case "multi-select":
        return (
          <MultiSelectWithChips
            selectedValues={selectedValues}
            onButtonPress={handleBottomSheet}
            onChipPress={removeSelectedValue}
          />
        );
      case "multi-select-color":
        return (
          <MultiSelectWithColor
            selectedValues={selectedValues}
            onButtonPress={handleBottomSheet}
            onChipPress={removeSelectedValue}
          />
        );
      case "autocomplete":
        return <Text>TODO: Add Autocomplete</Text>;
      case "select":
        return (
          <Select
            contentType={"BaseCategories"}
            defaultValue={
              defaultValue && !Array.isArray(defaultValue)
                ? { id: defaultValue, label: defaultValue }
                : undefined
            }
            onValueChange={inputProps?.onChange}
          />
        );
      default:
        return (
          <Input
            {...inputProps}
            defaultValue={
              !Array.isArray(defaultValue) ? defaultValue : undefined
            }
          />
        );
    }
  };

  return (
    <View style={styles.detail}>
      <Text
        numberOfLines={1}
        style={{
          fontSize: 16,
          fontWeight: "100",
          minWidth: "30%",
          maxWidth: "35%",
        }}
      >
        {label}
      </Text>
      {children ?? renderInput(type)}
    </View>
  );
}

const styles = StyleSheet.create({
  detail: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    gap: 16,
  },
});
