import { Item } from "@Classes/Item";
import { Outfit } from "@Classes/Outfit";
import Input from "@Components/Inputs/Input";
import { SortFunctionKeys, sortFunctionsItems } from "@DigiUtils/sortFunctions";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DigiButton from "@Components/Button/DigiButton";
import BottomSheet from "@Components/Modal/BottomSheet";
import { Colors } from "@Styles/colors";

export interface AdditionalFilterProps {
  onSearchQuery?: (value?: string) => void;
  itemData?: Item[];
  outfitData?: Outfit[];
  dataCallback?: (data: any) => void;
}

export default function AdditionalFilter({
  onSearchQuery,
  itemData,
  dataCallback,
}: AdditionalFilterProps) {
  const [sortingFunction, setSortingFunction] =
    useState<SortFunctionKeys>("name");
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [filterBottomSheetOpen, setFilterBottomSheetOpen] = useState(false);
  const [reversed, setReversed] = useState(false);

  useEffect(() => {
    if (!dataCallback) return;
    if (itemData) {
      const sortFunc = sortFunctionsItems[sortingFunction];
      const sortedData = sortFunc(itemData);
      reversed
        ? dataCallback([...sortedData.reverse()])
        : dataCallback([...sortedData]);
    }
  }, [sortingFunction, dataCallback, itemData, reversed]);

  const handleSortFunctionSelection = (item: string) => {
    setSortingFunction(item as SortFunctionKeys);
    setBottomSheetOpen(false);
  };

  return (
    <>
      <View style={{ gap: 8, paddingHorizontal: 8 }}>
        <View style={{ flexDirection: "row", height: 40 }}>
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              alignItems: "center",
              flexDirection: "row-reverse",
              gap: 16,
            }}
          >
            <TouchableOpacity onPress={() => setReversed((r) => !r)}>
              <Ionicons
                name={
                  reversed
                    ? "arrow-up-circle-outline"
                    : "arrow-down-circle-outline"
                }
                size={28}
              />
            </TouchableOpacity>
            <DigiButton
              title={`Sort By: ${sortingFunction}`}
              variant="contained"
              onPress={() => setBottomSheetOpen(true)}
            />
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "flex-end",
            }}
          >
            <DigiButton
              variant="outline"
              title="Filter"
              onPress={() => setFilterBottomSheetOpen(true)}
              icon={
                <Ionicons
                  name="filter-outline"
                  size={16}
                  style={{ marginRight: 8 }}
                />
              }
            />
          </View>
        </View>
        <View style={{ height: 40 }}>
          <Input placeholder="Search outfit..." onChange={onSearchQuery} />
        </View>
      </View>
      <BottomSheet
        isOpen={bottomSheetOpen}
        closeModal={() => setBottomSheetOpen(false)}
      >
        <FlatList
          data={Object.keys(sortFunctionsItems)}
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
                <Ionicons
                  name="ios-checkmark"
                  color={Colors.primary}
                  size={18}
                  style={{ position: "absolute", right: "10%" }}
                />
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
      </BottomSheet>
      <BottomSheet
        isOpen={filterBottomSheetOpen}
        closeModal={() => setFilterBottomSheetOpen(false)}
      >
        <FlatList
          data={Object.keys(sortFunctionsItems)}
          renderItem={({ item }) => (
            <TouchableOpacity
              //   onPress={() => handleSortFunctionSelection(item)}
              style={{
                flex: 1,
                height: 48,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 16 }}>{item}</Text>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => (
            <View style={{ borderBottomWidth: 1 }} />
          )}
        />
      </BottomSheet>
    </>
  );
}