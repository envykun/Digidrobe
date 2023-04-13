import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { BottomTabNavigationOptions, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./src/screens/Home";
import Wardrobe from "./src/screens/Wardrobe";
import { AntDesign } from "@expo/vector-icons";
import Statistic from "./src/screens/Statistic";
import Outfitter from "./src/screens/Outfitter";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ItemDetails from "./src/screens/ItemDetails";
import NewOutfit from "src/screens/NewOutfit";
import Outfits from "src/screens/Outfits";
import Favorites from "src/screens/Favorites";
import Recent from "src/screens/Recent";
import UserSettings from "src/screens/UserSettings";
import NewItem from "src/screens/NewItem";
import { initDatabase } from "src/database/database";
import { Item } from "src/classes/Item";
import OutfitDetails from "src/screens/OutfitDetails";

export type RootStackParamList = {
  Root: any;
  ItemDetails: { item: Item };
  NewOutfit: any;
  NewItem: any;
  Outfits: any;
  OutfitDetails: { outfitId?: string };
  Favorites: any;
  Recent: any;
  UserSettings: any;
  NotFound: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  Wardrobe: {
    itemID?: string;
  };
  Outfitter: undefined;
  Statistic: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const tabOptions: BottomTabNavigationOptions = {};

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen name="ItemDetails" component={ItemDetails} options={({ route }) => ({ title: route.params?.item.name })} />
        <Stack.Screen name="NewOutfit" component={NewOutfit} options={({ route }) => ({ title: route.params?.title })} />
        <Stack.Screen name="NewItem" component={NewItem} options={({ route }) => ({ title: route.params?.title })} />
        <Stack.Screen name="Outfits" component={Outfits} options={({ route }) => ({ title: route.params?.title })} />
        <Stack.Screen name="OutfitDetails" component={OutfitDetails} options={({ route }) => ({ title: route.params?.outfitId })} />
        <Stack.Screen name="Favorites" component={Favorites} options={({ route }) => ({ title: route.params?.title })} />
        <Stack.Screen name="Recent" component={Recent} options={({ route }) => ({ title: route.params?.title })} />
        <Stack.Screen name="UserSettings" component={UserSettings} options={({ route }) => ({ title: route.params?.title })} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

function BottomTabNavigator() {
  return (
    <Tab.Navigator
      safeAreaInsets={{ bottom: 8 }}
      screenOptions={() => ({
        tabBarActiveTintColor: "#E2C895",
      })}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          ...tabOptions,
          tabBarIcon: ({ color, size }) => <AntDesign name="home" size={size} color={color} />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Wardrobe"
        component={Wardrobe}
        options={{ ...tabOptions, tabBarIcon: ({ color, size }) => <AntDesign name="skin" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="Outfitter"
        component={Outfitter}
        options={{ ...tabOptions, tabBarIcon: ({ color, size }) => <AntDesign name="home" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="Statistic"
        component={Statistic}
        options={{ ...tabOptions, tabBarIcon: ({ focused, color, size }) => <AntDesign name="barschart" size={size} color={color} /> }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  initDatabase();
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
