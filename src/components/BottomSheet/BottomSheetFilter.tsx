import FilterBottomSheetHeader, { FilterType } from "@Components/FilterBar/FilterBottomSheetHeader";
import FilterDetailView from "@Components/FilterBar/FilterDetailView";
import FilterList from "@Components/FilterBar/FilterList";
import { getBrands, getDatabase, getFabrics, getStores } from "@Database/database";
import { getMaxCost, getMaxWearCount } from "@Database/item";
import { useGet } from "@Hooks/useGet";
import { GenericBottomSheetItem } from "@Models/Generic";
import { useEffect, useRef, useState } from "react";
import { Dimensions, FlatList, ScrollView, View } from "react-native";

export interface BottomSheetFilterProps {
  onApply: any;
  initFavoriteFilter?: boolean;
  initFilter: FilterSettings | null;
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

export default function BottomSheetFilter({ onApply, initFavoriteFilter, initFilter }: BottomSheetFilterProps) {
  const [selectedColors, setSelectedColors] = useState<Array<string> | null>(initFilter?.colors.applied ? initFilter.colors.value : null);
  const [selectedFabrics, setSelectedFabrics] = useState<Array<string> | null>(
    initFilter?.fabrics.applied ? initFilter.fabrics.value : null
  );
  const [selectedBrands, setSelectedBrands] = useState<Array<string> | null>(initFilter?.brands.applied ? initFilter.brands.value : null);
  const [selectedStores, setSelectedStores] = useState<Array<string> | null>(initFilter?.stores.applied ? initFilter.stores.value : null);
  const [lastWornFrom, setLastWornFrom] = useState<Date | undefined>(
    initFilter?.lastWorn.applied ? initFilter.lastWorn.value[0] : undefined
  );
  const [lastWornTo, setLastWornTo] = useState<Date | undefined>(initFilter?.lastWorn.applied ? initFilter.lastWorn.value[1] : undefined);
  const [boughtFrom, setBoughtFrom] = useState<Date | undefined>(
    initFilter?.boughtDate.applied ? initFilter.boughtDate.value[0] : undefined
  );
  const [boughtTo, setBoughtTo] = useState<Date | undefined>(initFilter?.boughtDate.applied ? initFilter.boughtDate.value[1] : undefined);
  const [favorite, setFavorite] = useState<boolean>(initFavoriteFilter ?? false);

  const db = getDatabase();
  const { data: maxWearCount = 100 } = useGet(getMaxWearCount(db));
  const { data: maxCost = 100 } = useGet(getMaxCost(db));
  const { data: allBrands = [] } = useGet<Array<GenericBottomSheetItem>>(getBrands(db));
  const { data: allFabrics = [] } = useGet<Array<GenericBottomSheetItem>>(getFabrics(db));
  const { data: allStores = [] } = useGet<Array<GenericBottomSheetItem>>(getStores(db));

  const [wearCountMin, setWearCountMin] = useState<number>(initFilter?.wears.applied ? initFilter.wears.value[0] : 0);
  const [wearCountMax, setWearCountMax] = useState<number>(initFilter?.wears.applied ? initFilter.wears.value[1] : 100);

  const [costCountMin, setCostCountMin] = useState<number>(initFilter?.costs.applied ? initFilter.costs.value[0] : 0);
  const [costCountMax, setCostCountMax] = useState<number>(initFilter?.costs.applied ? initFilter.costs.value[1] : 100);

  const [filterType, setFilterType] = useState<FilterType>(undefined);

  const scrollViewRef = useRef<ScrollView>(null);
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    !initFilter?.wears.applied && maxWearCount && setWearCountMax(maxWearCount);
  }, [maxWearCount]);

  useEffect(() => {
    !initFilter?.costs.applied && maxCost && setCostCountMax(maxCost);
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
      costSliderBounds={{ max: { costCountMax, setCostCountMax, maxValue: maxCost }, min: { costCountMin, setCostCountMin, minValue: 0 } }}
      wearSliderBounds={{
        max: { wearCountMax, setWearCountMax, maxValue: maxWearCount },
        min: { wearCountMin, setWearCountMin, minValue: 0 },
      }}
      lastWorn={{ from: { date: lastWornFrom, onChange: setLastWornFrom }, to: { date: lastWornTo, onChange: setLastWornTo } }}
      boughtDate={{ from: { date: boughtFrom, onChange: setBoughtFrom }, to: { date: boughtTo, onChange: setBoughtTo } }}
    />,
    <FilterDetailView
      filterType={filterType}
      colors={{ selectedColors, setSelectedColors }}
      brands={{ allBrands, selectedBrands, setSelectedBrands }}
      fabrics={{ allFabrics, selectedFabrics, setSelectedFabrics }}
      stores={{ allStores, selectedStores, setSelectedStores }}
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
