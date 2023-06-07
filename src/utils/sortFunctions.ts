import { Item } from "@Classes/Item";
import { Outfit } from "@Classes/Outfit";

export const byName = <T extends { name: string }>(data: T[]) => {
  return [...data.sort((a, b) => a.name.localeCompare(b.name))];
};

export const byCost = (data: Item[]) => {
  return [...data.sort((a, b) => (a.cost ?? 0) - (b.cost ?? 0))];
};

export const byLastWorn = <T extends { lastWorn?: Date }>(data: T[]) => {
  return [...data.sort((a, b) => new Date(b.lastWorn ?? 0).getDate() - new Date(a.lastWorn ?? 0).getDate())];
};

export const byBuyDate = (data: Item[]) => {
  return [...data.sort((a, b) => new Date(b.bought ?? 0).getDate() - new Date(a.bought ?? 0).getDate())];
};

export const byBrand = (data: Item[]) => {
  return [...data.sort((a, b) => (a.brand ?? "").localeCompare(b.brand ?? ""))];
};

export const byWearCount = (data: Item[]) => {
  return [...data.sort((a, b) => a.wears - b.wears)];
};

export interface SortFunctionsItems {
  name: (data: Item[]) => Item[];
  cost: (data: Item[]) => Item[];
  lastWorn: (data: Item[]) => Item[];
  buyDate: (data: Item[]) => Item[];
  brand: (data: Item[]) => Item[];
  wearCount: (data: Item[]) => Item[];
}

export const sortFunctionsItems: SortFunctionsItems = {
  name: byName<Item>,
  cost: byCost,
  lastWorn: byLastWorn<Item>,
  buyDate: byBuyDate,
  brand: byBrand,
  wearCount: byWearCount,
};

export interface SortFunctionsOutfits {
  name: (data: Outfit[]) => Outfit[];
  lastWorn: (data: Outfit[]) => Outfit[];
}

export const sortFunctionsOutfits = {
  name: byName<Outfit>,
  lastWorn: byLastWorn<Outfit>,
};

export default { sortFunctionsItems, sortFunctionsOutfits };
