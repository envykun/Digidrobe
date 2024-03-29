import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import { Item } from "src/classes/Item";
import DetailInput from "@Components/Inputs/DetailInput";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useContext } from "react";
import { getDatabase } from "src/database/database";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@Routes/Navigator.interface";
import { randomUUID } from "expo-crypto";
import Input from "@Components/Inputs/Input";
import SnackbarContext from "@Context/SnackbarContext";
import { createItem } from "@Database/item";
import { ScrollContainer } from "@DigiUtils/ScrollContainer";
import ImageContainer from "@Components/Box/ImageContainer";

export default function NewItem() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const newItem = useRef<Item>(new Item({ uuid: randomUUID(), baseCategory: 0 })).current;

  const db = getDatabase();
  const snack = useContext(SnackbarContext);

  useEffect(() => {
    navigation.setOptions({
      headerRight: ({ tintColor }: any) => (
        <TouchableOpacity onPress={handleCreate}>
          <Ionicons name="checkmark-circle-outline" size={32} color={tintColor} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleCreate = () => {
    createItem(db, newItem).then(() => {
      if (!snack) return;
      snack.setIsOpen(true);
      snack.setMessage("Item successfully created.");
    });
    navigation.navigate("Root", {
      screen: "Wardrobe",
      params: { itemID: newItem.uuid },
    });
  };

  return (
    <SafeAreaView>
      <ScrollContainer hideTitle disableRefresh>
        <ImageContainer setImageCallback={(uri) => newItem.setImage(uri)} />
        <View style={styles.description}>
          <Text style={{ fontSize: 24 }}>Name</Text>
          <Input
            onChange={(text) => {
              if (!text) return;
              newItem.name = text;
            }}
          />
        </View>
        {newItem
          .getConstructorKeys()
          .filter((item) => item.editable)
          .map((item) => (
            <DetailInput
              key={item.key}
              label={item.label}
              inputProps={{
                onChange: item.setter,
                textInputProps: { keyboardType: item.keyboardType },
              }}
              type={item.inputType}
            />
          ))}
        <View style={{ height: 80 }} />
      </ScrollContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    marginBottom: 32,
    height: "100%",
    gap: 8,
    elevation: 3,
  },
  description: {
    backgroundColor: "white",
    marginVertical: 32,
    marginTop: -32,
    paddingHorizontal: 8,
    paddingTop: 48,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    columnGap: 16,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  sheetButton: {
    height: 80,
  },
});
