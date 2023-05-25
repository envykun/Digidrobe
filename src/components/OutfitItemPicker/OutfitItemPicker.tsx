import { View, Image, StyleSheet, Dimensions } from "react-native";
import OutfitPoint from "./OutfitPoint";
import { Outfit } from "@Classes/Outfit";
import { BaseCategory } from "@Database/constants";

export interface OutfitItemPickerProps {
  outfit: Outfit;
  onPress: (baseCategory: BaseCategory) => void;
}

export default function OutfitItemPicker({ outfit, onPress }: OutfitItemPickerProps) {
  const { width, height } = Dimensions.get("window");
  const containerHeight = height * 0.8;
  const paddingTop = 128;
  const paddingBottom = 128;
  const positions = {
    Head: { top: paddingTop, left: "60%", right: 0 },
    UpperBody: { top: paddingTop + 60, left: "20%", right: 0 },
    LowerBody: { top: "80%", left: "65%", right: 0 },
    Accessoirs: { bottom: "40%", left: "5%", right: 0 },
    Feet: { bottom: "28%", left: "60%", right: 0 },
    NoCategory: { bottom: "5%", left: "5%", right: 0 },
  };

  return (
    <View style={styles({ paddingBottom: paddingBottom, paddingTop: paddingTop, height: containerHeight }).container}>
      <Image source={require("@Styles/img/WomenSilhouette.png")} style={{ resizeMode: "contain", width: "100%", height: "100%" }} />
      <OutfitPoint
        data={outfit.getItemsByCategory(1)}
        label={"Headpiece"}
        position={positions.Head}
        onAdd={() => onPress(1)}
        onDelete={(item) => outfit.removeItemFromCategory(1, item)}
      />
      <OutfitPoint
        data={outfit.getItemsByCategory(2)}
        label={"Upper body"}
        position={positions.UpperBody}
        onAdd={() => onPress(2)}
        onDelete={(item) => outfit.removeItemFromCategory(2, item)}
      />
      <OutfitPoint
        data={outfit.getItemsByCategory(3)}
        label={"Lower body"}
        position={positions.LowerBody}
        onAdd={() => onPress(3)}
        onDelete={(item) => outfit.removeItemFromCategory(3, item)}
      />
      <OutfitPoint
        data={outfit.getItemsByCategory(5)}
        label={"Accessoir"}
        position={positions.Accessoirs}
        onAdd={() => onPress(5)}
        onDelete={(item) => outfit.removeItemFromCategory(5, item)}
      />
      <OutfitPoint
        data={outfit.getItemsByCategory(4)}
        label={"Feet"}
        position={positions.Feet}
        onAdd={() => onPress(4)}
        onDelete={(item) => outfit.removeItemFromCategory(4, item)}
      />
      <OutfitPoint
        data={outfit.getItemsByCategory(0)}
        label={"NoCategory"}
        position={positions.NoCategory}
        onAdd={() => onPress(0)}
        onDelete={(item) => outfit.removeItemFromCategory(0, item)}
      />
    </View>
  );
}

const styles = (props: { paddingTop: number; paddingBottom: number; height: number }) =>
  StyleSheet.create({
    container: {
      position: "relative",
      backgroundColor: "#f1f1f1",
      height: props.height,
      paddingBottom: props.paddingBottom,
      paddingTop: props.paddingTop,
    },
    sheetButton: {
      height: 80,
    },
  });
