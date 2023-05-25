import { BaseCategory } from "@Database/constants";

export interface ItemMetadata {
  uuid: string;
  name?: string;
  wears?: number;
  lastWorn?: Date;
  cost?: number;
  costPerWear?: number;
  category?: Array<string>;
  brand?: string;
  model?: string;
  size?: number;
  fabric?: Array<string>;
  color?: Array<string>;
  bought?: string;
  boughtFrom?: string;
  notes?: string;
  image?: string;
  favorite?: number;
  baseCategory: BaseCategory;
}

export interface ItemDataResponse {
  bought_date: string | null;
  bought_from: number | null;
  brand: number | null;
  cost: number | null;
  imageURL: string | null;
  last_worn: Date | null;
  model: string | null;
  name: string;
  notes: string | null;
  size: number | null;
  uuid: string;
  wears: number;
  favorite: number;
  base_category: BaseCategory;
}
