import FilterBottomSheetHeader, { FilterType } from "@Components/FilterBar/FilterBottomSheetHeader";
import FilterDetailView from "@Components/FilterBar/FilterDetailView";
import FilterList from "@Components/FilterBar/FilterList";
import { getDatabase } from "@Database/database";
import { getMaxCost, getMaxWearCount } from "@Database/item";
import { useGet } from "@Hooks/useGet";
import { useEffect, useRef, useState } from "react";
import { Dimensions, FlatList, ScrollView, View } from "react-native";

export interface BottomSheetFilterProps {
  onApply: any;
  initFavoriteFilter?: boolean;
}

export interface FilterSettings {
  favorite: boolean;
  colors: FilterSettingsValue<string>;
  fabrics: FilterSettingsValue<string>;
  brands: FilterSettingsValue<string>;
  stores: FilterSettingsValue<string>;
  wears: FilterSettingsValue<number>;
  costs: FilterSettingsValue<number>;
  lastWorn: FilterSettingsValue<Date | undefined>;
  boughtDate: FilterSettingsValue<Date | undefined>;
}

export type FilterSettingsValue<T> = {
  applied: boolean;
  value: Array<T>;
};

// INJECT current active filters back into bottomsheet

export default function BottomSheetFilter({ onApply, initFavoriteFilter }: BottomSheetFilterProps) {
  const [selectedColors, setSelectedColors] = useState<Array<string> | null>(null);
  const [selectedFabrics, setSelectedFabrics] = useState<Array<string> | null>(null);
  const [selectedBrands, setSelectedBrands] = useState<Array<string> | null>(null);
  const [selectedStores, setSelectedStores] = useState<Array<string> | null>(null);
  const [lastWornFrom, setLastWornFrom] = useState<Date | undefined>();
  const [lastWornTo, setLastWornTo] = useState<Date | undefined>();
  const [boughtFrom, setBoughtFrom] = useState<Date | undefined>();
  const [boughtTo, setBoughtTo] = useState<Date | undefined>();
  const [favorite, setFavorite] = useState<boolean>(initFavoriteFilter ?? false);

  const db = getDatabase();
  const { data: maxWearCount = 100 } = useGet(getMaxWearCount(db));
  const { data: maxCost = 100 } = useGet(getMaxCost(db));

  const [wearCountMin, setWearCountMin] = useState<number>(0);
  const [wearCountMax, setWearCountMax] = useState<number>(100);

  const [costCountMin, setCostCountMin] = useState<number>(0);
  const [costCountMax, setCostCountMax] = useState<number>(100);

  const [filterType, setFilterType] = useState<FilterType>(undefined);

  const scrollViewRef = useRef<ScrollView>(null);
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    maxWearCount && setWearCountMax(maxWearCount);
  }, [maxWearCount]);

  useEffect(() => {
    maxCost && setCostCountMax(maxCost);
  }, [maxCost]);

  const handleListItemPress = (type: FilterType) => {
    setFilterType(type);
    listRef.current?.scrollToEnd();
    scrollViewRef.current?.scrollTo({ y: 0 });
  };

  const handleGoBack = () => {
    scrollViewRef.current?.scrollTo({ y: 0 });
    listRef.current?.scrollToIndex({ index: 0 });
    setFilterType(undefined);
  };

  const handleApply = () => {
    const filterSettings: FilterSettings = {
      favorite: favorite,
      colors: { applied: Boolean(selectedColors), value: selectedColors ?? [] },
      fabrics: { applied: Boolean(selectedFabrics), value: selectedFabrics ?? [] },
      brands: { applied: Boolean(selectedBrands), value: selectedBrands ?? [] },
      stores: { applied: Boolean(selectedStores), value: selectedStores ?? [] },
      costs: { applied: costCountMin > 0 || costCountMax < maxCost, value: [costCountMin, costCountMax] },
      wears: { applied: wearCountMin > 0 || wearCountMax < maxWearCount, value: [wearCountMin, wearCountMax] },
      lastWorn: { applied: Boolean(lastWornFrom) || Boolean(lastWornTo), value: [lastWornFrom, lastWornTo] },
      boughtDate: { applied: Boolean(boughtFrom) || Boolean(boughtTo), value: [boughtFrom, boughtTo] },
    };
    return filterSettings;
  };

  const filters = [
    <FilterList
      favorite={favorite}
      toggleFavorite={() => setFavorite((prev) => !prev)}
      handleListItemPress={handleListItemPress}
      selectedBrands={selectedBrands}
      selectedColors={selectedColors}
      selectedFabrics={selectedFabrics}
      selectedStores={selectedStores}
      costSliderBounds={{ max: { costCountMax, setCostCountMax }, min: { costCountMin, setCostCountMin } }}
      wearSliderBounds={{ max: { wearCountMax, setWearCountMax }, min: { wearCountMin, setWearCountMin } }}
      lastWorn={{ from: { date: lastWornFrom, onChange: setLastWornFrom }, to: { date: lastWornTo, onChange: setLastWornTo } }}
      boughtDate={{ from: { date: boughtFrom, onChange: setBoughtFrom }, to: { date: boughtTo, onChange: setBoughtTo } }}
    />,
    <FilterDetailView
      filterType={filterType}
      colors={{ selectedColors, setSelectedColors }}
      brands={{ selectedBrands, setSelectedBrands }}
      fabrics={{ selectedFabrics, setSelectedFabrics }}
      stores={{ selectedStores, setSelectedStores }}
    />,
  ];

  return (
    <View>
      <FilterBottomSheetHeader filterType={filterType} handleGoBack={handleGoBack} onApply={() => onApply(handleApply())} />
      <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false} contentContainerStyle={{ width: "100%" }}>
        <FlatList
          ref={listRef}
          data={filters}
          renderItem={({ item }) => <View style={{ width: Dimensions.get("screen").width - 50 }}>{item}</View>}
          horizontal
          bounces={false}
          pagingEnabled
          scrollEnabled={false}
        />
      </ScrollView>
    </View>
  );
}
