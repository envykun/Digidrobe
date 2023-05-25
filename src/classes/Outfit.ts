import { IOutfit, ItemImagePreview, OutfitMap, PreparedForDatabaseOutfit } from "@Models/Outfit";
import { Item } from "./Item";
import { BaseCategory } from "@Database/constants";

export class Outfit implements IOutfit {
  uuid: string;
  name: string;
  items: OutfitMap;
  imageURL?: string;
  refresh?: () => void;
  planned?: Array<Date>;
  bookmarked?: number;
  tags?: Array<string>;
  wears: number;
  lastWorn?: Date;
  itemsUpdated?: boolean;

  constructor({ uuid, refresh, imageURL, name, items, bookmarked, wears = 0, lastWorn, tags, planned }: IOutfit) {
    this.uuid = uuid;
    this.refresh = refresh;
    this.imageURL = imageURL;
    this.name = name && name !== "" ? name : "Untitled";
    this.items = items ?? new Map();
    this.bookmarked = bookmarked ?? 0;
    this.wears = wears;
    this.lastWorn = lastWorn;
    this.tags = tags;
    this.planned = planned;
  }

  public addItem(baseCategory: BaseCategory, item: Item) {
    const prevItems = this.items.get(baseCategory);
    prevItems ? this.items.set(baseCategory, [...prevItems, item]) : this.items.set(baseCategory, [item]);
    this.itemsUpdated = true;
    this.refresh && this.refresh();
  }

  public getItemsByCategory(baseCategory: BaseCategory) {
    return this.items.get(baseCategory);
  }

  public getAllItems() {
    return Array.from(this.items.values()).flat();
  }

  public removeItemFromCategory(baseCategory: BaseCategory, item: Item) {
    const prevItems = this.items.get(baseCategory);
    prevItems &&
      this.items.set(
        baseCategory,
        prevItems.filter((i) => i.uuid !== item.uuid)
      );
    this.itemsUpdated = true;
    this.refresh && this.refresh();
  }

  public getOutfitStatistic() {
    const items = Array.from(this.items.values()).flat();
    const totalCost = items.reduce((prev, curr) => {
      return prev + (curr.cost ?? 0);
    }, 0);
    const totalItems = items.length;
    const colors = items
      .reduce((prev, curr) => {
        return prev.concat(curr.color || []);
      }, [] as string[])
      .filter((color) => color);
    return {
      totalCost: { label: "Total Value", value: totalCost, suffix: "€" },
      totalItems: { label: "Total Items", value: totalItems },
      colors: { label: "Colors", value: colors.length > 0 ? colors : "-", isColor: true },
    };
  }

  public hasCategories() {
    return this.items.size > 0;
  }

  public getPreparedForDatabase(): PreparedForDatabaseOutfit {
    return {
      uuid: this.uuid,
      name: this.name,
      imageURL: this.imageURL ?? null,
      data: Array.from(this.items, ([o, i]) => ({ category: o, itemIDs: i.map((item) => item.uuid) })),
      bookmarked: this.bookmarked ? 1 : 0,
      tags: this.tags && this.tags.length > 0 ? this.tags : null,
    };
  }

  public getItemImageURLs() {
    const imageUrls = Array.from(this.items.values())
      .flatMap((c) => Array.from(c.values()).flatMap((i) => i.getImage()))
      .filter((url): url is string => !!url);
    return imageUrls.length > 0 ? imageUrls : undefined;
  }

  public getItemImagePreviews(): Array<ItemImagePreview> {
    const items = Array.from(this.items.values()).flat();
    return items.map((item) => {
      const preview: ItemImagePreview = { uuid: item.uuid, name: item.name, imageURL: item.image ?? null };
      return preview;
    });
  }

  public setPlannedDate(date?: Date) {
    if (!date) return;
    this.planned?.length ? this.planned.push(date) : (this.planned = [date]);
  }

  public getPlannedDate() {
    return this.planned;
  }

  public removePlannedDate(date: Date) {
    this.planned = this.planned?.filter((d) => d !== date);
  }

  public hasPlannedDates() {
    return !this.planned || this.planned.length !== 0;
  }

  public isBookmarked(): boolean {
    return this.bookmarked === 1 ? true : false;
  }

  public toggleBookmark() {
    this.bookmarked = this.isBookmarked() ? 0 : 1;
  }

  public addTags(value: Array<string>) {
    this.tags = value;
  }

  public updateWearDetails(date?: Date) {
    this.wears = this.wears + 1;
    if (!date) return;
    if (!this.lastWorn || this.lastWorn < date) {
      this.lastWorn = date;
    }
    this.getAllItems().map((item) => item.updateWearDetails(date));
  }

  public getPlannedDatesPrettyfied() {
    return this.planned?.map((date) => {
      const dateString = date.toLocaleDateString(undefined, {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      return { localeString: dateString, origin: date };
    });
  }
}
