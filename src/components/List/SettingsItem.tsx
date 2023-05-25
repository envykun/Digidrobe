import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import React, { PropsWithChildren, useEffect, useState } from "react";

export interface SettingsItemProps {
  onPress?: () => void;
  label: string;
  value?: string;
}

export default function SettingsItem({ label, onPress, value, children }: PropsWithChildren<SettingsItemProps>) {
  return (
    <TouchableHighlight onPress={onPress}>
      <View style={styles.item}>
        <Text style={{ fontSize: 16, fontWeight: "100" }}>{label}</Text>
        {children ? children : value && <Text>{value}</Text>}
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    gap: 16,
  },
});
