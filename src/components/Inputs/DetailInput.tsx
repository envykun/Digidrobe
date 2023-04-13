import { Text, View, StyleSheet, FlatList } from "react-native";
import Input, { InputProps } from "./Input";
import DateTimePickerInput from "./DateTimePickerInput";
import { useState } from "react";
import BottomSheet from "@Components/Modal/BottomSheet";
import DigiButton from "@Components/Button/DigiButton";
import BottomSheetItem from "@Components/Modal/BottomSheetItem";
import Chip from "@Components/Chip/Chip";
import MultiSelectWithChips from "./MultiSelectWithChips";

interface DetailInputProps {
  label: string;
  inputProps?: Partial<InputProps>;
  type?: InputType;
  bottomSheetData?: Array<string>;
}

export type InputType = "date" | "autocomplete" | "multi-select" | "default";

export default function DetailInput({ label, inputProps, type = "default", bottomSheetData }: DetailInputProps) {
  const [bottomSheetOpen, setBottomSheetOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string | undefined>();
  const [selectedValues, setSelectedValues] = useState<Array<string>>([]);
  const filteredData = bottomSheetData
    ?.filter((value) => selectedValues.indexOf(value) == -1)
    .concat(["Item", "Item", "Item", "Item", "Item", "Item", "Item", "Item", "Item", "Item", "Item", "Item", "Item"]);

  const handleMultiSelect = (value?: string) => {
    if (!value) return;
    setSelectedValues((old) => [...old, value]);
    inputProps && inputProps.onChange && inputProps.onChange(value);
  };

  const removeSelectedValue = (value: string) => {
    setSelectedValues((oldValues) => oldValues.filter((v) => v !== value));
  };

  const closeModal = () => {
    setBottomSheetOpen(false);
    setSearchQuery(undefined);
  };

  const handleDateChange = (value?: Date) => {
    console.log("VALUE", value);
    inputProps && inputProps.onChange && inputProps.onChange(value?.toISOString());
  };

  const renderInput = (inputType?: string) => {
    switch (inputType) {
      case "date":
        return <DateTimePickerInput onChange={handleDateChange} />;
      case "multi-select":
        return (
          <MultiSelectWithChips
            selectedValues={selectedValues}
            onButtonPress={() => setBottomSheetOpen(true)}
            onChipPress={removeSelectedValue}
          />
        );
      default:
        return <Input {...inputProps} />;
    }
  };
  return (
    <View style={styles.detail}>
      <Text style={{ fontSize: 16, fontWeight: "100", minWidth: "30%" }}>{label}</Text>
      {renderInput(type)}
      <BottomSheet title={`Select ${label}...`} isOpen={bottomSheetOpen} showSearch searchCallback={setSearchQuery} closeModal={closeModal}>
        <FlatList
          data={
            searchQuery
              ? filteredData?.filter((value) => value.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase()))
              : filteredData
          }
          renderItem={({ item }) => <BottomSheetItem label={item} onPress={handleMultiSelect} />}
          ListEmptyComponent={
            searchQuery ? <BottomSheetItem label={searchQuery} onPress={handleMultiSelect} /> : <Text>Nothing left.</Text>
          }
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
        />
      </BottomSheet>
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
  itemSeparator: {
    height: 1,
    backgroundColor: "#00000022",
    width: "100%",
    borderRadius: 12,
  },
});
