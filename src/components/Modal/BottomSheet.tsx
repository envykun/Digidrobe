import { Modal, StyleSheet, View, Text, Dimensions, TouchableWithoutFeedback } from "react-native";
import { PropsWithChildren } from "react";

export interface BottomSheetProps {
  title?: string;
  isOpen?: boolean;
  closeModal?: () => void;
}

const deviceHeight = Dimensions.get("window").height;

export default function BottomSheet({ title, isOpen = false, closeModal, children }: PropsWithChildren<BottomSheetProps>) {
  return (
    <>
      {isOpen && <View style={[styles.outsideClick, styles.dimmed]} />}
      <Modal animationType="slide" transparent visible={isOpen} onRequestClose={closeModal}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.outsideClick} />
        </TouchableWithoutFeedback>
        <View style={styles.bottomSheet}>
          <View style={{ width: "100%", marginBottom: 16 }}>
            <Text style={{ fontSize: 16, color: "#a5a5a5" }}>{title}</Text>
          </View>
          <View style={styles.container}>{children}</View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    columnGap: 16,
  },
  bottomSheet: {
    position: "absolute",
    maxHeight: deviceHeight * 0.4,
    left: 0,
    right: 0,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "white",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingVertical: 23,
    paddingHorizontal: 25,
    bottom: 0,
    elevation: 5,
  },
  outsideClick: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  dimmed: {
    backgroundColor: "#00000076",
  },
});
