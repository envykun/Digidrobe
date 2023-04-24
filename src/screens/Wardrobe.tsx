import { StatusBar, Text, View, StyleSheet, SectionList, SafeAreaView, FlatList, RefreshControl } from "react-native";
import Chip from "@Components/Chip/Chip";
import Card from "@Components/Card/Card";
import FilterBar from "@Components/FilterBar/FilterBar";
import { useEffect, useRef, useState } from "react";
import * as Crypto from "expo-crypto";
import { getCategories, getDatabase, getWardrobeItems } from "src/database/database";
import { Item } from "src/classes/Item";
import { useIsFocused } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BottomTabParamList } from "App";
import { Category } from "@Models/Category";

export default function Wardrobe({ route }: NativeStackScreenProps<BottomTabParamList, "Wardrobe">) {
  const [activeFilter, setActiveFilter] = useState<string | undefined>();
  const [wardrobe, setWardrobe] = useState<Array<Item>>([]);
  const [categories, setCategories] = useState<Array<Category>>([]);
  const [refreshing, setRefreshing] = useState(false);
  const db = getDatabase();
  const flatListRef = useRef<FlatList<Item> | null>();
  const isFocused = useIsFocused();

  useEffect(() => {
    getWardrobeItems(db, setWardrobe);
    getCategories(db, setCategories);
    // db.transaction((tx) =>
    //   tx.executeSql("SELECT * FROM wardrobe_category", [], (t, res) => console.log("wardrobe_category ----", res.rows._array))
    // );
    db.transaction((tx) => tx.executeSql("SELECT * FROM categories", [], (t, res) => console.log("categories ----", res.rows._array)));
    // db.transaction((tx) => tx.executeSql("SELECT * FROM fabrics", [], (t, res) => console.log("fabrics ----", res.rows._array)));
  }, [isFocused]);

  useEffect(() => {
    const scrollIndex = route.params?.itemID ? Math.floor(wardrobe.findIndex((i) => i.uuid === route.params.itemID) / 2) : -1;
    scrollIndex !== -1 && flatListRef.current?.scrollToIndex({ animated: true, index: scrollIndex });
  }, [wardrobe]);

  return (
    <SafeAreaView style={styles.container}>
      <FilterBar>
        <Chip label="All" active={!activeFilter} onPress={() => setActiveFilter(undefined)} />
        {categories.map((item) => (
          <Chip key={item.id} label={item.label} active={activeFilter === item.label} onPress={() => setActiveFilter(item.label)} />
        ))}
      </FilterBar>
      <FlatList
        ref={(ref) => {
          flatListRef.current = ref;
        }}
        data={activeFilter ? wardrobe.filter((item) => item.category?.includes(activeFilter)) : wardrobe}
        numColumns={2}
        renderItem={({ item }) => <Card item={item} />}
        columnWrapperStyle={{ marginBottom: 8, paddingHorizontal: 16 }}
        style={{ height: "100%" }}
        getItemLayout={(data, index) => ({ length: 240, offset: 240 * index, index })}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              getWardrobeItems(db, setWardrobe);
            }}
          />
        }
        ListEmptyComponent={
          <View>
            <Text>EMPTY</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    rowGap: 8,
    backgroundColor: "white",
  },
  header: {
    fontSize: 32,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
  },
});
