import { StatusBar, Text, View, StyleSheet, SectionList, SafeAreaView, FlatList } from "react-native";
import Chip from "@Components/Chip/Chip";
import Card from "@Components/Card/Card";
import FilterBar from "@Components/FilterBar/FilterBar";
import { useState } from "react";
import * as Crypto from "expo-crypto";

const data = [
  { title: "Nike 1", category: ["Pants", "Jackets"] },
  { title: "Nike 2", category: ["Skirts", "Jackets"] },
  { title: "Nike 3", category: ["Pants", "Tops"] },
  { title: "Adidas 1", category: ["Pants", "Jackets"] },
  { title: "Adidas 2", category: ["Pants", "Jackets"] },
  { title: "Adidas 3", category: ["Skirts", "Jackets"] },
  { title: "Puma 3", category: ["Pants", "Jackets"] },
];

export default function Wardrobe() {
  const [activeFilter, setActiveFilter] = useState<string | undefined>();
  const categories = [...new Set(data.flatMap((item) => item.category))];
  return (
    <SafeAreaView style={styles.container}>
      <FilterBar>
        <Chip label="All" active={!activeFilter} onPress={() => setActiveFilter(undefined)} />
        {categories.map((item) => (
          <Chip key={Crypto.randomUUID()} label={item} active={activeFilter === item} onPress={() => setActiveFilter(item)} />
        ))}
      </FilterBar>
      <FlatList
        data={activeFilter ? data.filter((item) => item.category.includes(activeFilter)) : data}
        numColumns={2}
        renderItem={({ item }) => <Card title={item.title} />}
        columnWrapperStyle={{ gap: 8, marginBottom: 8, paddingHorizontal: 8 }}
        style={{ height: "100%" }}
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
