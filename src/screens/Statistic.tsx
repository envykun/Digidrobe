import DigiButton from "@Components/Button/DigiButton";
import FullCalendar from "@Components/Calendar/FullCalendar";
import Select from "@Components/Inputs/Select";
import Skeleton from "@Components/Skeleton/Skeleton";
import Snackbar from "@Components/Snackbar/Snackbar";
import WorkInProgress from "@Components/WIP";
import { useState } from "react";
import { ScrollView, Text, View, StyleSheet } from "react-native";

export default function Statistic() {
  return (
    <View
      style={{
        paddingHorizontal: 15,
        width: "100%",
        height: "100%",
      }}
    >
      <Select />
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
