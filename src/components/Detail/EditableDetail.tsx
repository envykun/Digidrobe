import DetailInput, { DetailInputProps } from "@Components/Inputs/DetailInput";
import Detail, { DetailProps } from "./Detail";

export interface EditableDetailProps {
  edit: boolean;
  label: string;
  detail?: Partial<DetailProps>;
  detailInput?: Partial<DetailInputProps>;
}
export default function EditableDetail({ edit, label, detail, detailInput }: EditableDetailProps) {
  if (edit) {
    return <DetailInput label={label} {...detailInput} />;
  }
  return <Detail label={label} {...detail} />;
}
