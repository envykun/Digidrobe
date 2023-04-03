export interface ItemMetadata {
  // id?: string;
  name?: string;
  wears?: number;
  lastWorn?: Date;
  cost?: number;
  category?: Array<string>;
  brand?: string;
  model?: string;
  size?: number;
  fabric?: Array<string>;
  bought?: Date;
  boughtFrom?: string;
  notes?: string;
  savedOutfits?: Array<any>;
}
