import OutfitBox from "@Components/Box/OutfitBox";
import Chip from "@Components/Chip/Chip";
import FilterBar from "@Components/FilterBar/FilterBar";
import { getDatabase, getTags } from "@Database/database";
import { getOutfits } from "@Database/outfits";
import { useGet } from "@Hooks/useGet";
import { useFocusEffect, useIsFocused, useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { FlatList, View, Text, SafeAreaView, StyleSheet, TouchableOpacity, RefreshControl } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Skeleton from "@Components/Skeleton/Skeleton";
import { Tag } from "@Models/Generic";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { BottomTabParamList, RootStackParamList } from "@Routes/Navigator.interface";

export default function Outfitter({ route }: NativeStackScreenProps<BottomTabParamList, "Outfitter">) {
  const isFocused = useIsFocused();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const db = getDatabase();
  const [activeFilter, setActiveFilter] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState<string | undefined>();
  const { data: outfits, isLoading: loadingOutfits, error, refetch: refetchOutfits } = useGet(getOutfits(db));
  const { data: tags, isLoading: loadingTags, error: tagsError, refetch: refetchTags } = useGet(getTags<Tag>(db));
  const [additionalFilterOpen, setAdditionalFilterOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const toggleAdditionalFilter = () => {
    setAdditionalFilterOpen((v) => !v);
  };

  const handleRefetch = () => {
    refetchOutfits();
    refetchTags();
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        navigation.setParams({ bookmarkFilter: false });
      };
    }, [navigation])
  );

  useEffect(() => {
    navigation.setOptions({
      headerLeft: ({ tintColor, pressOpacity }: any) => (
        <TouchableOpacity
          onPress={toggleAdditionalFilter}
          activeOpacity={pressOpacity}
          style={[
            { marginLeft: 14, padding: 4, paddingLeft: 5, justifyContent: "center", alignItems: "center" },
            additionalFilterOpen && { backgroundColor: "black", borderRadius: 8 },
          ]}
        >
          <Ionicons name="ios-filter" size={24} color={additionalFilterOpen ? "white" : tintColor} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, additionalFilterOpen]);

  useEffect(() => {
    // db.transaction((tx) =>
    //   tx.executeSql(`SELECT * from ${TableNames.OUTFIT_WARDROBE}`, [], (_, res) => console.log("Junc", res.rows._array))
    // );
    handleRefetch();
  }, [isFocused]);

  return (
    <SafeAreaView style={styles.container}>
      <FilterBar
        showAdditionalFilter
        isOpen={additionalFilterOpen}
        additionalFilterProps={{ outfitData: outfits, onSearchQuery: setSearchQuery }}
      >
        <Chip label="All" active={!activeFilter} onPress={() => setActiveFilter(undefined)} />
        {loadingTags
          ? Array.from({ length: 6 }).map((_, idx) => <Skeleton key={idx} variant="rounded" />)
          : tags?.map((tag) => (
              <Chip key={tag.id} label={tag.label} active={activeFilter === tag.label} onPress={() => setActiveFilter(tag.label)} />
            ))}
      </FilterBar>
      <FlatList
        onScroll={() => setAdditionalFilterOpen(false)}
        data={
          searchQuery
            ? outfits
                ?.filter((outfit) => outfit.name?.toLowerCase().includes(searchQuery.toLowerCase()))
                .filter((outfit) => (route.params?.bookmarkFilter ? outfit.isBookmarked() : outfit))
            : outfits?.filter((outfit) => (route.params?.bookmarkFilter ? outfit.isBookmarked() : outfit))
        }
        renderItem={({ item: outfit }) => (
          <OutfitBox label={outfit.name} outfitImage={outfit.imageURL} itemImages={outfit.getItemImagePreviews()} outfit={outfit} />
        )}
        contentContainerStyle={{ rowGap: 16, padding: 8 }}
        showsVerticalScrollIndicator={false}
        style={{ height: "100%" }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefetch} />}
        ListEmptyComponent={
          loadingOutfits ? (
            <View style={{ paddingHorizontal: 8, gap: 16 }}>
              {Array.from({ length: 3 }).map((_, idx) => (
                <Skeleton key={idx} variant="rounded" height={260} width={"100%"} />
              ))}
            </View>
          ) : (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
              }}
            >
              <Text style={{ fontSize: 16 }}>No clothing.</Text>
            </View>
          )
        }
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
