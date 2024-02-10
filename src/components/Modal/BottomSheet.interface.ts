import { GenericBottomSheetItem } from "@Models/Generic";

export interface BottomSheetItemProps {
  id: string;
  label: string;
  imageURL?: string;
  onPress?: (value: GenericBottomSheetItem) => void;
  twoColumn?: boolean;
  selected?: boolean;
  color?: string;
}
