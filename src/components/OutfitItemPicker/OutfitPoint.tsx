import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import OutfitPointCard from "./OutfitPointCard";
import { Item } from "@Classes/Item";
import { SimpleLineIcons } from "@expo/vector-icons";
import { Colors } from "@Styles/colors";

interface OutfitPointProps {
  data?: Array<Item>;
  label?: string;
  onAdd?: () => void;
  onDelete?: (item: Item) => void;
  position: { top?: string | number; right?: string | number; bottom?: string | number; left?: string | number };
}

export default function OutfitPoint({ label, data, onAdd, onDelete, position }: OutfitPointProps) {
  const handleDelete = (item: Item) => {
    onDelete && onDelete(item);
  };
  return (
    <View style={[styles.imagePointOfInterest, { top: position.top, right: position.right, bottom: position.bottom, left: position.left }]}>
      {label && <Text>{label}</Text>}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
        {data?.map((item) => (
          <OutfitPointCard key={item.uuid} imageURL={item.getImage()} label={item.name} onPress={() => handleDelete(item)} />
        ))}
        <TouchableOpacity onPress={onAdd} style={styles.touchable}>
          <SimpleLineIcons name="plus" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  imagePointOfInterest: {
    position: "absolute",
    height: 80,
    maxWidth: 128,
  },
  touchable: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
