import { Item } from "@Classes/Item";

export const byName = (data: Item[]) => {
  return data.sort((a, b) => a.name.localeCompare(b.name));
};

export const byCost = (data: Item[]) => {
  return data.sort((a, b) => (a.cost ?? 0) - (b.cost ?? 0));
};

export const byLastWorn = (data: Item[]) => {
  return data.sort(
    (a, b) =>
      new Date(b.lastWorn ?? 0).getDate() - new Date(a.lastWorn ?? 0).getDate()
  );
};

export const byBuyDate = (data: Item[]) => {
  return data.sort(
    (a, b) =>
      new Date(b.bought ?? 0).getDate() - new Date(a.bought ?? 0).getDate()
  );
};

export const byBrand = (data: Item[]) => {
  return data.sort((a, b) => (a.brand ?? "").localeCompare(b.brand ?? ""));
};

export const byWearCount = (data: Item[]) => {
  return data.sort((a, b) => a.wears - b.wears);
};

export interface SortFunctionsItems {
  name: (data: Item[]) => Item[];
  cost: (data: Item[]) => Item[];
  lastWorn: (data: Item[]) => Item[];
  buyDate: (data: Item[]) => Item[];
  brand: (data: Item[]) => Item[];
  wearCount: (data: Item[]) => Item[];
}
export type SortFunctionKeys = keyof SortFunctionsItems;

export const sortFunctionsItems: SortFunctionsItems = {
  name: byName,
  cost: byCost,
  lastWorn: byLastWorn,
  buyDate: byBuyDate,
  brand: byBrand,
  wearCount: byWearCount,
};
export const sortFunctionsOutfits = {
  name: "",
  cost: "",
  lastWorn: "",
  buyDate: "",
  brand: "",
  wearCount: "",
};
export default { sortFunctionsItems, sortFunctionsOutfits };
