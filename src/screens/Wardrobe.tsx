import {
  StatusBar,
  Text,
  View,
  StyleSheet,
  SectionList,
  SafeAreaView,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import Chip from "@Components/Chip/Chip";
import Card from "@Components/Card/Card";
import FilterBar from "@Components/FilterBar/FilterBar";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { getCategories, getDatabase } from "src/database/database";
import { Item } from "src/classes/Item";
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { BottomTabParamList, RootStackParamList } from "App";
import { useGet } from "@Hooks/useGet";
import { Ionicons } from "@expo/vector-icons";
import { getWardrobeItems, setItemAsFavorite } from "@Database/item";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@Styles/colors";
import Skeleton from "@Components/Skeleton/Skeleton";

export default function Wardrobe({
  route,
}: NativeStackScreenProps<BottomTabParamList, "Wardrobe">) {
  const db = getDatabase();
  const [activeFilter, setActiveFilter] = useState<string | undefined>();
  const [refreshing, setRefreshing] = useState(false);
  const {
    data: wardrobe,
    isLoading: loadingWardrobe,
    error: wardrobeError,
    refetch: refetchWardrobe,
  } = useGet(getWardrobeItems(db));
  const {
    data: categories,
    isLoading: loadingCategories,
    error: categoriesError,
    refetch: refetchCategories,
  } = useGet(getCategories(db));
  const flatListRef = useRef<FlatList<Item> | null>();
  const isFocused = useIsFocused();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [additionalFilterOpen, setAdditionalFilterOpen] = useState(false);
  const refresh = useReducer((x) => x + 1, 0)[1];

  const toggleAdditionalFilter = () => {
    setAdditionalFilterOpen((v) => !v);
  };

  useEffect(() => {
    navigation.setOptions({
      headerLeft: ({ tintColor, pressOpacity }: any) => (
        <TouchableOpacity
          onPress={toggleAdditionalFilter}
          activeOpacity={pressOpacity}
          style={{ marginLeft: 16 }}
        >
          <Ionicons name="ios-filter" size={24} color={tintColor} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleRefetch = () => {
    refetchWardrobe();
    refetchCategories();
  };

  useEffect(() => {
    isFocused && handleRefetch();
  }, [isFocused]);

  useEffect(() => {
    if (!wardrobe) return;
    if (!route.params?.itemID) return;
    const itemID = route.params.itemID;
    const scrollIndex = Math.floor(
      wardrobe.findIndex((i) => i.uuid === itemID) / 2
    );
    if (scrollIndex === -1) return;
    flatListRef.current?.scrollToIndex({
      animated: true,
      index: scrollIndex,
    });
    navigation.setParams({ itemID: undefined });
  }, [wardrobe, route]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        navigation.setParams({ favoriteFilter: false });
        flatListRef.current?.scrollToOffset({ animated: false, offset: 0 });
      };
    }, [navigation, flatListRef.current])
  );
  console.log("Loading Wardrobe", loadingWardrobe);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[Colors.primary, "transparent"]}
        style={{ alignItems: "center" }}
      >
        <FilterBar showAdditionalFilter isOpen={additionalFilterOpen}>
          <Chip
            label="All"
            active={!activeFilter}
            onPress={() => setActiveFilter(undefined)}
          />
          {loadingCategories
            ? Array.from({ length: 6 }).map((_, idx) => (
                <Skeleton key={idx} variant="rounded" />
              ))
            : categories?.map((item) => (
                <Chip
                  key={item.id}
                  label={item.label}
                  active={activeFilter === item.label}
                  onPress={() => setActiveFilter(item.label)}
                />
              ))}
        </FilterBar>
      </LinearGradient>
      <FlatList
        ref={(ref) => {
          flatListRef.current = ref;
        }}
        data={
          activeFilter
            ? wardrobe
                ?.filter((item) =>
                  route.params?.favoriteFilter ? item.isFavorite() : item
                )
                .filter((item) => item.category?.includes(activeFilter))
            : wardrobe?.filter((item) =>
                route.params?.favoriteFilter ? item.isFavorite() : item
              )
        }
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefetch} />
        }
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
