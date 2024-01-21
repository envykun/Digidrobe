import { StyleSheet, Image, TouchableWithoutFeedback, View, Modal, TouchableOpacity, Animated, Dimensions } from "react-native";
import React, { createRef, useRef, useState } from "react";
import { GestureHandlerRootView, PanGestureHandler, PinchGestureHandler, State } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

export interface DetailImageProps {
  image?: string;
}

export default function DetailImage({ image }: DetailImageProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const pinchRef = createRef();
  const panRef = createRef();

  const [showFullscreenImage, setShowFullscreenImage] = useState<boolean>(false);
  const [panEnabled, setPanEnabled] = useState<boolean>(false);

  const onPinchEvent = Animated.event([{ nativeEvent: { scale: scale } }], { useNativeDriver: true });
  const onPanEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationX: translateX,
          translationY: translateY,
        },
      },
    ],
    { useNativeDriver: true }
  );

  const handlePinchStateChange = ({ nativeEvent }: any) => {
    if (nativeEvent.oldState === State.ACTIVE) {
      setPanEnabled(true);
    }

    const nScale = nativeEvent.scale;
    if (nativeEvent.state === State.END) {
      if (nScale < 1) {
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
        }).start();
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();

        setPanEnabled(false);
      }
    }
  };

  return (
    <>
      <View style={styles.image}>
        {image ? (
          <TouchableWithoutFeedback delayPressIn={500} onPress={() => setShowFullscreenImage(true)}>
            <Image source={{ uri: image }} style={{ resizeMode: "cover", width: "100%", height: "100%" }} />
          </TouchableWithoutFeedback>
        ) : (
          <Image source={require("@Styles/img/noImg.jpg")} style={{ resizeMode: "cover", width: "100%", height: "100%" }} />
        )}
      </View>
      <Modal visible={showFullscreenImage} statusBarTranslucent={true} onRequestClose={() => setShowFullscreenImage(false)}>
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: "black" }}>
          <TouchableOpacity style={styles.closeModal}>
            <Ionicons name="close" color="white" size={24} onPress={() => setShowFullscreenImage(false)} />
          </TouchableOpacity>
          <PanGestureHandler
            ref={panRef}
            simultaneousHandlers={[pinchRef]}
            onGestureEvent={onPanEvent}
            enabled={panEnabled}
            activeOffsetX={[0, 0]}
            failOffsetX={[-1000, 1000]}
            shouldCancelWhenOutside
          >
            <Animated.View>
              <PinchGestureHandler
                ref={pinchRef}
                simultaneousHandlers={[panRef]}
                onGestureEvent={onPinchEvent}
                onHandlerStateChange={handlePinchStateChange}
              >
                <Animated.Image
                  source={{ uri: image }}
                  style={[styles.fullImage, { transform: [{ scale }, { translateX }, { translateY }] }]}
                />
              </PinchGestureHandler>
            </Animated.View>
          </PanGestureHandler>
        </GestureHandlerRootView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  image: {
    height: Dimensions.get("screen").height * 0.66,
    overflow: "hidden",
  },
  fullImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  closeModal: {
    position: "absolute",
    right: 16,
    top: 48,
    zIndex: 99,
  },
});
