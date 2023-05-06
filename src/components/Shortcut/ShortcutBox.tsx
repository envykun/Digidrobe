import { View, StyleSheet, Dimensions } from "react-native";
import ShortcutItem from "./ShortcutItem";
import { SimpleLineIcons, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "App";

export default function ShortcutBox() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <View style={styles.shortcutBox}>
      <ShortcutItem
        label="New"
        icon={<SimpleLineIcons name="plus" size={24} color="black" />}
        onPress={() => navigation.navigate("NewItem" as never)}
      />
      <ShortcutItem
        label="Favorites"
        icon={<SimpleLineIcons name="heart" size={24} color="black" />}
        onPress={() => navigation.navigate("Root", { screen: "Wardrobe", params: { favoriteFilter: true } })}
      />
      <ShortcutItem
        label="Outfits"
        icon={<Ionicons name="bookmark-outline" size={24} color="black" />}
        onPress={() => navigation.navigate("Root", { screen: "Outfitter", params: {} })}
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
