import { StatusBar, Text, View, StyleSheet, SectionList, SafeAreaView, FlatList, RefreshControl, TouchableOpacity } from "react-native";
import Chip from "@Components/Chip/Chip";
import Card from "@Components/Card/Card";
import FilterBar from "@Components/FilterBar/FilterBar";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { getCategories, getDatabase } from "src/database/database";
import { Item } from "src/classes/Item";
import { useFocusEffect, useIsFocused, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { useGet } from "@Hooks/useGet";
import { Ionicons } from "@expo/vector-icons";
import { getWardrobeItems, setItemAsFavorite } from "@Database/item";
import Skeleton from "@Components/Skeleton/Skeleton";
import { Category } from "@Models/Category";
import { BottomTabParamList, RootStackParamList } from "@Routes/Navigator.interface";

export default function Wardrobe({ route }: NativeStackScreenProps<BottomTabParamList, "Wardrobe">) {
  const isFocused = useIsFocused();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const db = getDatabase();
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string | undefined>();
  const [additionalFilterOpen, setAdditionalFilterOpen] = useState(false);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);
  const { data: wardrobe, isLoading: loadingWardrobe, error: wardrobeError, refetch: refetchWardrobe } = useGet(getWardrobeItems(db));
  const {
    data: categories,
    isLoading: loadingCategories,
    error: categoriesError,
    refetch: refetchCategories,
  } = useGet(getCategories<Category>(db));
  const [refreshing, setRefreshing] = useState(false);
  const refresh = useReducer((x) => x + 1, 0)[1];

  const flatListRef = useRef<FlatList<Item> | null>();
  const [sortedWardrobe, setSortedWardrobe] = useState(wardrobe);

  const toggleAdditionalFilter = () => {
    setAdditionalFilterOpen((v) => !v);
  };

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
          <Ionicons name="filter" size={24} color={additionalFilterOpen ? "white" : tintColor} />
          {!additionalFilterOpen && hasActiveFilters && (
            <View style={{ position: "absolute", width: 10, height: 10, backgroundColor: "red", borderRadius: 160, top: 0, right: -6 }} />
          )}
        </TouchableOpacity>
      ),
    });
  }, [navigation, additionalFilterOpen]);

  const handleRefetch = () => {
    refetchWardrobe();
    refetchCategories();
  };

  useEffect(() => {
    isFocused && handleRefetch();
  }, [isFocused]);

  useEffect(() => {
    if (!wardrobe || loadingWardrobe) return;
    if (!route.params?.itemID) return;
    const itemID = route.params.itemID;
    const scrollIndex = Math.floor(wardrobe.findIndex((i) => i.uuid === itemID) / 2);
    if (scrollIndex === -1) return;
    flatListRef.current?.scrollToIndex({
      animated: true,
      index: scrollIndex,
    });
    navigation.setParams({ itemID: undefined });
  }, [wardrobe, route, loadingWardrobe]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        navigation.setParams({ favoriteFilter: false });
        flatListRef.current?.scrollToOffset({ animated: false, offset: 0 });
      };
    }, [navigation, flatListRef.current])
  );

  return (
    <SafeAreaView style={styles.container}>
      <FilterBar
        showAdditionalFilter
        isOpen={additionalFilterOpen}
        additionalFilterProps={{
          data: wardrobe,
          dataCallback: setSortedWardrobe,
          type: "Wardrobe",
          hasFiltersActive: setHasActiveFilters,
        }}
      >
        <Chip label="All" active={!activeCategoryFilter} onPress={() => setActiveCategoryFilter(undefined)} />
        {loadingCategories
          ? Array.from({ length: 6 }).map((_, idx) => <Skeleton key={idx} variant="rounded" />)
          : categories?.map((item) => (
              <Chip
                key={item.id}
                label={item.label}
                active={activeCategoryFilter === item.label}
                onPress={() => setActiveCategoryFilter(item.label)}
              />
            ))}
      </FilterBar>
      <FlatList
        ref={(ref) => {
          flatListRef.current = ref;
        }}
        data={activeCategoryFilter ? sortedWardrobe?.filter((item) => item.category?.includes(activeCategoryFilter)) : sortedWardrobe}
        numColumns={2}
        renderItem={({ item }) => (
          <Card
            item={item}
            markAsFavoriteCallback={() => {
              item.toggleFavorite();
              setItemAsFavorite(db, item);
              refresh();
            }}
          />
        )}
        columnWrapperStyle={{ marginBottom: 8, paddingHorizontal: 16 }}
        style={{ height: "100%" }}
        getItemLayout={(data, index) => ({
          length: 240,
          offset: 240 * index,
          index,
        })}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefetch} />}
        ListEmptyComponent={
          loadingWardrobe || loadingCategories ? (
            <View
              style={{
                flex: 1,
                flexWrap: "wrap",
                flexDirection: "row",
                paddingHorizontal: 16,
                gap: 8,
              }}
            >
              {Array.from({ length: 6 }).map((_, idx) => (
                <Skeleton key={idx} variant="item" />
              ))}
            </View>
          ) : (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
                height: 80,
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
