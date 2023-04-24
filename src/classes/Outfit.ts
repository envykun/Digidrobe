import { OutfitCategoryProp } from "@Components/Box/OutfitCategory";
import { Category } from "@Models/Category";
import { IOutfit, PreparedForDatabaseOutfit } from "@Models/Outfit";
import { Item } from "./Item";
import { OutfitCategoryType, OutfitMap } from "src/screens/NewOutfit";

export class Outfit {
  uuid: string;
  items: OutfitMap;
  imageURL?: string;
  name?: string;
  refresh?: () => void;
  planned?: Date;

  constructor({ uuid, refresh, imageURL, name, items }: IOutfit) {
    this.uuid = uuid;
    this.refresh = refresh;
    this.imageURL = imageURL;
    this.name = name;
    this.items = items ?? new Map();
  }

  public addItem(category: OutfitCategoryType, item: Item) {
    const prevItems = this.items.get(category);
    prevItems ? this.items.set(category, [...prevItems, item]) : this.items.set(category, [item]);
    this.refresh && this.refresh();
  }

  public getItemsByCategory(category: OutfitCategoryType) {
    return this.items.get(category);
  }

  public getAllItems() {
    return Array.from(this.items.values()).flat();
  }

  public removeItemFromCategory(category: OutfitCategoryType, item: Item) {
    const prevItems = this.items.get(category);
    prevItems &&
      this.items.set(
        category,
        prevItems.filter((i) => i.uuid !== item.uuid)
      );
    this.refresh && this.refresh();
  }

  public getOutfitStatistic() {
    const totalCost = 0;
    const totalItems = 0;
    const totalWears = 0;
    return [
      { label: "Total Cost", value: totalCost, suffix: "€" },
      { label: "Total Items", value: totalItems },
      { label: "Total Wears", value: totalWears },
    ];
  }

  public hasCategories() {
    return this.items.size > 0;
  }

  public getPreparedForDatabase(): PreparedForDatabaseOutfit {
    return {
      uuid: this.uuid,
      name: this.name ?? "Default Name",
      imageURL: this.imageURL ?? null,
      data: Array.from(this.items, ([o, i]) => ({ category: o, itemIDs: i.map((item) => item.uuid) })),
    };
  }

  public getItemImageURLs() {
    const imageUrls = Array.from(this.items.values())
      .flatMap((c) => Array.from(c.values()).flatMap((i) => i.getImage()))
      .filter((url): url is string => !!url);
    return imageUrls.length > 0 ? imageUrls : undefined;
  }

  public setPlannedDate(date?: Date) {
    this.planned = date;
  }

  public getPlannedDate() {
    return this.planned;
  }
}
