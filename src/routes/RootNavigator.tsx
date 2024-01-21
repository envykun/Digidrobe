import { NativeStackNavigationOptions, createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./Navigator.interface";
import BottomTabNavigator from "./BottomTabNavigator";
import ItemDetails from "@Screens/ItemDetails";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { i18n } from "@Database/i18n/i18n";
import CalendarScreen from "@Screens/CalendarScreen";
import Favorites from "@Screens/Favorites";
import NewItem from "@Screens/NewItem";
import NewOutfit from "@Screens/NewOutfit";
import OutfitDetails from "@Screens/OutfitDetails";
import Outfits from "@Screens/Outfits";
import Recent from "@Screens/Recent";
import UserSettings from "@Screens/UserSettings";

const Stack = createNativeStackNavigator<RootStackParamList>();
const headerOptions: NativeStackNavigationOptions = {
  headerTitleAlign: "center",
};

export default function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Root"
        component={BottomTabNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Group
        screenOptions={{
          presentation: "card",
        }}
      >
        <Stack.Screen
          name="ItemDetails"
          component={ItemDetails}
          options={({ route }) => ({
            ...headerOptions,
            title: route.params?.item.name,
            headerRight: ({ tintColor }) => (
              <TouchableOpacity onPress={() => console.log("Edit")}>
                <Ionicons name="create-outline" size={24} color={tintColor} />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="NewOutfit"
          component={NewOutfit}
          options={({ route }) => ({
            ...headerOptions,
            title: "Create new Outfit",
            headerRight: ({ tintColor }) => (
              <TouchableOpacity>
                <Ionicons name="checkmark-circle-outline" size={32} color={tintColor} />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="NewItem"
          component={NewItem}
          options={({ route }) => ({
            ...headerOptions,
            title: route.params?.title,
            headerRight: ({ tintColor }) => (
              <TouchableOpacity onPress={() => console.log("Create Item")}>
                <Ionicons name="checkmark-circle-outline" size={32} color={tintColor} />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="Outfits"
          component={Outfits}
          options={({ route }) => ({
            ...headerOptions,
            title: route.params?.title,
          })}
        />
        <Stack.Screen
          name="OutfitDetails"
          component={OutfitDetails}
          options={({ route }) => ({
            ...headerOptions,
            title: route.params?.outfit.name,
            headerRight: ({ tintColor }) => (
              <TouchableOpacity onPress={() => console.log("Edit")}>
                <Ionicons name="create-outline" size={24} color={tintColor} />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="Favorites"
          component={Favorites}
          options={({ route }) => ({
            ...headerOptions,
            title: route.params?.title,
          })}
        />
        <Stack.Screen
          name="Recent"
          component={Recent}
          options={({ route }) => ({
            ...headerOptions,
            title: route.params?.title,
          })}
        />
        <Stack.Screen
          name="UserSettings"
          component={UserSettings}
          options={({ route }) => ({
            ...headerOptions,
            title: i18n.t("screens.settings"),
          })}
        />
        <Stack.Screen
          name="Calendar"
          component={CalendarScreen}
          options={({ route }) => ({
            ...headerOptions,
            title: i18n.t("screens.calendar"),
          })}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}
