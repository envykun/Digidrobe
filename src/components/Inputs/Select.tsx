import { useContext, useState } from "react";
import { View, Text, StyleSheet, TouchableHighlight } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomSheetContext, { BottomSheetContent } from "@Context/BottomSheetContext";

export interface SelectProps {
  contentType?: BottomSheetContent;
  onValueChange?: (value?: string) => void;
  defaultValue?: string;
}

export default function Select({ contentType, defaultValue, onValueChange }: SelectProps) {
  const bottomSheet = useContext(BottomSheetContext);
  const [selectedValue, setSelectedValue] = useState<string | undefined>(defaultValue);

  const toggleOpen = () => {
    if (!bottomSheet) return;
    bottomSheet.setContentType(contentType);
    bottomSheet.setOnPress(() => handleItemSelect);
    bottomSheet.setIsOpen(true);
  };
  const handleItemSelect = (i: string) => {
    onValueChange && onValueChange(i);
    setSelectedValue(i);
    bottomSheet?.resetBottomSheet();
  };

  return (
    <View style={{ position: "relative", flex: 1, borderRadius: 12, overflow: "hidden" }}>
      <TouchableHighlight onPress={toggleOpen} underlayColor="#979797">
        <>
          <View style={styles.selectBox}>
            <Text>{selectedValue}</Text>
          </View>
          <View style={styles.iconStyle}>
            <Ionicons name="chevron-down" size={20} color="#7c7c7c" />
          </View>
        </>
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  selectBox: {
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: "#d8d8d876",
    height: 40,
    zIndex: 1,
    width: "100%",
    position: "relative",
    justifyContent: "center",
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
