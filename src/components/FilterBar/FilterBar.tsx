import { PropsWithChildren, ReactElement } from "react";
import { ScrollView, StyleSheet, View, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@Styles/colors";

interface FilterBarProps {
  showAdditionalFilter?: boolean;
  isOpen?: boolean;
  onPress?: () => void;
  additionalChildren?: ReactElement;
}

export default function FilterBar({
  children,
  showAdditionalFilter,
  isOpen,
  onPress,
  additionalChildren,
}: PropsWithChildren<FilterBarProps>) {
  return (
    <>
      <View style={styles.container}>
        {/* {showAdditionalFilter && (
          <TouchableOpacity style={[styles.additionalFilter, isOpen && styles.active]} onPress={onPress}>
            <Ionicons name="ios-filter" size={24} color="black" />
          </TouchableOpacity>
        )} */}
        <ScrollView horizontal contentContainerStyle={styles.filterBar}>
          {children}
        </ScrollView>
      </View>
      {isOpen && <View style={styles.additionalChildren}>{additionalChildren}</View>}
    </>
  );
}

const styles = StyleSheet.create({
  filterBar: {
    flexDirection: "row",
    gap: 8,
    height: 80,
    alignItems: "center",
    paddingHorizontal: 8,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: Colors.primary,
  },
  additionalFilter: {
    marginLeft: 8,
    marginRight: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    paddingVertical: 4,
  },
  active: {
    backgroundColor: Colors.primary,
  },
  additionalChildren: {
    width: Dimensions.get("window").width,
    paddingHorizontal: 8,
  },
});
