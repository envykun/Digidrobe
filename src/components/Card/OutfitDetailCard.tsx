import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "App";
import { View, Text, StyleSheet, Image, TouchableHighlight } from "react-native";
import { ItemImagePreview } from "@Models/Outfit";
import { useGet } from "@Hooks/useGet";
import { getWardrobeItemsById } from "@Database/item";
import { getDatabase } from "@Database/database";
import Detail from "@Components/Detail/Detail";

interface OutfitDetailCardProps {
  item: ItemImagePreview;
}

export default function OutfitDetailCard({ item }: OutfitDetailCardProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const db = getDatabase();
  const { data } = useGet(getWardrobeItemsById(db, item.uuid));
  const dbItem = data && data[0];
  return (
    <TouchableHighlight
      activeOpacity={0.6}
      underlayColor="#e2e2e2"
      style={styles.container}
      onPress={() => dbItem && navigation.navigate("ItemDetails", { item: dbItem })}
    >
      <View style={styles.innerContainer}>
        <View style={[styles.image, !item.imageURL && styles.border]}>
          {item.imageURL ? (
            <Image source={{ uri: item.imageURL }} style={{ resizeMode: "cover", width: "100%", height: "100%" }} />
          ) : (
            <Image source={require("src/styles/img/noImg.jpg")} style={{ resizeMode: "cover", width: "100%", height: "100%" }} />
          )}
        </View>
        <View style={styles.textBox}>
          <Text style={{ fontSize: 18, alignSelf: "center", marginBottom: 8 }}>{item.name}</Text>
          <Detail label="Brand" value={dbItem?.brand} />
          <Detail label="Model" value={dbItem?.model} />
          <Detail label="Size" value={dbItem?.size} />
          <Detail label="Wears" value={dbItem?.wears} suffix="x" />
        </View>
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 32,
    backgroundColor: "white",
    overflow: "hidden",
    position: "relative",
    padding: 8,
  },
  innerContainer: {
    flex: 1,
    flexDirection: "row",
  },
  image: {
    flex: 1,
    height: 180,
    borderRadius: 25,
    overflow: "hidden",
    elevation: 1,
  },
  textBox: {
    flex: 1,
    paddingTop: 8,
  },
  favorite: {
    position: "absolute",
    top: 16,
    right: 16,
  },
  border: {
    borderWidth: 1,
    borderColor: "#f0f0f0",
    elevation: 0,
  },
});
