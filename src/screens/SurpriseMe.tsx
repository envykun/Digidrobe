import { getDatabase } from "@Database/database";
import { getWardrobeItems } from "@Database/item";
import { getPlannedOutfits } from "@Database/outfits";
import { useGet } from "@Hooks/useGet";
import { layout } from "@Styles/global";
import { useEffect, useReducer, useRef } from "react";
import { SafeAreaView, ScrollView, Image, View, Text } from "react-native";
import { randomUUID } from "expo-crypto";
import { Outfit } from "@Classes/Outfit";
import DigiButton from "@Components/Button/DigiButton";

export default function Recent() {
  const refresh = useReducer((x) => x + 1, 0)[1];
  const db = getDatabase();
  const { data: wardrobe, isLoading: loadingWardrobe, error: wardrobeError, refetch: refetchWardrobe } = useGet(getWardrobeItems(db));
  const newOutfit = useRef<Outfit>(new Outfit({ uuid: randomUUID(), refresh: refresh })).current;
  useEffect(() => console.log("DATA", wardrobe), [wardrobe]);

  const renderItems = () => (
    <View>
      {newOutfit.getAllItems().map((item) => (
        <View style={{ width: 90, height: 90 }}>
          <Image source={{ uri: item.getImage() }} style={{ resizeMode: "cover", width: "100%", height: "100%" }} />
          <Text>{item.getImage()}</Text>
        </View>
      ))}
    </View>
  );

  if (loadingWardrobe || !wardrobe) return;

  return (
    <SafeAreaView>
      <ScrollView style={layout.scrollContainer} showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 8, gap: 8 }}>
        {renderItems()}
        <DigiButton title="Surprise me!" variant="text" onPress={() => newOutfit.generateRandomOutfit(wardrobe)} />
      </ScrollView>
    </SafeAreaView>
  );
}
