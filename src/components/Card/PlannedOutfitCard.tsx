import { StyleSheet, Text, View, Image, ScrollView, ImageBackground, FlatList, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Outfit } from "@Classes/Outfit";
import { Colors } from "@Styles/colors";
import DigiButton from "@Components/Button/DigiButton";
import { Ionicons } from "@expo/vector-icons";
import { ItemImagePreview } from "@Models/Outfit";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@Routes/Navigator.interface";

export interface PlannedOutfitCardProps {
  outfit: Outfit;
}

export default function PlannedOutfitCard({ outfit }: PlannedOutfitCardProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const images = outfit.imageURL
    ? [{ uuid: outfit.uuid, name: outfit.name, imageURL: outfit.imageURL } as ItemImagePreview].concat(outfit.getItemImagePreviews())
    : outfit.getItemImagePreviews();
  const [selectedImage, setSelectedImage] = useState<string | undefined>(outfit.imageURL);

  return (
    <View style={styles.wrapper}>
      <View style={{ padding: 4, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <TouchableOpacity
          onPress={() => navigation.navigate("OutfitDetails", { outfit: outfit })}
          style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8 }}
        >
          <Text style={{ fontSize: 20, fontWeight: "200" }}>{outfit.name}</Text>
          <Ionicons name="open-outline" size={20} color="black" />
        </TouchableOpacity>
        <DigiButton title="I wear it!" variant="outline" onPress={() => console.log("Set wear")} />
      </View>
      <View style={styles.plannedOutfitCard}>
        <Image source={{ uri: selectedImage }} style={{ resizeMode: "cover", width: "100%", height: "100%" }} />
      </View>
      <FlatList
        horizontal
        fadingEdgeLength={120}
        data={images}
        contentContainerStyle={{ gap: 8 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            key={item.uuid}
            style={styles.imageItemContainer}
            disabled={!item.imageURL}
            onPress={() => item.imageURL && setSelectedImage(item.imageURL)}
          >
            {item.imageURL ? (
              <Image source={{ uri: item.imageURL }} style={{ resizeMode: "cover", width: "100%", height: "100%" }} />
            ) : (
              <View style={{ padding: 4 }}>
                <Text>{item.name}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    gap: 8,
    backgroundColor: "#f8f8f8",
    borderRadius: 16,
    padding: 8,
  },
  plannedOutfitCard: {
    borderRadius: 16,
    height: 460,
    overflow: "hidden",
  },
  imageItemContainer: {
    height: 80,
    aspectRatio: 1 / 1,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
});
