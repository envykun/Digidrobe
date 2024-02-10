import { GenericBottomSheetItem } from "@Models/Generic";
import {
  Dispatch,
  SetStateAction,
  ReactNode,
  createContext,
  PropsWithChildren,
  useState,
} from "react";

export interface IBottomSheetContext {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  contentType: BottomSheetContent | undefined;
  setContentType: Dispatch<SetStateAction<BottomSheetContent | undefined>>;
  content: ReactNode | undefined;
  setContent: Dispatch<SetStateAction<ReactNode | undefined>>;
  title: string | undefined;
  setTitle: Dispatch<SetStateAction<string | undefined>>;
  onPress: ((item?: GenericBottomSheetItem) => void) | undefined;
  setOnPress: Dispatch<
    SetStateAction<((value?: GenericBottomSheetItem) => void) | undefined>
  >;
  showSearch: boolean;
  setShowSearch: Dispatch<SetStateAction<boolean>>;
  selectedValues: Array<GenericBottomSheetItem>;
  setSelectedValues: Dispatch<SetStateAction<Array<GenericBottomSheetItem>>>;
  resetBottomSheet: () => void;
}

export const BottomSheetContext = createContext<IBottomSheetContext | null>(
  null
);

export type BottomSheetContent =
  | "Categories"
  | "Fabric"
  | "Color"
  | "BaseCategories"
  | string;

export const BottomSheetContextProvider = ({ children }: PropsWithChildren) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [contentType, setContentType] = useState<BottomSheetContent>();
  const [content, setContent] = useState<ReactNode>();
  const [onPress, setOnPress] = useState<
    ((value?: GenericBottomSheetItem) => void) | undefined
  >();
  const [title, setTitle] = useState<string>();
  const [selectedValues, setSelectedValues] = useState<
    Array<GenericBottomSheetItem>
  >([]);

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

  return (
    <BottomSheetContext.Provider value={value}>
      {children}
    </BottomSheetContext.Provider>
  );
};

export default BottomSheetContext;
