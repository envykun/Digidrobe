import DigiButton from "@Components/Button/DigiButton";
import { TouchableOpacity, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { i18n } from "@Database/i18n/i18n";

export interface FilterBottomSheetHeaderProps {
  filterType: FilterType;
  handleGoBack: () => void;
  onApply: () => void;
}

export type FilterType = "color" | "brand" | "fabric" | "store" | undefined;

export default function FilterBottomSheetHeader({ filterType, handleGoBack, onApply }: FilterBottomSheetHeaderProps) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
        {filterType && (
          <TouchableOpacity onPress={handleGoBack}>
            <Ionicons name="ios-arrow-back" size={24} color="black" />
          </TouchableOpacity>
        )}
        <Text>{i18n.t("filter.filterBy", { type: filterType ? i18n.t(`item.${filterType}`) : "..." })}</Text>
      </View>
      <DigiButton title={filterType ? "Confirm" : "Apply"} variant="text" onPress={filterType ? handleGoBack : onApply} />
    </View>
  );
}
