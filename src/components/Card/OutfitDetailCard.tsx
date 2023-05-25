import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "App";
import { View, Text, StyleSheet, Image, TouchableHighlight } from "react-native";
import Detail from "@Components/Detail/Detail";
import { Item } from "@Classes/Item";

interface OutfitDetailCardProps {
  item: Item;
}

export default function OutfitDetailCard({ item }: OutfitDetailCardProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <TouchableHighlight
      activeOpacity={0.6}
      underlayColor="#e2e2e2"
      style={styles.container}
      onPress={() => navigation.navigate("ItemDetails", { item: item })}
    >
      <View style={styles.innerContainer}>
        <View style={[styles.image, !item.image && styles.border]}>
          {item.getImage() ? (
            <Image source={{ uri: item.getImage() }} style={{ resizeMode: "cover", width: "100%", height: "100%" }} />
          ) : (
            <Image source={require("src/styles/img/noImg.jpg")} style={{ resizeMode: "cover", width: "100%", height: "100%" }} />
          )}
        </View>
        <View style={styles.textBox}>
          <Text style={{ fontSize: 18, alignSelf: "center", marginBottom: 8 }}>{item.name}</Text>
          <Detail label="Brand" value={item.brand} />
          <Detail label="Model" value={item.model} />
          <Detail label="Size" value={item.size} />
          <Detail label="Wears" value={item.wears} suffix="x" />
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
