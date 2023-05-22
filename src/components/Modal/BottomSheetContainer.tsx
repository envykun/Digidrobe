import BottomSheetContext, { BottomSheetContent } from "@Context/BottomSheetContext";
import { useCallback, useContext, useState } from "react";
import BottomSheet from "./BottomSheet";
import { getCategories, getDatabase, getFabrics } from "@Database/database";
import { useGet } from "@Hooks/useGet";
import { FlatList, Text, StyleSheet, View } from "react-native";
import BottomSheetItem from "./BottomSheetItem";
import { NamedColors } from "@Styles/colors";
import { GenericBottomSheetItem } from "@Models/Generic";

export function BottomSheetContainer() {
  const bottomSheet = useContext(BottomSheetContext);
  const db = getDatabase();
  const { data: categories } = useGet(getCategories<GenericBottomSheetItem>(db));
  const { data: fabrics } = useGet(getFabrics<GenericBottomSheetItem>(db));
  const mappedColors: Array<GenericBottomSheetItem> = Object.entries(NamedColors).map(([key, value]) => {
    return { id: key, label: key, hex: value };
  });
  const [searchQuery, setSearchQuery] = useState<string | undefined>();

  const handleCloseModal = () => {
    if (!bottomSheet) return;
    setSearchQuery(undefined);
    bottomSheet.resetBottomSheet();
  };

  console.log("Categories", categories);

  const handleData = (type?: BottomSheetContent, search?: string) => {
    let data;
    switch (type) {
      case "Categories":
        data = categories;
        break;
      case "Fabric":
        data = fabrics;
        break;
      case "Color":
        data = mappedColors;
        break;
      default:
        break;
    }
    data = data?.filter((i) => !bottomSheet?.selectedValues.includes(i.label));
    return search ? data?.filter((d) => d.label.toLowerCase().includes(search.toLowerCase())) : data;
  };

  const renderList = (type?: BottomSheetContent) => {
    if (!type || !bottomSheet) return null;
    const data = handleData(bottomSheet.contentType, searchQuery);
    return (
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <BottomSheetItem
            label={item.label}
            onPress={bottomSheet.onPress}
            selected={bottomSheet.selectedValues.includes(item.label)}
            color={item.hex}
          />
        )}
        ListEmptyComponent={<Text>Nothing left.</Text>}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
      />
    );
  };

  return (
    <BottomSheet
      title={bottomSheet?.title}
      isOpen={bottomSheet?.isOpen}
      showSearch={bottomSheet?.showSearch}
      searchCallback={setSearchQuery}
      closeModal={handleCloseModal}
    >
      {bottomSheet?.content}
      {renderList(bottomSheet?.contentType)}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  itemSeparator: {
    height: 1,
    backgroundColor: "#00000022",
    width: "100%",
    borderRadius: 12,
  },
});
