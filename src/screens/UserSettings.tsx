import WorkInProgress from "@Components/WIP";
import { layout } from "@Styles/global";
import { SafeAreaView, ScrollView, Text, TouchableHighlight } from "react-native";
import { deleteDatabase, dropOutfits, getDatabase, initializeTestData, wipeDatabase, wipeOutfits } from "@Database/database";

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
      </ScrollView>
    </SafeAreaView>
  );
}
