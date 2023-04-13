export interface ItemMetadata {
  uuid: string;
  name?: string;
  wears?: number;
  lastWorn?: string;
  cost?: number;
  category?: Array<string>;
  brand?: string;
  model?: string;
  size?: number;
  fabric?: Array<string>;
  color?: Array<string>;
  bought?: string;
  boughtFrom?: string;
  notes?: string;
  savedOutfits?: Array<any>;
  image?: string;
}

export interface ItemDataResponse {
  bought_date: string | null;
  bought_from: number | null;
  brand: number | null;
  cost: number | null;
  imageURL: string | null;
  last_worn: string | null;
  model: string | null;
  name: string;
  notes: string | null;
  size: number | null;
  uuid: string;
  wears: number;
}
