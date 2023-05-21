import BottomSheetContext, { BottomSheetContent } from "@Context/BottomSheetContext";
import { useContext, useState } from "react";
import BottomSheet from "./BottomSheet";
import { getCategories, getDatabase, getFabrics } from "@Database/database";
import { useGet } from "@Hooks/useGet";
import { FlatList, Text, StyleSheet, View } from "react-native";
import BottomSheetItem from "./BottomSheetItem";

export function BottomSheetContainer() {
  const bottomSheet = useContext(BottomSheetContext);
  const db = getDatabase();
  const { data: categories } = useGet(getCategories(db));
  const { data: fabrics } = useGet(getFabrics(db));
  const [searchQuery, setSearchQuery] = useState<string | undefined>();

  const handleCloseModal = () => {
    if (!bottomSheet) return;
    bottomSheet.resetBottomSheet();
  };

  const handleData = (type?: BottomSheetContent) => {
    let data;
    switch (type) {
      case "Categories":
        data = categories;
        break;
      case "Fabric":
        data = fabrics;
        break;
      default:
        break;
    }
    data = data?.filter((i) => !bottomSheet?.selectedValues.includes(i.label));
    return searchQuery ? data?.filter((d) => d.label.includes(searchQuery)) : data;
  };

  const renderList = (type?: BottomSheetContent) => {
    if (!type || !bottomSheet) return null;
    return (
      <FlatList
        data={handleData(bottomSheet.contentType)}
        renderItem={({ item }) => (
          <BottomSheetItem label={item.label} onPress={bottomSheet.onPress} selected={bottomSheet.selectedValues.includes(item.label)} />
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
