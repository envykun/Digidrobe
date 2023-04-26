import { createContext, Dispatch, PropsWithChildren, SetStateAction, useState } from "react";

export interface ISnackbarContext {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  message: string;
  setMessage: Dispatch<SetStateAction<string>>;
}

export const SnackbarContext = createContext<ISnackbarContext | null>(null);

export const SnackbarContextProvider = ({ children }: PropsWithChildren) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const value: ISnackbarContext = {
    isOpen,
    setIsOpen,
    message,
    setMessage,
  };

  return <SnackbarContext.Provider value={value}>{children}</SnackbarContext.Provider>;
};

export default SnackbarContext;
