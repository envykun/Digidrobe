import React, { PropsWithChildren, ReactNode } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface FilterItemProps {
  label: string;
  onPress?: () => void;
  selectedValues?: Array<string | ReactNode> | string | null;
}

export default function FilterItem({ label, onPress, selectedValues, children }: PropsWithChildren<FilterItemProps>) {
  return (
    <View>
      <TouchableOpacity onPress={onPress} style={styles.filterItem}>
        <>
          <View style={styles.textContainer}>
            <Text numberOfLines={1} style={{ fontSize: 18, fontWeight: "100" }}>
              {label}
            </Text>
            {children ? (
              <View style={{ flexDirection: "row", gap: 8, overflow: "hidden", paddingBottom: 4, paddingLeft: 4 }}>{children}</View>
            ) : (
              selectedValues && (
                <Text numberOfLines={1} ellipsizeMode="tail">
                  {selectedValues}
                </Text>
              )
            )}
          </View>
          <Ionicons name="chevron-forward" size={24} color="black" />
        </>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  filterItem: {
    width: "100%",
    height: 80,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // borderBottomWidth: 1,
    // paddingHorizontal: 16,
  },
  textContainer: {
    gap: 6,
  },
});
