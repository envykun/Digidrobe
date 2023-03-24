import { View, Text, Dimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function WorkInProgress() {
  return (
    <View style={{ alignItems: "center", marginTop: 120 }}>
      <MaterialIcons name="construction" size={58} color="black" />
      <Text style={{ fontSize: 24 }}>Coming Soon! 🥳</Text>
    </View>
  );
}
