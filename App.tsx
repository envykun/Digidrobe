import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { BottomTabNavigationOptions, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "@Screens/Home";
import Wardrobe from "@Screens/Wardrobe";
import { AntDesign, Ionicons, SimpleLineIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import Statistic from "@Screens/Statistic";
import Outfitter from "@Screens/Outfitter";
import { NativeStackNavigationOptions, createNativeStackNavigator } from "@react-navigation/native-stack";
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
import { Colors } from "@Styles/colors";
import { OutfitOverview } from "@Models/Outfit";
import * as SplashScreen from "expo-splash-screen";
import { BottomSheetContainer } from "@Components/Modal/BottomSheetContainer";
import { BottomSheetContextProvider } from "@Context/BottomSheetContext";
import { Outfit } from "@Classes/Outfit";
import { initializeSettings } from "@Hooks/useAsyncStorage";
import { i18n } from "@Database/i18n/i18n";
import FullCalendar from "@Components/Calendar/FullCalendar";
import CalendarScreen from "@Screens/CalendarScreen";

export type RootStackParamList = {
  Root: any;
  ItemDetails: { item: Item };
  NewOutfit: any;
  NewItem: any;
  Outfits: any;
  OutfitDetails: { outfit: Outfit };
  Favorites: any;
  Recent: any;
  UserSettings: any;
  Calendar: undefined;
  NotFound: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  Wardrobe: {
    itemID?: string;
    favoriteFilter?: boolean;
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
                <Ionicons name="ios-create-outline" size={24} color={tintColor} />
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
                <Ionicons name="ios-checkmark-circle-outline" size={32} color={tintColor} />
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
                <Ionicons name="ios-checkmark-circle-outline" size={32} color={tintColor} />
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
                <Ionicons name="ios-create-outline" size={24} color={tintColor} />
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
        options={({ navigation }) => ({
          ...tabOptions,
          tabBarIcon: ({ color, size }) => <AntDesign name="home" size={size} color={color} />,
          headerStyle: { backgroundColor: Colors.primary },
          headerTitle: "D I G I D R O B E",
          headerBackgroundContainerStyle: { backgroundColor: Colors.primary },
          headerRight: ({ tintColor, pressOpacity }) => (
            <TouchableOpacity onPress={() => navigation.navigate("UserSettings")} activeOpacity={pressOpacity} style={{ marginRight: 16 }}>
              <SimpleLineIcons name="user" size={24} color={tintColor} />
            </TouchableOpacity>
          ),
        })}
      />
      <Tab.Screen
        name="Wardrobe"
        component={Wardrobe}
        options={({ navigation }) => ({
          ...tabOptions,
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="wardrobe-outline" size={size} color={color} />,
          headerStyle: { backgroundColor: Colors.primary },
          headerLeft: ({ tintColor, pressOpacity }) => (
            <TouchableOpacity onPress={() => navigation.navigate("NewOutfit")} activeOpacity={pressOpacity} style={{ marginLeft: 16 }}>
              <Ionicons name="ios-filter" size={24} color={tintColor} />
            </TouchableOpacity>
          ),
          headerRight: ({ tintColor, pressOpacity }) => (
            <TouchableOpacity onPress={() => navigation.navigate("NewItem")} activeOpacity={pressOpacity} style={{ marginRight: 16 }}>
              <Ionicons name="ios-add-outline" size={32} color={tintColor} />
            </TouchableOpacity>
          ),
        })}
      />
      <Tab.Screen
        name="Outfitter"
        component={Outfitter}
        options={({ navigation }) => ({
          ...tabOptions,
          tabBarIcon: ({ color, size }) => <AntDesign name="skin" size={size} color={color} />,
          headerStyle: { backgroundColor: Colors.primary },
          headerLeft: ({ tintColor, pressOpacity }) => (
            <TouchableOpacity onPress={() => navigation.navigate("NewOutfit")} activeOpacity={pressOpacity} style={{ marginLeft: 16 }}>
              <Ionicons name="ios-filter" size={24} color={tintColor} />
            </TouchableOpacity>
          ),
          headerRight: ({ tintColor, pressOpacity }) => (
            <TouchableOpacity onPress={() => navigation.navigate("NewOutfit")} activeOpacity={pressOpacity} style={{ marginRight: 16 }}>
              <Ionicons name="ios-add-outline" size={32} color={tintColor} />
            </TouchableOpacity>
          ),
        })}
      />
      <Tab.Screen
        name="Statistic"
        component={Statistic}
        options={{
          ...tabOptions,
          tabBarIcon: ({ focused, color, size }) => <AntDesign name="barschart" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await initDatabase();
        await initializeSettings();
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      console.info("Data initialized.");
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <SnackbarContextProvider>
      <BottomSheetContextProvider>
        <View style={styles.container} onLayout={onLayoutRootView}>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
          <BottomSheetContainer />
          <SnackbarWrapper />
        </View>
      </BottomSheetContextProvider>
    </SnackbarContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
});
