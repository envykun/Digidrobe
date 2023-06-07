import { useContext, useEffect, useState } from "react";
import BottomSheetFilter, { FilterSettings } from "@Components/BottomSheet/BottomSheetFilter";
import BottomSheetContext from "@Context/BottomSheetContext";
import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";
import { BottomTabParamList } from "@Routes/Navigator.interface";

export type FilterType = "Wardrobe" | "Outfit";

interface UseFilterProps<T> {
  data?: T;
  type?: FilterType;
}

export const useFilter = <T,>({ data, type }: UseFilterProps<T>) => {
  const route = useRoute<RouteProp<BottomTabParamList, any>>();
  const bottomSheet = useContext(BottomSheetContext);
  const initFilter: boolean = type === "Outfit" ? route.params?.bookmarkFilter : route.params?.favoriteFilter;
  const [filteredData, setFilteredData] = useState<T | undefined>(data);
  const [activeFilters, setActiveFilters] = useState<number>(0);

  useEffect(() => {
    if (!initFilter) return;
    const filteredTemp = type === "Wardrobe" ? (filterByFavorite(data) as T) : (filterByBookmark(data) as T);
    setFilteredData(filteredTemp);
    setActiveFilters(1);
  }, [initFilter]);

  const handleBottomSheet = () => {
    if (!bottomSheet) return;
    bottomSheet.setContent(<BottomSheetFilter onApply={handleFilter} initFavoriteFilter={initFilter} />);
    bottomSheet.setIsOpen((prev) => !prev);
  };

  const clearAllFilters = () => {
    setActiveFilters(0);
    setFilteredData(data);
  };

  // Favorite / Bookmarked
  const filterByFavorite = (data?: T) => {
    if (!Array.isArray(data)) return;
    return data.filter((item) => item.favorite);
  };
  const filterByBookmark = (data?: T) => {
    if (!Array.isArray(data)) return;
    return data.filter((item) => item.bookmarked);
  };

  // Color
  const filterByColor = (colors: Array<string>, data?: T) => {
    if (!Array.isArray(data)) return;
    return data.filter((item) => item.color?.some((c: string) => colors.indexOf(c) >= 0));
  };

  // Fabric
  const filterByFabric = (fabrics: Array<string>, data?: T) => {
    if (!Array.isArray(data)) return;
    return data.filter((item) => item.fabric?.some((c: string) => fabrics.indexOf(c) >= 0));
  };

  // Brand
  const filterByBrand = (brands: Array<string>, data?: T) => {
    if (!Array.isArray(data)) return;
    return data.filter((item) => brands.includes(item.brand));
  };

  // Purchased from
  const filterByStore = (stores: Array<string>, data?: T) => {
    if (!Array.isArray(data)) return;
    return data.filter((item) => stores.includes(item.boughtFrom));
  };

  // Wear count
  const filterByWearCountRange = (range: Array<number>, data?: T) => {
    if (!Array.isArray(data)) return;
    return data.filter((item) => range[0] <= item.wears && item.wears <= range[1]);
  };

  // Cost range
  const filterByCostRange = (range: Array<number>, data?: T) => {
    if (!Array.isArray(data)) return;
    return data.filter((item) => range[0] <= item.cost && item.cost <= range[1]);
  };

  // Last Worn range
  const filterLastWornRange = (range: Array<Date | undefined>, data?: T) => {
    if (!Array.isArray(data)) return;
    const from = range[0];
    const to = range[1];
    if (from && to) {
      return data.filter((item) => from && item.lastWorn >= from && to && item.lastWorn <= to);
    }
    return data.filter((item) => (from && item.lastWorn >= from) || (to && item.lastWorn <= to));
  };

  // Kaufdatum
  const filterByPurchaseDate = (range: Array<Date | undefined>, data?: T) => {
    if (!Array.isArray(data)) return;
    const from = range[0];
    const to = range[1];
    if (from && to) {
      return data.filter((item) => from && item.bought >= from && to && item.bought <= to);
    }
    return data.filter((item) => (from && item.bought >= from) || (to && item.bought <= to));
  };

  const handleFilter = (props: FilterSettings) => {
    const { favorite, colors, fabrics, brands, stores, wears, costs, lastWorn, boughtDate } = props;
    let filteredTemp = data;
    let appliedFiltersCount = 0;

    if (favorite) {
      filteredTemp = type === "Wardrobe" ? (filterByFavorite(filteredTemp) as T) : (filterByBookmark(filteredTemp) as T);
      appliedFiltersCount++;
    }
    if (colors.applied) {
      filteredTemp = filterByColor(colors.value, filteredTemp) as T;
      appliedFiltersCount++;
    }
    if (fabrics.applied) {
      filteredTemp = filterByFabric(fabrics.value, filteredTemp) as T;
      appliedFiltersCount++;
    }
    if (brands.applied) {
      filteredTemp = filterByBrand(brands.value, filteredTemp) as T;
      appliedFiltersCount++;
    }
    if (stores.applied) {
      filteredTemp = filterByStore(stores.value, filteredTemp) as T;
      appliedFiltersCount++;
    }
    if (costs.applied) {
      filteredTemp = filterByCostRange(costs.value, filteredTemp) as T;
      appliedFiltersCount++;
    }
    if (wears.applied) {
      filteredTemp = filterByWearCountRange(wears.value, filteredTemp) as T;
      appliedFiltersCount++;
    }
    if (lastWorn.applied) {
      filteredTemp = filterLastWornRange(lastWorn.value, filteredTemp) as T;
      appliedFiltersCount++;
    }
    if (boughtDate.applied) {
      filteredTemp = filterByPurchaseDate(boughtDate.value, filteredTemp) as T;
      appliedFiltersCount++;
    }

    setActiveFilters(appliedFiltersCount);

    setFilteredData(filteredTemp);
    bottomSheet?.resetBottomSheet();
  };

  return { filteredData: filteredData ?? data, activeFilters, handleBottomSheet, clearAllFilters };
};
