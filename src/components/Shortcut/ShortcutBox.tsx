import { View, StyleSheet, Dimensions } from "react-native";
import ShortcutItem from "./ShortcutItem";
import { SimpleLineIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function ShortcutBox() {
  const navigation = useNavigation();
  return (
    <View style={styles.shortcutBox}>
      <ShortcutItem
        label="New"
        icon={<SimpleLineIcons name="plus" size={24} color="black" />}
        onPress={() => navigation.navigate("NewItem" as never)}
      />
      <ShortcutItem
        label="Outfits"
        icon={<SimpleLineIcons name="badge" size={24} color="black" />}
        onPress={() => navigation.navigate("Outfits" as never)}
      />
      <ShortcutItem
        label="Favorites"
        icon={<SimpleLineIcons name="heart" size={24} color="black" />}
        onPress={() => navigation.navigate("Favorites" as never)}
      />
      <ShortcutItem
        label="Recent"
        icon={<SimpleLineIcons name="clock" size={24} color="black" />}
        onPress={() => navigation.navigate("Recent" as never)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  shortcutBox: {
    width: Dimensions.get("window").width - 32,
    elevation: 3,
    borderRadius: 8,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "space-evenly",
    height: 80,
    flexDirection: "row",
    paddingVertical: 8,
  },
});
