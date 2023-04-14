import { Outfit } from "@Classes/Outfit";
import PlannedOutfit from "@Components/Box/PlannedOutfit";
import DigiButton from "@Components/Button/DigiButton";
import Input from "@Components/Inputs/Input";
import WorkInProgress from "@Components/WIP";
import { getDatabase } from "@Database/database";
import { getOutfits } from "@Database/outfits";
import { OutfitOverview } from "@Models/Outfit";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { FlatList, View, Text, SafeAreaView, Button } from "react-native";

const fakeOutfits: Array<string> = [
  "Outfit 1",
  "Outfit 2",
  "Outfit 3",
  "Outfit 4",
  "Outfit 5",
  "Outfit 1",
  "Outfit 2",
  "Outfit 3",
  "Outfit 4",
  "Outfit 5",
];

interface ListHeaderComponentProps {
  onChange?: (value?: string) => void;
}
const ListHeaderComponent = ({ onChange }: ListHeaderComponentProps) => {
  const navigation = useNavigation();
  return (
    <View>
      <Input placeholder="Search outfit..." onChange={onChange} />
      <Button title="Create Outfit" onPress={() => navigation.navigate("NewOutfit" as never)} />
    </View>
  );
};

export default function Outfitter() {
  const isFocused = useIsFocused();
  const db = getDatabase();
  const [searchQuery, setSearchQuery] = useState<string | undefined>();
  const [outfits, setOutfits] = useState<Array<string>>([]);
  const [outfits2, setOutfits2] = useState<Array<OutfitOverview>>([]);

  useEffect(() => {
    db.transaction((tx) =>
      tx.executeSql("SELECT * FROM outfit_category_wardrobe", [], (t, res) => setOutfits(res.rows._array.map((i) => JSON.stringify(i))))
    );
    // db.transaction((tx) =>
    //   tx.executeSql("SELECT * FROM outfits", [], (t, res) => setOutfits2(res.rows._array.map((i) => JSON.stringify(i))))
    // );
    getOutfits(db, setOutfits2);
    // db.transaction((tx) => tx.executeSql("SELECT * FROM categories", [], (t, res) => console.log("categories ----", res.rows._array)));
    // db.transaction((tx) => tx.executeSql("SELECT * FROM fabrics", [], (t, res) => console.log("fabrics ----", res.rows._array)));
  }, [isFocused]);
  return (
    <SafeAreaView>
      <FlatList
        data={searchQuery ? outfits2.filter((outfit) => outfit.name?.toLowerCase().includes(searchQuery.toLowerCase())) : outfits2}
        renderItem={({ item }) => <PlannedOutfit label={item.name} outfitImage={item.imageURL} itemImages={item.itemImageURLs} />}
        contentContainerStyle={{ rowGap: 8, padding: 8 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<ListHeaderComponent onChange={setSearchQuery} />}
      />
    </SafeAreaView>
  );
}
