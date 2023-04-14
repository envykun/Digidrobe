import { OutfitCategoryProp } from "@Components/Box/OutfitCategory";

export interface IOutfit {
  uuid: string;
  refresh?: () => void;
  imageURL?: string;
  name?: string;
  categories?: Map<string, OutfitCategoryProp>;
}

export interface OutfitDbResponse {}

export interface OutfitOverview {
  uuid: string;
  imageURL?: string;
  name?: string;
  itemImageURLs?: Array<ItemImagePreview>;
}

export type ItemImagePreview = { name: string; imageURL: string | null };
