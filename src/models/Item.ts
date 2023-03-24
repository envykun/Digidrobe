export interface ItemMetadata {
  id: string;
  wears?: number;
  cost?: number;
  lastWorn?: Date;
  bought?: Date;
  category: any;
  savedOutfits?: Array<any>;
}

export interface IItem extends ItemMetadata {
  name: string;
}
