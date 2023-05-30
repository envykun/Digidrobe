import { View } from "react-native";
import { FilterType } from "./FilterBottomSheetHeader";
import BottomSheetItem from "@Components/Modal/BottomSheetItem";
import Chip from "@Components/Chip/Chip";
import { Dispatch } from "react";
import { GenericBottomSheetItem } from "@Models/Generic";
import { NamedColor, NamedColors } from "@Styles/colors";

export interface FilterDetailViewProps {
  filterType: FilterType;
  colors: {
    selectedColors: Array<string> | null;
    setSelectedColors: Dispatch<React.SetStateAction<string[] | null>>;
  };
  brands: {
    selectedBrands: Array<string> | null;
    setSelectedBrands: Dispatch<React.SetStateAction<string[] | null>>;
  };
  fabrics: {
    selectedFabrics: Array<string> | null;
    setSelectedFabrics: Dispatch<React.SetStateAction<string[] | null>>;
  };
  stores: {
    selectedStores: Array<string> | null;
    setSelectedStores: Dispatch<React.SetStateAction<string[] | null>>;
  };
}

export default function FilterDetailView({ filterType, brands, colors, stores, fabrics }: FilterDetailViewProps) {
  const mappedColors: Array<GenericBottomSheetItem> = Object.entries(NamedColors).map(([key, value]) => {
    return { id: key, label: key, hex: value };
  });

  if (filterType === "color") {
    return (
      <View>
        {colors.selectedColors?.map((value) => (
          <Chip key={value} label={value} colorBubble={NamedColors[value as NamedColor]} />
        ))}
        {mappedColors
          .filter((color) => !colors.selectedColors?.includes(color.id))
          .map((color) => (
            <BottomSheetItem
              key={color.id}
              label={color.label}
              onPress={(value) => colors.setSelectedColors((prev) => [...(prev || []), value])}
              color={color.hex}
            />
          ))}
      </View>
    );
  }
  if (filterType === "brand") {
    return (
      <View>
        {["S.Oliver", "Adidas", "Gucci"].map((brand) => (
          <BottomSheetItem key={brand} label={brand} onPress={(value) => brands.setSelectedBrands((prev) => [...(prev || []), value])} />
        ))}
      </View>
    );
  }
  if (filterType === "fabric") {
    return (
      <View>
        {["Stoff", "Nylon", "Baumwolle"].map((fabric) => (
          <BottomSheetItem
            key={fabric}
            label={fabric}
            onPress={(value) => fabrics.setSelectedFabrics((prev) => [...(prev || []), value])}
          />
        ))}
      </View>
    );
  }
  if (filterType === "store") {
    return (
      <View>
        {["Amazon", "Adidas Outlet", "Gucci Shop Berlin"].map((store) => (
          <BottomSheetItem key={store} label={store} onPress={(value) => stores.setSelectedStores((prev) => [...(prev || []), value])} />
        ))}
      </View>
    );
  }

  return null;
}
