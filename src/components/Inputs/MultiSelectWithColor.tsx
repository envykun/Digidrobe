import DigiButton from "@Components/Button/DigiButton";
import Chip from "@Components/Chip/Chip";
import { GenericBottomSheetItem } from "@Models/Generic";
import { NamedBaseColor, NamedBaseColors } from "@Styles/colors";
import { View } from "react-native";

interface MultiSelectWithColorProps {
  selectedValues?: Array<GenericBottomSheetItem>;
  onChipPress: (value: string) => void;
  onButtonPress?: () => void;
  buttonLabel?: string;
}

export default function MultiSelectWithColor({
  selectedValues,
  onChipPress,
  onButtonPress,
  buttonLabel,
}: MultiSelectWithColorProps) {
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
          colorBubble={NamedBaseColors[value.label as NamedBaseColor]}
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
