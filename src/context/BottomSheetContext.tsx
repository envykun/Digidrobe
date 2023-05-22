import { Dispatch, SetStateAction, ReactNode, createContext, PropsWithChildren, useState } from "react";

export interface IBottomSheetContext {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  contentType: BottomSheetContent | undefined;
  setContentType: Dispatch<SetStateAction<BottomSheetContent | undefined>>;
  content: ReactNode | undefined;
  setContent: Dispatch<SetStateAction<ReactNode | undefined>>;
  title: string | undefined;
  setTitle: Dispatch<SetStateAction<string | undefined>>;
  onPress: ((value?: string) => void) | undefined;
  setOnPress: Dispatch<SetStateAction<((value?: string) => void) | undefined>>;
  showSearch: boolean;
  setShowSearch: Dispatch<SetStateAction<boolean>>;
  selectedValues: Array<string>;
  setSelectedValues: Dispatch<SetStateAction<Array<string>>>;
  resetBottomSheet: () => void;
}

export const BottomSheetContext = createContext<IBottomSheetContext | null>(null);

export type BottomSheetContent = "Categories" | "Fabric" | "Color" | string;

export const BottomSheetContextProvider = ({ children }: PropsWithChildren) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [contentType, setContentType] = useState<BottomSheetContent>();
  const [content, setContent] = useState<ReactNode>();
  const [onPress, setOnPress] = useState<((value?: string) => void) | undefined>();
  const [title, setTitle] = useState<string>();
  const [selectedValues, setSelectedValues] = useState<Array<string>>([]);

  const resetBottomSheet = () => {
    setIsOpen(false);
    setContentType(undefined);
    setShowSearch(false);
    setContent(undefined);
    setTitle(undefined);
    setSelectedValues([]);
  };

  const value: IBottomSheetContext = {
    isOpen,
    setIsOpen,
    showSearch,
    setShowSearch,
    contentType,
    setContentType,
    content,
    setContent,
    title,
    setTitle,
    onPress,
    setOnPress,
    selectedValues,
    setSelectedValues,
    resetBottomSheet,
  };

  return <BottomSheetContext.Provider value={value}>{children}</BottomSheetContext.Provider>;
};

export default BottomSheetContext;
