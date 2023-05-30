import { Colors } from "@Styles/colors";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { Dimensions, StyleSheet, Text } from "react-native";

export interface MultiSliderProps {
  minValue?: number;
  maxValue?: number;
  initMinValue?: number;
  initMaxValue?: number;
  onValueChange?: (values: Array<number>) => void;
}

export default function DigiMultiSlider({ minValue = 0, maxValue = 0, initMaxValue, initMinValue, onValueChange }: MultiSliderProps) {
  const width = Dimensions.get("screen").width - 68;
  return (
    <MultiSlider
      min={minValue}
      max={maxValue}
      //   enableLabel
      //   customLabel={(label) => <Text>{label.oneMarkerValue}</Text>}
      snapped
      step={1}
      sliderLength={width}
      values={[initMinValue ?? minValue, initMaxValue ?? maxValue]}
      onValuesChange={onValueChange}
      markerStyle={styles.knob}
      containerStyle={{}}
      selectedStyle={{
        backgroundColor: Colors.primary,
      }}
    />
  );
}

const styles = StyleSheet.create({
  slider: {
    width: "100%",
    height: 32,
    justifyContent: "center",
  },
  bar: {
    backgroundColor: "#dadada",
    height: 4,
    width: "100%",
    borderRadius: 8,
    position: "relative",
  },
  activeBar: {
    backgroundColor: Colors.primary,
  },
  knob: {
    width: 24,
    aspectRatio: 1 / 1,
    borderRadius: 120,
    backgroundColor: Colors.primary,
    transform: [{ scale: 1.5 }],
  },
});
