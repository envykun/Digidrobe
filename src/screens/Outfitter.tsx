import PlannedOutfit from "@Components/Box/PlannedOutfit";
import Chip from "@Components/Chip/Chip";
import FilterBar from "@Components/FilterBar/FilterBar";
import Input from "@Components/Inputs/Input";
import { getDatabase } from "@Database/database";
import { getOutfitsAsync } from "@Database/outfits";
import { useGet } from "@Hooks/useGet";
import { OutfitOverview } from "@Models/Outfit";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { FlatList, View, Text, SafeAreaView, StyleSheet, TouchableOpacity, RefreshControl } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const fakeOutfits: Array<string> = [
  "Outfit 1",
  "Outfit 2",
  "Outfit 3",
  "Outfit 4",
  "Outfit 5",
  "Outfit 6",
  "Outfit 7",
  "Outfit 8",
  "Outfit 9",
  "Outfit 10",
];

interface ListHeaderComponentProps {
  onChange?: (value?: string) => void;
}
const ListHeaderComponent = ({ onChange }: ListHeaderComponentProps) => {
  return (
    <View style={{ gap: 8, backgroundColor: "yellow" }}>
      <View style={{ flexDirection: "row", height: 40 }}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "purple" }}>
          <Text>Sort By</Text>
        </View>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "aqua" }}>
          <Text>Filter By</Text>
        </View>
      </View>
      <Input placeholder="Search outfit..." onChange={onChange} />
    </View>
  );
};

export default function Outfitter() {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const db = getDatabase();
  const [searchQuery, setSearchQuery] = useState<string | undefined>();
  const { data: outfits, isLoading, error, refetch } = useGet(getOutfitsAsync(db));
  const [additionalFilterOpen, setAdditionalFilterOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const toggleAdditionalFilter = () => {
    setAdditionalFilterOpen((v) => !v);
  };

  useEffect(() => {
    navigation.setOptions({
      headerLeft: ({ tintColor, pressOpacity }: any) => (
        <TouchableOpacity onPress={toggleAdditionalFilter} activeOpacity={pressOpacity} style={{ marginLeft: 16 }}>
          <Ionicons name="ios-filter" size={24} color={tintColor} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  // useEffect(() => {
  //   refetch();
  // }, [isFocused]);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#E2C895", "transparent"]} style={{ alignItems: "center" }}>
        <FilterBar
          showAdditionalFilter={true}
          isOpen={additionalFilterOpen}
          onPress={() => setAdditionalFilterOpen(!additionalFilterOpen)}
          additionalChildren={<ListHeaderComponent onChange={setSearchQuery} />}
        >
          <Chip label="All" active={true} />
          {fakeOutfits.map((item) => (
            <Chip key={item} label={item} />
          ))}
        </FilterBar>
      </LinearGradient>
      <FlatList
        data={searchQuery ? outfits?.filter((outfit) => outfit.name?.toLowerCase().includes(searchQuery.toLowerCase())) : outfits}
        renderItem={({ item }) => <PlannedOutfit label={item.name} outfitImage={item.imageURL} itemImages={item.itemImageURLs} />}
        contentContainerStyle={{ rowGap: 8, padding: 8 }}
        showsVerticalScrollIndicator={false}
        style={{ height: "100%" }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refetch} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
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
