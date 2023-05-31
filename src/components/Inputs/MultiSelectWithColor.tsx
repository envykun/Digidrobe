import DigiButton from "@Components/Button/DigiButton";
import Chip from "@Components/Chip/Chip";
import { NamedBaseColor, NamedBaseColors } from "@Styles/colors";
import { View } from "react-native";

interface MultiSelectWithColorProps {
  selectedValues?: Array<string>;
  onChipPress: (value: string) => void;
  onButtonPress?: () => void;
  buttonLabel?: string;
}

export default function MultiSelectWithColor({ selectedValues, onChipPress, onButtonPress, buttonLabel }: MultiSelectWithColorProps) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap", flex: 1, justifyContent: "flex-end" }}>
      {selectedValues?.map((value) => (
        <Chip
          key={value}
          label={value}
          onPress={() => onChipPress(value)}
          showCloseIcon={true}
          colorBubble={NamedBaseColors[value as NamedBaseColor]}
        />
      ))}
      <DigiButton title={buttonLabel ?? "Add"} onPress={onButtonPress} variant="text" />
    </View>
  );
}
