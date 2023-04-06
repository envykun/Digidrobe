import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "App";
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from "react-native";
import { Item } from "src/classes/Item";

interface CardProps {
  item: Item;
}

export default function Card({ item }: CardProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <TouchableOpacity activeOpacity={0.6} style={styles.container} onPress={() => navigation.navigate("ItemDetails", { item: item })}>
      <>
        <View style={styles.image}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={{ resizeMode: "cover", width: "100%", height: "100%" }} />
          ) : (
            <Image
              source={require("src/styles/img/noImg.jpg")}
              style={{ resizeMode: "cover", width: "100%", height: "100%", marginTop: -40 }}
            />
          )}
        </View>
        <View style={styles.textBox}>
          <Text style={{ fontSize: 18 }}>{item.name}</Text>
          <Text>{item.brand}</Text>
          <Text>{item.wears}</Text>
        </View>
      </>
    </TouchableOpacity>
  );
}

const width = Dimensions.get("window").width - 40;

const styles = StyleSheet.create({
  container: {
    flex: 1 / 2,
    justifyContent: "center",
    alignItems: "center",
    height: 240,
    borderRadius: 8,
    elevation: 3,
    backgroundColor: "white",
    overflow: "hidden",
    position: "relative",
  },
  image: {
    height: "100%",
    width: "100%",
  },
  textBox: {
    position: "absolute",
    bottom: 10,
    // backgroundColor: "#E2C895",
    backgroundColor: "white",
    left: 5,
    right: 5,
    borderRadius: 4,
    padding: 4,
    opacity: 0.9,
  },
});
