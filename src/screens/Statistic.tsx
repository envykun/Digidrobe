import DigiButton from "@Components/Button/DigiButton";
import Skeleton from "@Components/Skeleton/Skeleton";
import Snackbar from "@Components/Snackbar/Snackbar";
import WorkInProgress from "@Components/WIP";
import { useState } from "react";
import { ScrollView, Text, View, StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { MultiSelect } from "react-native-element-dropdown";

export default function Statistic() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState([
    "italy",
    "spain",
    "barcelona",
    "finland",
  ]);
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
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        searchable={true}
        multiple={true}
        mode="BADGE"
        badgeDotColors={[
          "#e76f51",
          "#00b4d8",
          "#e9c46a",
          "#e76f51",
          "#8ac926",
          "#00b4d8",
          "#e9c46a",
        ]}
        listMode="SCROLLVIEW"
        scrollViewProps={{
          nestedScrollEnabled: true,
        }}
        dropDownContainerStyle={{
          position: "relative",
          top: 0,
        }}
      />
      <MultiSelect
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={items}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Select item"
        searchPlaceholder="Search..."
        value={value2}
        onChange={(item) => {
          setValue2(item);
        }}
      />
      <DigiButton title="Open Snackbar" onPress={() => setIsOpen(!isOpen)} />
      <Snackbar
        message="Hello this is Dog."
        visible={isOpen}
        closeCallback={() => setIsOpen(false)}
        action={{ text: "UNDO", onPress: () => console.log("UNDO") }}
      />
      <DigiButton title="Premade Snack" onPress={() => setIsOpen2(!isOpen2)} />
      <Skeleton />
      <Skeleton variant="circular" />
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
