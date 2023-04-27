import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import Home from "@Screens/Home";
import Wardrobe from "@Screens/Wardrobe";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import Statistic from "@Screens/Statistic";
import Outfitter from "@Screens/Outfitter";
import {
  NativeStackNavigationOptions,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import ItemDetails from "@Screens/ItemDetails";
import NewOutfit from "@Screens/NewOutfit";
import Outfits from "@Screens/Outfits";
import Favorites from "@Screens/Favorites";
import Recent from "@Screens/Recent";
import UserSettings from "@Screens/UserSettings";
import NewItem from "@Screens/NewItem";
import { initDatabase } from "@Database/database";
import { Item } from "@Classes/Item";
import OutfitDetails from "@Screens/OutfitDetails";
import { SnackbarContextProvider } from "@Context/SnackbarContext";
import { SnackbarWrapper } from "@Components/Snackbar/SnackbarWrapper";

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
const headerOptions: NativeStackNavigationOptions = {
  headerTitleAlign: "center",
};

function RootNavigator() {
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
          presentation: "modal",
        }}
      >
        <Stack.Screen
          name="ItemDetails"
          component={ItemDetails}
          options={({ route }) => ({
            ...headerOptions,
            title: route.params?.item.name,
            headerRight: ({ tintColor }) => (
              <TouchableOpacity onPress={() => console.log("Create")}>
                <Ionicons
                  name="ios-create-outline"
                  size={24}
                  color={tintColor}
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="NewOutfit"
          component={NewOutfit}
          options={({ route }) => ({
            ...headerOptions,
            title: route.params?.title,
            headerRight: ({ tintColor }) => (
              <TouchableOpacity onPress={() => console.log("Create")}>
                <Ionicons
                  name="ios-checkmark-circle-outline"
                  size={32}
                  color={tintColor}
                />
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
              <TouchableOpacity onPress={() => console.log("Create")}>
                <Ionicons
                  name="ios-checkmark-circle-outline"
                  size={32}
                  color={tintColor}
                />
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
            title: route.params?.outfitId,
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
            title: route.params?.title,
          })}
        />
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
        headerTitleAlign: "center",
      })}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          ...tabOptions,
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="home" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Wardrobe"
        component={Wardrobe}
        options={{
          ...tabOptions,
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="skin" size={size} color={color} />
          ),
          headerRight: ({ tintColor, pressOpacity }) => (
            <TouchableOpacity
              onPress={() => console.log("Create")}
              activeOpacity={pressOpacity}
              style={{ marginRight: 16 }}
            >
              <Ionicons
                name="ios-add-circle-outline"
                size={32}
                color={tintColor}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Tab.Screen
        name="Outfitter"
        component={Outfitter}
        options={{
          ...tabOptions,
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="home" size={size} color={color} />
          ),
          headerRight: ({ tintColor, pressOpacity }) => (
            <TouchableOpacity
              onPress={() => console.log("Create")}
              activeOpacity={pressOpacity}
              style={{ marginRight: 16 }}
            >
              <Ionicons
                name="ios-add-circle-outline"
                size={32}
                color={tintColor}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Tab.Screen
        name="Statistic"
        component={Statistic}
        options={{
          ...tabOptions,
          tabBarIcon: ({ focused, color, size }) => (
            <AntDesign name="barschart" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  initDatabase();
  return (
    <SnackbarContextProvider>
      <View style={styles.container}>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
        <SnackbarWrapper />
      </View>
    </SnackbarContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
});
