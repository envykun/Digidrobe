import { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  StyleProp,
  ViewStyle,
} from "react-native";

export interface SkeletonProps {
  variant?: SkeletonType;
  width?: number | string;
  height?: number | string;
}

type SkeletonType =
  | "text"
  | "circular"
  | "rectangular"
  | "rounded"
  | "item"
  | "outfit";

export default function Skeleton({ variant, width, height }: SkeletonProps) {
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const sharedAnimationConfig = {
      duration: 1500,
      useNativeDriver: false,
    };
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          ...sharedAnimationConfig,
          toValue: 1,
          easing: Easing.out(Easing.ease),
        }),
        Animated.timing(pulseAnim, {
          ...sharedAnimationConfig,
          toValue: 0,
          easing: Easing.in(Easing.ease),
        }),
      ])
    ).start();

    return () => {
      pulseAnim.stopAnimation();
    };
  }, []);

  const colorAnim = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["lightgrey", "grey"],
  });

  const variantMap = (): StyleProp<ViewStyle> => {
    switch (variant) {
      case "circular":
        return {
          borderRadius: 9999,
          aspectRatio: 1 / 1,
          height: height ?? 24,
        };
      case "rectangular":
        return {};
      case "rounded":
        return {
          width: width ?? 80,
          height: height ?? 32,
          borderRadius: 8,
        };
      case "item":
        return {
          height: 244,
          borderRadius: 32,
          width: (Dimensions.get("screen").width - 8 - 32) / 2,
        };
      case "text":
      default:
        return {
          height: height ?? 24,
          borderRadius: 8,
          width: width,
        };
    }
  };

  return (
    <Animated.View
      style={[
        {
          backgroundColor: colorAnim,
        },
        variantMap(),
      ]}
    />
  );
}
