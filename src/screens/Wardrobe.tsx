import { StatusBar, Text, View, StyleSheet, SectionList, SafeAreaView, FlatList, RefreshControl, TouchableOpacity } from "react-native";
import Chip from "@Components/Chip/Chip";
import Card from "@Components/Card/Card";
import FilterBar from "@Components/FilterBar/FilterBar";
import { useCallback, useEffect, useRef, useState } from "react";
import { getCategories, getDatabase } from "src/database/database";
import { Item } from "src/classes/Item";
import { useFocusEffect, useIsFocused, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { BottomTabParamList, RootStackParamList } from "App";
import { useGet } from "@Hooks/useGet";
import { Ionicons } from "@expo/vector-icons";
import { getWardrobeItems, setItemAsFavorite } from "@Database/item";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@Styles/colors";

export default function Wardrobe({ route }: NativeStackScreenProps<BottomTabParamList, "Wardrobe">) {
  const db = getDatabase();
  const [activeFilter, setActiveFilter] = useState<string | undefined>();
  const [refreshing, setRefreshing] = useState(false);
  const { data: wardrobe, isLoading: loadingWardrobe, error: wardrobeError, refetch: refetchWardrobe } = useGet(getWardrobeItems(db));
  const { data: categories, isLoading: loadingCategories, error: categoriesError, refetch: refetchCategories } = useGet(getCategories(db));
  const flatListRef = useRef<FlatList<Item> | null>();
  // const isFocused = useIsFocused();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [additionalFilterOpen, setAdditionalFilterOpen] = useState(false);

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

  const handleRefetch = useCallback(() => {
    refetchWardrobe();
    refetchCategories();
  }, [refetchCategories, refetchWardrobe]);

  useEffect(() => {
    if (!wardrobe) return;
    const scrollIndex = route.params?.itemID ? Math.floor(wardrobe.findIndex((i) => i.uuid === route.params.itemID) / 2) : -1;
    scrollIndex !== -1 &&
      flatListRef.current?.scrollToIndex({
        animated: true,
        index: scrollIndex,
      });
  }, [wardrobe]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        navigation.setParams({ itemID: undefined, favoriteFilter: false });
      };
    }, [route])
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={[Colors.primary, "transparent"]} style={{ alignItems: "center" }}>
        <FilterBar showAdditionalFilter isOpen={additionalFilterOpen}>
          <Chip label="All" active={!activeFilter} onPress={() => setActiveFilter(undefined)} />
          {categories?.map((item) => (
            <Chip key={item.id} label={item.label} active={activeFilter === item.label} onPress={() => setActiveFilter(item.label)} />
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
                ?.filter((item) => (route.params.favoriteFilter ? item.isFavorite() : item))
                .filter((item) => item.category?.includes(activeFilter))
            : wardrobe?.filter((item) => (route.params.favoriteFilter ? item.isFavorite() : item))
        }
        numColumns={2}
        renderItem={({ item }) => (
          <Card
            item={item}
            markAsFavoriteCallback={() => {
              item.toggleFavorite(() => setItemAsFavorite(db, item));
              handleRefetch();
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
