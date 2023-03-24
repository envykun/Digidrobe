import { useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from "react-native";

interface CardProps {
  title: string;
}

export default function Card({ title }: CardProps) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={styles.container}
      onPress={() => navigation.navigate("Modal" as never, { title: title } as never)}
    >
      <>
        <View style={styles.image}>
          <Image
            source={{ uri: `https://picsum.photos/480?random=${Math.random()}` }}
            style={{ resizeMode: "cover", width: "100%", height: "100%" }}
          />
        </View>
        <View style={styles.textBox}>
          <Text style={{ fontSize: 18 }}>{title}</Text>
          <Text>{title}</Text>
          <Text>Wears 5</Text>
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
