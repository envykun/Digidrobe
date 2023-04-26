import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View, Text, TouchableOpacity } from "react-native";

export interface SnackbarProps {
  message?: string;
  action?: SnackbarAction;
  type?: SnackbarType;
  visible?: boolean;
  closeCallback?: () => void;
  preventAutoDismiss?: boolean;
}

export interface SnackbarAction {
  text: string;
  color?: string;
  onPress: () => void;
}

export type SnackbarType = "success" | "error" | "default" | "info";

export default function Snackbar({ message, action, type = "default", visible, closeCallback, preventAutoDismiss }: SnackbarProps) {
  const animatedValue = useRef(new Animated.Value(0));

  const showSnackbar = () => {
    Animated.timing(animatedValue.current, {
      toValue: 1,
      useNativeDriver: false,
    }).start();
  };

  const hideSnackbar = () => {
    Animated.timing(animatedValue.current, {
      toValue: 0,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    visible ? showSnackbar() : hideSnackbar();
    visible &&
      !preventAutoDismiss &&
      setTimeout(() => {
        closeCallback && closeCallback();
      }, 5000);
  }, [visible]);

  return (
    <Animated.View
      style={[
        styles.snackContainer,
        {
          bottom: animatedValue.current.interpolate({
            inputRange: [0, 1],
            outputRange: [-300, 60],
          }),
        },
      ]}
    >
      <View style={styles.content}>
        <Text>{message}</Text>
        {action && (
          <TouchableOpacity onPress={action.onPress}>
            <Text style={{ fontSize: 16, fontWeight: "700" }}>{action.text}</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  snackContainer: {
    position: "absolute",
    height: 70,
    bottom: 60,
    left: 0,
    right: 0,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "aqua",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 3,
  },
});
