import { View, Text } from "react-native";
import { FilterType } from "./FilterBottomSheetHeader";
import BottomSheetItem from "@Components/Modal/BottomSheetItem";
import { Dispatch } from "react";
import { GenericBottomSheetItem } from "@Models/Generic";
import { NamedBaseColors } from "@Styles/colors";
import { addOrRemoveToArray } from "@DigiUtils/helperFunctions";

export interface FilterDetailViewProps {
  filterType: FilterType;
  colors: {
    selectedColors: Array<string> | null;
    setSelectedColors: Dispatch<React.SetStateAction<string[] | null>>;
  };
  brands: {
    allBrands: Array<GenericBottomSheetItem>;
    selectedBrands: Array<string> | null;
    setSelectedBrands: Dispatch<React.SetStateAction<string[] | null>>;
  };
  fabrics: {
    allFabrics: Array<GenericBottomSheetItem>;
    selectedFabrics: Array<string> | null;
    setSelectedFabrics: Dispatch<React.SetStateAction<string[] | null>>;
  };
  stores: {
    allStores: Array<GenericBottomSheetItem>;
    selectedStores: Array<string> | null;
    setSelectedStores: Dispatch<React.SetStateAction<string[] | null>>;
  };
}

export default function FilterDetailView({ filterType, brands, colors, stores, fabrics }: FilterDetailViewProps) {
  const mappedColors: Array<GenericBottomSheetItem> = Object.entries(NamedBaseColors).map(([key, value]) => {
    return { id: key, label: key, hex: value };
  });

  if (filterType === "color") {
    return (
      <View>
        {mappedColors.map((color) => (
          <BottomSheetItem
            key={color.id}
            label={color.label}
            onPress={(value) => colors.setSelectedColors((prev) => addOrRemoveToArray(prev || [], value))}
            color={color.hex}
            selected={colors.selectedColors?.includes(color.label)}
          />
        ))}
      </View>
    );
  }
  if (filterType === "brand") {
    if (brands.allBrands.length === 0) {
      return <Text>No brands found.</Text>;
    }
    return (
      <View>
        {brands.allBrands.map((brand) => (
          <BottomSheetItem
            key={brand.id}
            label={brand.label}
            onPress={(value) => brands.setSelectedBrands((prev) => addOrRemoveToArray(prev || [], value))}
            selected={brands.selectedBrands?.includes(brand.label)}
          />
        ))}
      </View>
    );
  }
  if (filterType === "fabric") {
    if (fabrics.allFabrics.length === 0) {
      return <Text>No fabrics found.</Text>;
    }
    return (
      <View>
        {fabrics.allFabrics.map((fabric) => (
          <BottomSheetItem
            key={fabric.id}
            label={fabric.label}
            onPress={(value) => fabrics.setSelectedFabrics((prev) => addOrRemoveToArray(prev || [], value))}
            selected={fabrics.selectedFabrics?.includes(fabric.label)}
          />
        ))}
      </View>
    );
  }
  if (filterType === "store") {
    if (stores.allStores.length === 0) {
      return <Text>No stores found.</Text>;
    }
    return (
      <View>
        {stores.allStores.map((store) => (
          <BottomSheetItem
            key={store.id}
            label={store.label}
            onPress={(value) => stores.setSelectedStores((prev) => addOrRemoveToArray(prev || [], value))}
            selected={stores.selectedStores?.includes(store.label)}
          />
        ))}
      </View>
    );
  }

  return null;
}
