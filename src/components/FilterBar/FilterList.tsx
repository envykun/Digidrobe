import { View, Text, StyleSheet } from "react-native";
import FilterItem from "./FilterItem";
import { FilterType } from "./FilterBottomSheetHeader";
import ColorBubble from "@Components/Bubble/ColorBubble";
import { i18n } from "@Database/i18n/i18n";
import { utils } from "@Styles/global";
import DigiMultiSlider from "@Components/Slider/MultiSlider";
import DateTimePickerInput from "@Components/Inputs/DateTimePickerInput";

export interface FilterListProps {
  handleListItemPress: (type: FilterType) => void;
  selectedColors: Array<string> | null;
  selectedBrands: Array<string> | null;
  selectedFabrics: Array<string> | null;
  selectedStores: Array<string> | null;
  wearSliderBounds: {
    max: { wearCountMax: number; setWearCountMax: (value: number) => void };
    min: {
      wearCountMin: number;
      setWearCountMin: (value: number) => void;
    };
  };
  costSliderBounds: {
    max: { costCountMax: number; setCostCountMax: (value: number) => void };
    min: { costCountMin: number; setCostCountMin: (value: number) => void };
  };
  lastWorn: { from: { date?: Date; onChange?: (value?: Date) => void }; to: { date?: Date; onChange?: (value?: Date) => void } };
  boughtDate: { from: { date?: Date; onChange?: (value?: Date) => void }; to: { date?: Date; onChange?: (value?: Date) => void } };
}

export default function FilterList({
  handleListItemPress,
  selectedBrands,
  selectedColors,
  selectedFabrics,
  selectedStores,
  wearSliderBounds,
  costSliderBounds,
  lastWorn,
  boughtDate,
}: FilterListProps) {
  const dividerPadding = 0;

  return (
    <View style={{}}>
      <View style={utils(dividerPadding).divider} />
      <FilterItem label={i18n.t("item.color")} onPress={() => handleListItemPress("color")}>
        {selectedColors?.map((value) => (
          <ColorBubble key={value} color={value} size={20} />
        ))}
      </FilterItem>
      <View style={utils(dividerPadding).divider} />
      <FilterItem label={i18n.t("item.brand")} selectedValues={selectedBrands?.join(", ")} onPress={() => handleListItemPress("brand")} />
      <View style={utils(dividerPadding).divider} />
      <FilterItem
        label={i18n.t("item.fabric")}
        selectedValues={selectedFabrics?.join(", ")}
        onPress={() => handleListItemPress("fabric")}
      />
      <View style={utils(dividerPadding).divider} />
      <FilterItem label={i18n.t("item.store")} selectedValues={selectedStores?.join(", ")} onPress={() => handleListItemPress("store")} />

      <View style={utils(dividerPadding).divider} />
      <View style={styles.filterItem}>
        <Text numberOfLines={1} style={styles.headline}>
          {i18n.t("item.wears")}
        </Text>
        <DigiMultiSlider
          minValue={0}
          maxValue={wearSliderBounds.max.wearCountMax}
          initMinValue={wearSliderBounds.min.wearCountMin}
          initMaxValue={wearSliderBounds.max.wearCountMax}
          onValueChange={(values) => {
            wearSliderBounds.min.setWearCountMin(values[0]);
            wearSliderBounds.max.setWearCountMax(values[1]);
          }}
        />
        <View style={styles.sliderInfo}>
          <Text>{wearSliderBounds.min.wearCountMin}x</Text>
          <Text>{wearSliderBounds.max.wearCountMax}x</Text>
        </View>
      </View>
      <View style={utils(dividerPadding).divider} />
      <View style={styles.filterItem}>
        <Text numberOfLines={1} style={styles.headline}>
          {i18n.t("item.cost")}
        </Text>
        <DigiMultiSlider
          minValue={0}
          maxValue={costSliderBounds.max.costCountMax}
          initMinValue={costSliderBounds.min.costCountMin}
          initMaxValue={costSliderBounds.max.costCountMax}
          onValueChange={(values) => {
            costSliderBounds.min.setCostCountMin(values[0]);
            costSliderBounds.max.setCostCountMax(values[1]);
          }}
        />
        <View style={styles.sliderInfo}>
          <Text>{costSliderBounds.min.costCountMin}€</Text>
          <Text>{costSliderBounds.max.costCountMax}€</Text>
        </View>
      </View>
      <View style={utils(dividerPadding).divider} />
      <View style={styles.filterItem}>
        <Text numberOfLines={1} style={styles.headline}>
          {i18n.t("item.lastWorn")}
        </Text>
        <View style={styles.dateRange}>
          <View>
            <Text style={{ fontWeight: "100" }}>{i18n.t("date.from")}</Text>
            <DateTimePickerInput text={!lastWorn.from.date ? i18n.t("date.any") : undefined} onChange={lastWorn.from.onChange} />
          </View>
          <Text>-</Text>
          <View>
            <Text style={{ fontWeight: "100" }}>{i18n.t("date.to")}</Text>
            <DateTimePickerInput text={!lastWorn.to.date ? i18n.t("date.today") : undefined} onChange={lastWorn.to.onChange} />
          </View>
        </View>
      </View>
      <View style={utils(dividerPadding).divider} />
      <View style={styles.filterItem}>
        <Text numberOfLines={1} style={styles.headline}>
          {i18n.t("item.bought")}
        </Text>
        <View style={styles.dateRange}>
          <View>
            <Text style={{ fontWeight: "100" }}>{i18n.t("date.from")}</Text>
            <DateTimePickerInput text={!boughtDate.from.date ? i18n.t("date.any") : undefined} onChange={boughtDate.from.onChange} />
          </View>
          <Text>-</Text>
          <View>
            <Text style={{ fontWeight: "100" }}>{i18n.t("date.to")}</Text>
            <DateTimePickerInput text={!boughtDate.to.date ? i18n.t("date.today") : undefined} onChange={boughtDate.to.onChange} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  filterItem: {
    paddingVertical: 16,
    gap: 16,
    alignItems: "center",
  },
  headline: {
    fontSize: 18,
    fontWeight: "100",
    alignSelf: "flex-start",
  },
  sliderInput: {
    flexDirection: "row",
    gap: 32,
  },
  sliderInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 4,
  },
  dateRange: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 4,
  },
});
