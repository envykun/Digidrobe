import { Item } from "@Classes/Item";
import { Outfit } from "@Classes/Outfit";
import BottomSheetContext from "@Context/BottomSheetContext";
import { SortFunctionsItems, SortFunctionsOutfits, sortFunctionsItems, sortFunctionsOutfits } from "@DigiUtils/sortFunctions";
import { Colors } from "@Styles/colors";
import { useContext, useEffect, useState } from "react";
import { FlatList, TouchableOpacity, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface UseSortProps<T> {
  data?: T[];
}

export const useSort = <T,>({ data }: UseSortProps<T>) => {
  const bottomSheet = useContext(BottomSheetContext);
  const [sortingType, setSortingType] = useState<any>("name");
  const [sortedData, setSortedData] = useState(data);
  const [reversed, setReversed] = useState(false);

  const isWardrobe = data?.every((e) => e instanceof Item);
  const isOutfit = data?.every((e) => e instanceof Outfit);

  useEffect(() => {
    handleSorting(sortingType, data);
  }, [data, sortingType, reversed]);

  const handleBottomSheet = () => {
    if (!bottomSheet) return;
    bottomSheet.setContent(
      <BottomSheetSort
        handleSortFunctionSelection={handleSortFunctionSelection}
        sortingFunction={sortingType}
        sheetKeys={isWardrobe ? sortFunctionsItems : sortFunctionsOutfits}
      />
    );
    bottomSheet.setIsOpen((prev) => !prev);
  };

  const handleSorting = (type: any, data?: T[]) => {
    let sortedDataTemp: T[] = data ?? [];
    if (isWardrobe) {
      const sortFunction = sortFunctionsItems[type as keyof SortFunctionsItems];
      const sortedData = sortFunction(data as Item[]) as T[];
      sortedDataTemp = sortedData;
    }
    if (isOutfit) {
      const sortFunction = sortFunctionsOutfits[type as keyof SortFunctionsOutfits];
      const sortedData = sortFunction(data as Outfit[]) as T[];
      sortedDataTemp = sortedData;
    }
    reversed ? setSortedData([...sortedDataTemp?.reverse()]) : setSortedData(sortedDataTemp);
  };

  const handleSortFunctionSelection = (item: string) => {
    bottomSheet?.setIsOpen(false);
    setSortingType(item);
  };

  return { sortedData, handleBottomSheet, reversed, setReversed, sortingType };
};

function BottomSheetSort({ handleSortFunctionSelection, sortingFunction, sheetKeys }: any) {
  return (
    <FlatList
      data={Object.keys(sheetKeys)}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => handleSortFunctionSelection(item)}
          style={{
            flex: 1,
            height: 48,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            position: "relative",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: item === sortingFunction ? Colors.primary : undefined,
            }}
          >
            {item}
          </Text>
          {item === sortingFunction && (
            <Ionicons name="ios-checkmark" color={Colors.primary} size={18} style={{ position: "absolute", right: "10%" }} />
          )}
        </TouchableOpacity>
      )}
      ItemSeparatorComponent={() => (
        <View
          style={{
            borderBottomWidth: 1,
            opacity: 0.2,
            width: "80%",
            alignSelf: "center",
          }}
        />
      )}
    />
  );
}
