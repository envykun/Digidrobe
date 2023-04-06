import WorkInProgress from "@Components/WIP";
import { layout } from "@Styles/global";
import { SafeAreaView, ScrollView, Text, TouchableHighlight } from "react-native";
import { deleteDatabase, getDatabase, wipeDatabase } from "src/database/database";

export default function UserSettings() {
  const db = getDatabase();
  return (
    <SafeAreaView>
      <ScrollView style={layout.scrollContainer} showsVerticalScrollIndicator={false}>
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
      </ScrollView>
    </SafeAreaView>
  );
}
