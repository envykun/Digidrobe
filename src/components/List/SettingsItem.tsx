import { Modal, StyleSheet, Text, TouchableHighlight, View } from "react-native";
import React, { PropsWithChildren, ReactNode, useEffect, useState } from "react";

export interface SettingsItemProps {
  onPress?: () => void;
  label: string;
  value?: string;
  modalContent?: ReactNode;
}

export default function SettingsItem({ label, onPress, value, modalContent, children }: PropsWithChildren<SettingsItemProps>) {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <TouchableHighlight onPress={onPress}>
        <View style={styles.item}>
          <Text style={{ fontSize: 16, fontWeight: "100" }}>{label}</Text>
          {children ? children : value && <Text style={{ fontSize: 18, fontWeight: "200" }}>{value}</Text>}
        </View>
      </TouchableHighlight>
      <Modal visible={showModal} animationType="slide" transparent={true} onRequestClose={() => setShowModal(false)}>
        <View style={styles.modal}>{modalContent}</View>
      </Modal>
    </>
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
  modal: {
    flex: 1,
    height: 100,
    backgroundColor: "black",
  },
});
