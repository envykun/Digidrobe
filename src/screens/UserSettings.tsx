import { layout, utils } from "@Styles/global";
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableHighlight, View } from "react-native";
import {
  deleteDatabase,
  dropOutfits,
  getDatabase,
  initializeTestData,
  wipeDatabase,
  wipeOutfits,
  wipePlannedOutfits,
} from "@Database/database";
import { useEffect, useState } from "react";
import Constants from "expo-constants";
import { useAsyncStorage } from "@Hooks/useAsyncStorage";
import EditableDetail from "@Components/Detail/EditableDetail";
import DetailInput from "@Components/Inputs/DetailInput";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "App";
import DigiButton from "@Components/Button/DigiButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SettingsItem from "@Components/List/SettingsItem";
import Input from "@Components/Inputs/Input";
import { Ionicons } from "@expo/vector-icons";
import { i18n } from "@Database/i18n/i18n";
import CountryFlag from "react-native-country-flag";
import ColorBubble from "@Components/Bubble/ColorBubble";

const settings = ["ToS/PrivacyPolicy", "FAQ", "Support", "Feedback", "Notifications", "DB Access (Your data, your choice)"];

export default function UserSettings() {
  const db = getDatabase();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [showDatabaseButtons, setShowDatabaseButtons] = useState<boolean>(false);
  const [editName, setEditName] = useState<boolean>(false);
  const [editLanguage, setEditLanguage] = useState<boolean>(false);
  const { data, isLoading, updateSettingsValue, refetch } = useAsyncStorage();

  const toggleQuote = () => {
    updateSettingsValue("quoteDisabled", !data?.quoteDisabled), refetch();
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: ({ tintColor }: any) => <ActivityIndicator animating={isLoading} color={tintColor} />,
    });
  }, [navigation, isLoading]);

  return (
    <SafeAreaView>
      <ScrollView style={layout.scrollContainer} contentContainerStyle={{ paddingHorizontal: 0 }} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <SettingsItem label="Name" value={data?.name} onPress={() => setEditName((prev) => !prev)}>
            {editName && (
              <Input
                textInputProps={{
                  autoFocus: true,
                  defaultValue: data?.name,
                  onSubmitEditing: (event) => {
                    setEditName(false);
                    updateSettingsValue("name", event.nativeEvent.text);
                    refetch();
                  },
                  onEndEditing: () => setEditName(false),
                }}
              />
            )}
          </SettingsItem>
          <SettingsItem label="Language" value={data?.locale}>
            <View style={{ gap: 8 }}>
              <DigiButton
                title="Deutsch"
                variant="outline"
                onPress={() => (i18n.locale = "de_DE")}
                icon={<CountryFlag isoCode="de" size={18} />}
              />
              <DigiButton
                title="English"
                variant="outline"
                onPress={() => (i18n.locale = "en_US")}
                icon={<CountryFlag isoCode="us" size={18} />}
              />
            </View>
          </SettingsItem>
          <SettingsItem label="Disable quote of the day?" onPress={toggleQuote}>
            <Switch value={data?.quoteDisabled ?? false} onValueChange={toggleQuote} />
          </SettingsItem>
          <SettingsItem label="Accentcolor" value={data?.accentColor}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <ColorBubble color={data?.accentColor ?? "black"} size={24} />
              <Text style={{ fontSize: 18, fontWeight: "200", color: data?.accentColor }}>{data?.accentColor}</Text>
            </View>
          </SettingsItem>
          <View style={utils(16).divider} />
          {settings.map((setting) => (
            <SettingsItem key={setting} label={setting} onPress={() => console.log("Navigate to", setting)}>
              <Ionicons name="ios-chevron-forward" size={18} color="black" />
            </SettingsItem>
          ))}
          <View style={utils(16).divider} />
          <View style={styles.reset}>
            <DigiButton
              title="Reset settings"
              variant="text"
              onPress={async () => {
                await AsyncStorage.removeItem("@settings");
                navigation.goBack();
              }}
            />
          </View>
        </View>
        <View style={utils(16).divider} />
        <View style={styles.brand}>
          <Text style={{ fontSize: 24 }}>Digidrobe</Text>
          <Text>Version {Constants.expoConfig?.version}</Text>
        </View>
        <View style={utils(16).divider} />
        <View style={styles.reset}>
          <DigiButton title="Show DB Buttons" variant="text" onPress={() => setShowDatabaseButtons((prev) => !prev)} />
        </View>
        {showDatabaseButtons && (
          <View>
            <TouchableHighlight
              onPress={() => wipeDatabase(db)}
              style={{
                padding: 12,
                borderWidth: 1,
                backgroundColor: "orange",
                justifyContent: "center",
                alignItems: "center",
                margin: 12,
                borderRadius: 4,
              }}
            >
              <Text style={{ fontSize: 16, color: "white" }}>WIPE DATABASE</Text>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={() => deleteDatabase(db)}
              style={{
                padding: 12,
                borderWidth: 1,
                backgroundColor: "red",
                justifyContent: "center",
                alignItems: "center",
                margin: 12,
                borderRadius: 4,
              }}
            >
              <Text style={{ fontSize: 16, color: "white" }}>DELETE DATABASE</Text>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={() => initializeTestData(db)}
              style={{
                padding: 12,
                borderWidth: 1,
                backgroundColor: "green",
                justifyContent: "center",
                alignItems: "center",
                margin: 12,
                borderRadius: 4,
              }}
            >
              <Text style={{ fontSize: 16, color: "white" }}>INIT TESTDATA</Text>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={() => wipeOutfits(db)}
              style={{
                padding: 12,
                borderWidth: 1,
                backgroundColor: "green",
                justifyContent: "center",
                alignItems: "center",
                margin: 12,
                borderRadius: 4,
              }}
            >
              <Text style={{ fontSize: 16, color: "white" }}>WIPE OUTFITS</Text>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={() => dropOutfits(db)}
              style={{
                padding: 12,
                borderWidth: 1,
                backgroundColor: "red",
                justifyContent: "center",
                alignItems: "center",
                margin: 12,
                borderRadius: 4,
              }}
            >
              <Text style={{ fontSize: 16, color: "white" }}>DROP OUTFITS</Text>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={() => wipePlannedOutfits(db)}
              style={{
                padding: 12,
                borderWidth: 1,
                backgroundColor: "orange",
                justifyContent: "center",
                alignItems: "center",
                margin: 12,
                borderRadius: 4,
              }}
            >
              <Text style={{ fontSize: 16, color: "white" }}>WIPE PLANNED OUTFITS</Text>
            </TouchableHighlight>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  brand: {
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
    marginBottom: 32,
  },
  container: {
    marginTop: 16,
    gap: 8,
  },
  reset: {
    marginTop: 16,
    marginBottom: 24,
    alignItems: "center",
  },
});
