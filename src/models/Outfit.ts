import { Item } from "@Classes/Item";
import { BaseCategory } from "@Database/constants";

export interface IOutfit {
  uuid: string;
  refresh?: () => void;
  imageURL?: string;
  name?: string;
  items?: OutfitMap;
  bookmarked?: number;
  wears?: number;
  lastWorn?: Date;
  tags?: Array<string>;
  planned?: Array<Date>;
}

export interface OutfitOverview {
  uuid: string;
  name: string;
  imageURL?: string;
  itemImageURLs?: Array<ItemImagePreview>;
  tags?: Array<string>;
}

export type ItemImagePreview = { uuid: string; name: string; imageURL: string | null };

export interface OutfitDatabaseData {
  category: BaseCategory;
  itemIDs: Array<string>;
}

export interface PreparedForDatabaseOutfit {
  uuid: string;
  name: string;
  imageURL: string | null;
  data: Array<OutfitDatabaseData>;
  bookmarked: number;
  tags: Array<string> | null;
}

export interface OutfitDataResponse {
  bookmarked: number;
  imageURL: string | null;
  name: string;
  uuid: string;
}

export type OutfitMap = Map<BaseCategory, Array<Item>>;
