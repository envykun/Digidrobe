import BottomSheetContext, {
  BottomSheetContent,
} from "@Context/BottomSheetContext";
import { useCallback, useContext, useEffect, useState } from "react";
import BottomSheet from "./BottomSheet";
import {
  getCategories,
  getDatabase,
  getFabrics,
  getTags,
} from "@Database/database";
import { useGet } from "@Hooks/useGet";
import { FlatList, Text, StyleSheet, View } from "react-native";
import BottomSheetItem from "./BottomSheetItem";
import { NamedBaseColors } from "@Styles/colors";
import { GenericBottomSheetItem } from "@Models/Generic";
import { BaseCategories } from "@Database/constants";

export function BottomSheetContainer() {
  const bottomSheet = useContext(BottomSheetContext);
  const db = getDatabase();
  const { data: categories, refetch: refetchCategories } = useGet(
    getCategories<GenericBottomSheetItem>(db)
  );
  const { data: fabrics, refetch: refetchFabrics } = useGet(
    getFabrics<GenericBottomSheetItem>(db)
  );
  const { data: tags, refetch: refetchTags } = useGet(
    getTags<GenericBottomSheetItem>(db)
  );

  const mappedColors: Array<GenericBottomSheetItem> = Object.entries(
    NamedBaseColors
  ).map(([key, value]) => {
    return { id: key, label: key, hex: value };
  });
  const mappedBaseCategories: Array<GenericBottomSheetItem> = Object.entries(
    BaseCategories
  ).map(([key, value]) => {
    return { id: key, label: value };
  });

  const [searchQuery, setSearchQuery] = useState<string | undefined>();

  useEffect(() => {
    bottomSheet?.isOpen && handleRefetch();
  }, [bottomSheet?.isOpen]);

  const handleRefetch = () => {
    refetchCategories();
    refetchFabrics();
    refetchTags();
  };

  const handleCloseModal = () => {
    if (!bottomSheet) return;
    setSearchQuery(undefined);
    bottomSheet.resetBottomSheet();
  };

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
      case "Tags":
        data = tags;
        break;
      case "BaseCategories":
        data = mappedBaseCategories;
        break;
      default:
        break;
    }

    data = data?.filter(
      (i) => !bottomSheet?.selectedValues.some((value) => value.id === i.id)
    );
    data = search
      ? data?.filter((d) =>
          d.label.toLowerCase().includes(search.toLowerCase())
        )
      : data;
    data =
      type !== "Color" && search
        ? data?.concat({ id: search, label: search })
        : data;

    return data;
  };

  const handleBySearch = (item: GenericBottomSheetItem): void => {
    bottomSheet?.onPress && bottomSheet?.onPress(item);
    handleCloseModal();
  };

  const renderList = (type?: BottomSheetContent) => {
    if (!type || !bottomSheet) return null;
    const data = handleData(bottomSheet.contentType, searchQuery);
    console.log("DATA in Bottomsheet", data);
    return (
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <BottomSheetItem
            id={item.id}
            label={item.label}
            onPress={
              item.label === searchQuery ? handleBySearch : bottomSheet.onPress
            }
            selected={bottomSheet.selectedValues.some(
              (value) => value.id === item.id
            )}
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
