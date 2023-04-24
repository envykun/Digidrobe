import { Item } from "@Classes/Item";
import { OutfitCategoryProp } from "@Components/Box/OutfitCategory";
import { OutfitMap } from "src/screens/NewOutfit";

export interface IOutfit {
  uuid: string;
  refresh?: () => void;
  imageURL?: string;
  name?: string;
  items?: OutfitMap;
}

export interface OutfitOverview {
  uuid: string;
  imageURL?: string;
  name?: string;
  itemImageURLs?: Array<ItemImagePreview>;
}

export type ItemImagePreview = { uuid: string; name: string; imageURL: string | null };

export interface OutfitDatabaseData {
  category: string;
  itemIDs: Array<string>;
}

export interface PreparedForDatabaseOutfit {
  uuid: string;
  name: string;
  imageURL: string | null;
  data: Array<OutfitDatabaseData>;
}
