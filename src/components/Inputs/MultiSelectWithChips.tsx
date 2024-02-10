import DigiButton from "@Components/Button/DigiButton";
import Chip from "@Components/Chip/Chip";
import { GenericBottomSheetItem } from "@Models/Generic";
import { View } from "react-native";

interface MultiSelectWithChipsProps {
  selectedValues?: GenericBottomSheetItem[];
  onChipPress: (value: string) => void;
  onButtonPress?: () => void;
  buttonLabel?: string;
}

export default function MultiSelectWithChips({
  selectedValues,
  onChipPress,
  onButtonPress,
  buttonLabel,
}: MultiSelectWithChipsProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        flexWrap: "wrap",
        flex: 1,
        justifyContent: "flex-end",
      }}
    >
      {selectedValues?.map((value) => (
        <Chip
          key={value.id}
          label={value.label}
          onPress={() => onChipPress(value.id)}
          showCloseIcon={true}
        />
      ))}
      <DigiButton
        title={buttonLabel ?? "Add"}
        onPress={onButtonPress}
        variant="text"
      />
    </View>
  );
}
