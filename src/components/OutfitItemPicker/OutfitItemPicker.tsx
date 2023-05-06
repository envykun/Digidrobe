import { View, Image, StyleSheet, Dimensions } from "react-native";
import OutfitPoint from "./OutfitPoint";
import { Outfit } from "@Classes/Outfit";
import { OutfitCategoryType } from "src/screens/NewOutfit";

export interface OutfitItemPickerProps {
  outfit: Outfit;
  onPress: (category: OutfitCategoryType) => void;
}

export default function OutfitItemPicker({ outfit, onPress }: OutfitItemPickerProps) {
  const { width, height } = Dimensions.get("window");
  const containerHeight = height * 0.8;
  const paddingTop = 128;
  const paddingBottom = 128;
  const relHeight = containerHeight - paddingBottom - paddingTop;
  // TODO: Calculate positions
  const positions = {
    Head: { top: 0, left: 0 },
    UpperBody: { top: 0, left: 0 },
    LowerBody: { top: 0, left: 0 },
    Accessoirs: { top: 0, left: 0 },
    Feet: { top: 0, left: 0 },
    NoCategory: { top: 0, left: 0 },
  };

  return (
    <View style={styles({ paddingBottom: paddingBottom, paddingTop: paddingTop, height: containerHeight }).container}>
      <Image source={require("@Styles/img/WomenSilhouette.png")} style={{ resizeMode: "contain", width: "100%", height: "100%" }} />
      <OutfitPoint
        data={outfit.getItemsByCategory("Head")}
        label={"Headpiece"}
        position={{ top: 22, left: 210 }}
        onAdd={() => onPress("Head")}
        onDelete={(item) => outfit.removeItemFromCategory("Head", item)}
      />
      <OutfitPoint
        data={outfit.getItemsByCategory("UpperBody")}
        label={"Upper body"}
        position={{ top: 92, left: 110 }}
        onAdd={() => onPress("UpperBody")}
        onDelete={(item) => outfit.removeItemFromCategory("UpperBody", item)}
      />
      <OutfitPoint
        data={outfit.getItemsByCategory("LowerBody")}
        label={"Lower body"}
        position={{ bottom: 230, left: 230 }}
        onAdd={() => onPress("LowerBody")}
        onDelete={(item) => outfit.removeItemFromCategory("LowerBody", item)}
      />
      <OutfitPoint
        data={outfit.getItemsByCategory("Accessoirs")}
        label={"Accessoir"}
        position={{ bottom: 180, right: 260 }}
        onAdd={() => onPress("Accessoirs")}
        onDelete={(item) => outfit.removeItemFromCategory("Accessoirs", item)}
      />
      <OutfitPoint
        data={outfit.getItemsByCategory("Feet")}
        label={"Feet"}
        position={{ bottom: 90, left: 220 }}
        onAdd={() => onPress("Feet")}
        onDelete={(item) => outfit.removeItemFromCategory("Feet", item)}
      />
      <OutfitPoint
        data={outfit.getItemsByCategory("NoCategory")}
        label={"NoCategory"}
        position={{ bottom: 20, left: 30 }}
        onAdd={() => onPress("NoCategory")}
        onDelete={(item) => outfit.removeItemFromCategory("NoCategory", item)}
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
  });
