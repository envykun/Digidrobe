import { BottomTabNavigationOptions, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BottomTabParamList } from "./Navigator.interface";
import Home from "@Screens/Home";
import { Colors } from "@Styles/colors";
import { TouchableOpacity } from "react-native";
import Wardrobe from "@Screens/Wardrobe";
import Outfitter from "@Screens/Outfitter";
import Statistic from "@Screens/Statistic";
import { AntDesign, SimpleLineIcons, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator<BottomTabParamList>();
const tabOptions: BottomTabNavigationOptions = {};

export default function BottomTabNavigator() {
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
