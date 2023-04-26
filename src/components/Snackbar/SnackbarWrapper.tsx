import { useContext } from "react";
import Snackbar from "./Snackbar";
import SnackbarContext from "@Context/SnackbarContext";

export function SnackbarWrapper() {
  const snack = useContext(SnackbarContext);
  const closeCallback = () => {
    if (!snack) return;
    snack.setIsOpen(false);
    // Wait for animation to finish
    setTimeout(() => snack.setMessage(""), 2000);
  };

  return (
    <Snackbar
      message={snack?.message}
      visible={snack?.isOpen}
      closeCallback={closeCallback}
      action={{ text: "UNDO", onPress: () => console.log("UNDO") }}
    />
  );
}
