import DigiButton from "@Components/Button/DigiButton";
import FullCalendar from "@Components/Calendar/FullCalendar";
import Skeleton from "@Components/Skeleton/Skeleton";
import Snackbar from "@Components/Snackbar/Snackbar";
import WorkInProgress from "@Components/WIP";
import { useState } from "react";
import { ScrollView, Text, View, StyleSheet } from "react-native";

export default function Statistic() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(["italy", "spain", "barcelona", "finland"]);
  const [value2, setValue2] = useState<any>(null);
  const [items, setItems] = useState([
    { label: "Spain", value: "spain" },
    { label: "Madrid", value: "madrid", parent: "spain" },
    { label: "Barcelona", value: "barcelona", parent: "spain" },

    { label: "Italy", value: "italy" },
    { label: "Rome", value: "rome", parent: "italy" },

    { label: "Finland", value: "finland" },
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 15,
        width: "100%",
        height: "100%",
      }}
    >
      <DigiButton title="Open Snackbar" onPress={() => setIsOpen(!isOpen)} />
      <Snackbar
        message="Hello this is Dog."
        visible={isOpen}
        closeCallback={() => setIsOpen(false)}
        action={{ text: "UNDO", onPress: () => console.log("UNDO") }}
      />
      <DigiButton title="Premade Snack" onPress={() => setIsOpen2(!isOpen2)} />
      <FullCalendar />
    </View>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    margin: 16,
    height: 50,
    borderBottomColor: "gray",
    borderBottomWidth: 0.5,
    width: "100%",
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
