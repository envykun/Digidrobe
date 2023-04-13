import { Modal, StyleSheet, View, Text, Dimensions, TouchableWithoutFeedback } from "react-native";
import { PropsWithChildren } from "react";
import Input from "@Components/Inputs/Input";

export interface BottomSheetProps {
  title?: string;
  isOpen?: boolean;
  closeModal?: () => void;
  showSearch?: boolean;
  searchCallback?: (value?: string) => void;
}

const deviceHeight = Dimensions.get("window").height;

export default function BottomSheet({
  title,
  isOpen = false,
  closeModal,
  showSearch,
  searchCallback,
  children,
}: PropsWithChildren<BottomSheetProps>) {
  return (
    <>
      {isOpen && <View style={[styles.outsideClick, styles.dimmed]} />}
      <Modal animationType="slide" transparent visible={isOpen} onRequestClose={closeModal}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.outsideClick} />
        </TouchableWithoutFeedback>
        <View style={styles.bottomSheet}>
          {title && (
            <View style={{ width: "100%", marginBottom: 16 }}>
              <Text style={{ fontSize: 16, color: "#a5a5a5" }}>{title}</Text>
            </View>
          )}
          {showSearch && (
            <View style={styles.searchInput}>
              <Input placeholder="Type to search..." onChange={searchCallback} />
            </View>
          )}
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
    maxHeight: deviceHeight * 0.4,
  },
  bottomSheet: {
    position: "absolute",
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
    gap: 16,
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
  searchInput: {
    height: 42,
    width: "100%",
  },
});
