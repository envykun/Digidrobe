import OutfitBox from "@Components/Box/OutfitBox";
import Skeleton from "@Components/Skeleton/Skeleton";
import { getDatabase } from "@Database/database";
import { getPlannedOutfits } from "@Database/outfits";
import { useGet } from "@Hooks/useGet";
import { layout } from "@Styles/global";
import { SafeAreaView, ScrollView, Text } from "react-native";

export default function Recent() {
  const db = getDatabase();
  const { data: plannedOutfits, isLoading } = useGet(getPlannedOutfits(db));
  return (
    <SafeAreaView>
      <ScrollView style={layout.scrollContainer} showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 8, gap: 8 }}>
        {isLoading && Array.from({ length: 3 }).map((_, idx) => <Skeleton key={idx} variant="rounded" height={260} width={"100%"} />)}
        {plannedOutfits?.map((outfit) => (
          <OutfitBox
            key={outfit.uuid}
            label={outfit.name}
            outfitImage={outfit.imageURL}
            itemImages={outfit.getItemImagePreviews()}
            outfit={outfit}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
