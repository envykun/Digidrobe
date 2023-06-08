import Select from "@Components/Inputs/Select";
import { getWeatherIconByCode, getWeatherTextByCode } from "@DigiUtils/helperFunctions";
import React, { useState } from "react";
import { ScrollView, Text, View, StyleSheet } from "react-native";
import { Fontisto } from "@expo/vector-icons";

export default function Statistic() {
  return (
    <ScrollView
      style={{
        paddingHorizontal: 15,
        width: "100%",
        height: "100%",
      }}
    >
      {[0, 1, 2, 3, 45, 48, 51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 71, 73, 75, 77, 80, 81, 82, 85, 86, 95, 96, 99].map((i, idx) => {
        return (
          <View key={idx} style={{ flexDirection: "row", alignItems: "center", gap: 16, borderWidth: 1, padding: 12 }}>
            <Text>{i}</Text>
            <Fontisto name={getWeatherIconByCode(i)} size={52} color="black" />
            <Text style={{ fontSize: 24 }}>{getWeatherTextByCode(i)}</Text>
          </View>
        );
      })}
    </ScrollView>
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
