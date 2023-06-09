export interface BottomSheetItemProps {
  label: string;
  imageURL?: string;
  onPress?: (value: string) => void;
  twoColumn?: boolean;
  selected?: boolean;
  color?: string;
}
