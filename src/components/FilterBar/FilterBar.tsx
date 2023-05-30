import { PropsWithChildren, ReactElement, useEffect, useRef } from "react";
import { ScrollView, StyleSheet, View, TouchableOpacity, Dimensions, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@Styles/colors";
import AdditionalFilter, { AdditionalFilterProps } from "./AdditionalFilter";
import { LinearGradient } from "expo-linear-gradient";

interface FilterBarProps {
  showAdditionalFilter?: boolean;
  additionalFilterProps?: Partial<AdditionalFilterProps>;
  isOpen?: boolean;
  additionalChildren?: ReactElement;
}

export default function FilterBar({
  children,
  showAdditionalFilter,
  isOpen,
  additionalChildren,
  additionalFilterProps,
}: PropsWithChildren<FilterBarProps>) {
  const additionalFilterAnim = useRef(new Animated.Value(0)).current;

  const showAdditionalFilterAnim = () => {
    Animated.timing(additionalFilterAnim, {
      toValue: 1,
      useNativeDriver: false,
      duration: 150,
    }).start();
  };

  const hideAdditionalFilterAnim = () => {
    Animated.timing(additionalFilterAnim, {
      toValue: 0,
      useNativeDriver: false,
      duration: 150,
    }).start();
  };

  useEffect(() => {
    isOpen ? showAdditionalFilterAnim() : hideAdditionalFilterAnim();
  }, [isOpen]);

  return (
    <>
      <LinearGradient colors={[Colors.primary, "white"]} style={{ alignItems: "center", zIndex: 4 }}>
        <View style={styles.container}>
          <ScrollView horizontal contentContainerStyle={styles.filterBar}>
            {children}
          </ScrollView>
        </View>
      </LinearGradient>
      {showAdditionalFilter && (
        <Animated.View
          style={[
            styles.additionalChildren,
            {
              transform: [
                {
                  translateY: additionalFilterAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-100, 0],
                  }),
                },
              ],
            },
            {
              maxHeight: additionalFilterAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 90],
              }),
            },
          ]}
        >
          {additionalChildren ?? <AdditionalFilter {...additionalFilterProps} />}
        </Animated.View>
      )}
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
    zIndex: 1,
  },
});
