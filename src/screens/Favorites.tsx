import WorkInProgress from "@Components/WIP";
import { layout } from "@Styles/global";
import { SafeAreaView, ScrollView, Text } from "react-native";

export default function Favorites() {
  return (
    <SafeAreaView>
      <ScrollView style={layout.scrollContainer} showsVerticalScrollIndicator={false}>
        <WorkInProgress />
      </ScrollView>
    </SafeAreaView>
  );
}
