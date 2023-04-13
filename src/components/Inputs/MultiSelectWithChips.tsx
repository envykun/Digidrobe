import DigiButton from "@Components/Button/DigiButton";
import Chip from "@Components/Chip/Chip";
import { View } from "react-native";

interface MultiSelectWithChipsProps {
  selectedValues?: Array<string>;
  onChipPress: (value: string) => void;
  onButtonPress?: () => void;
  buttonLabel?: string;
}

export default function MultiSelectWithChips({ selectedValues, onChipPress, onButtonPress, buttonLabel }: MultiSelectWithChipsProps) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap", flex: 1, justifyContent: "flex-end" }}>
      {selectedValues?.map((value) => (
        <Chip key={value} label={value} onPress={() => onChipPress(value)} showCloseIcon={true} />
      ))}
      <DigiButton title={buttonLabel ?? "Add"} onPress={onButtonPress} variant="text" />
    </View>
  );
}
