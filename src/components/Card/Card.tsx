import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "App";
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, TouchableHighlight } from "react-native";
import { Item } from "src/classes/Item";
import { Ionicons } from "@expo/vector-icons";
import { formatTimeAgo } from "@DigiUtils/helperFunctions";

interface CardProps {
  item: Item;
}

export default function Card({ item }: CardProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <TouchableHighlight
      activeOpacity={0.6}
      underlayColor="#e2e2e2"
      style={styles.container}
      onPress={() => navigation.navigate("ItemDetails", { item: item })}
    >
      <>
        <View style={[styles.image, !item.image && styles.border]}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={{ resizeMode: "cover", width: "100%", height: "100%" }} />
          ) : (
            <Image source={require("src/styles/img/noImg.jpg")} style={{ resizeMode: "cover", width: "100%", height: "100%" }} />
          )}
        </View>
        <View style={styles.textBox}>
          <Text style={{ fontSize: 18 }}>{item.name}</Text>
          <Text style={{ fontStyle: "italic" }}>{item.brand}</Text>
        </View>
        <TouchableOpacity onPress={() => console.log("TODO: Mark as favorite.")} style={styles.favorite}>
          <Ionicons name="heart-outline" size={28} color="black" />
        </TouchableOpacity>
      </>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1 / 2,
    height: 244,
    borderRadius: 32,
    backgroundColor: "white",
    overflow: "hidden",
    position: "relative",
    padding: 8,
  },
  image: {
    height: 180,
    width: "100%",
    borderRadius: 25,
    overflow: "hidden",
    elevation: 1,
  },
  textBox: {
    flex: 1,
    paddingTop: 8,
    alignItems: "center",
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
