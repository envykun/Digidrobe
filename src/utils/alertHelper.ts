import { Alert, AlertButton } from "react-native";

export const deleteAlert = (type: string, label: string, deleteCallback: () => void) => {
  const title: string = `Delete ${type}`;
  const message: string = `Do you really want to delete ${label}?`;
  const buttons: AlertButton[] = [
    { text: "Cancel", style: "cancel" },
    { text: "Delete", onPress: deleteCallback, style: "destructive" },
  ];
  Alert.alert(title, message, buttons, { cancelable: true });
};
