import { Text, View, StyleSheet, Image, SafeAreaView, ScrollView } from "react-native";
import { layout } from "@Styles/global";
import { Item } from "src/classes/Item";
import DetailInput from "@Components/Inputs/DetailInput";
import Input from "@Components/Inputs/Input";
import ShortcutItem from "@Components/Shortcut/ShortcutItem";
import { SimpleLineIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function NewItem() {
  const newItem = new Item({ name: "" });
  const navigation = useNavigation();

  return (
    <SafeAreaView>
      <ScrollView style={layout.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.image}>
          {false ? (
            <Image source={{ uri: "https://picsum.photos/480" }} style={{ resizeMode: "cover", width: "100%", height: "100%" }} />
          ) : (
            <View style={styles.noImage}>
              <ShortcutItem
                label="Add Image"
                icon={<SimpleLineIcons name="plus" size={48} color="#E2C895" />}
                onPress={() => navigation.navigate("Camera" as never)}
              />
            </View>
          )}
        </View>
        <View style={styles.content}>
          <View style={styles.description}>
            <Text style={{ fontSize: 24 }}>Name</Text>
            <Input
              onChange={(text) => {
                newItem.name = text;
              }}
            />
          </View>
          <View style={styles.details}>
            {newItem.getConstructorKeys().map((prop) => (
              <View key={prop.key} style={{ flex: 1 }}>
                <DetailInput label={prop.label} inputProps={{ onChange: prop.setter }} />
              </View>
            ))}
          </View>
          <View style={{ marginVertical: 64, alignItems: "center" }}>
            <Text style={{ color: "#E2C895" }} onPress={() => console.log("Item Updated", newItem)}>
              Save Item
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 320,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  noImage: {
    height: 80,
  },
  content: {
    marginBottom: 32,
    height: "100%",
    gap: 8,
    elevation: 3,
  },
  description: {
    marginTop: 16,
    paddingHorizontal: 16,
    marginVertical: 8,
    flexDirection: "row",
    columnGap: 16,
    alignItems: "center",
  },
  descriptionInner: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 8,
  },
  details: {
    flexDirection: "column",
    padding: 8,
  },
});
