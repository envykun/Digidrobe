import { Item } from "@Classes/Item";
import { Outfit } from "@Classes/Outfit";
import Input from "@Components/Inputs/Input";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DigiButton from "@Components/Button/DigiButton";
import { FilterType, useFilter } from "@Hooks/useFilter";
import { useSearch } from "@Hooks/useSearch";
import { useSort } from "@Hooks/useSort";

export interface AdditionalFilterProps {
  data?: Item[] | Outfit[];
  dataCallback?: (data: any) => void;
  type?: FilterType;
  hasFiltersActive?: (value: boolean) => void;
}

export default function AdditionalFilter({ data, dataCallback, type, hasFiltersActive }: AdditionalFilterProps) {
  const { searchedData, onSearchQuery, searchQuery } = useSearch<Item[] | Outfit[]>({ data });
  const {
    filteredData,
    activeFilters,
    handleBottomSheet: handleFilter,
    clearAllFilters,
  } = useFilter<Item[] | Outfit[]>({
    data: searchedData,
    type: type,
  });
  const { sortedData, handleBottomSheet: handleSort, reversed, setReversed, sortingType } = useSort<Item | Outfit>({ data: filteredData });

  useEffect(() => {
    if (!dataCallback) return;
    if (data) {
      dataCallback(sortedData);
    }
    hasFiltersActive && hasFiltersActive(Boolean(activeFilters) || Boolean(searchQuery));
  }, [dataCallback, data, filteredData, searchedData, sortedData, activeFilters]);

  return (
    <View style={{ gap: 8, paddingHorizontal: 8 }}>
      <View style={{ flexDirection: "row", height: 40 }}>
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            alignItems: "center",
            flexDirection: "row-reverse",
            gap: 12,
          }}
        >
          <TouchableOpacity onPress={() => setReversed((r) => !r)}>
            <Ionicons name={reversed ? "arrow-up-circle-outline" : "arrow-down-circle-outline"} size={28} />
          </TouchableOpacity>
          <DigiButton title={`Sort By: ${sortingType}`} variant="contained" onPress={handleSort} />
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            alignItems: "center",
            flexDirection: "row",
            gap: 12,
          }}
        >
          <DigiButton
            variant="outline"
            title="Filter"
            onPress={handleFilter}
            icon={<Ionicons name="filter-outline" size={16} style={{ marginRight: 8 }} />}
            badge={activeFilters}
          />
          {Boolean(activeFilters) && (
            <TouchableOpacity>
              <Ionicons name="ios-close-circle-outline" size={28} onPress={clearAllFilters} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={{ height: 40 }}>
        <Input placeholder={`Search ...`} onChange={onSearchQuery} clearButton />
      </View>
    </View>
  );
}
