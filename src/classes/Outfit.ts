import { OutfitCategoryProp } from "@Components/Box/OutfitCategory";
import { Category } from "@Models/Category";
import { IOutfit } from "@Models/Outfit";
import { Item } from "./Item";

export class Outfit {
  uuid: string;
  categories: Map<string, OutfitCategoryProp>;
  imageURL?: string;
  name?: string;
  refresh?: () => void;

  constructor({ uuid, refresh, imageURL, name, categories }: IOutfit) {
    this.uuid = uuid;
    this.refresh = refresh;
    this.imageURL = imageURL;
    this.name = name;
    this.categories = categories ?? new Map<string, OutfitCategoryProp>();
  }

  public getCategoryById(id: string) {
    return this.categories.get(id);
  }

  public getCategoryIds() {
    return Array.from(this.categories.keys());
  }

  public getCategories() {
    return Array.from(this.categories.values());
  }

  public addCategory(value: Category) {
    this.categories.set(value.id, {
      category: value,
      items: new Map(),
      deleteCategory: () => this.removeCategory(value),
    });
    this.refresh && this.refresh();
  }
  public removeCategory(value: Category) {
    this.categories.delete(value.id);
    this.refresh && this.refresh();
  }

  public addItemToCategory(categoryId: string, value: Item) {
    const category = this.getCategoryById(categoryId);
    category && this.categories.set(categoryId, { ...category, items: category.items.set(value.uuid, value) });
    this.refresh && this.refresh();
  }
  public removeItemFromCategory(categoryId: string, itemId: string) {
    const category = this.getCategoryById(categoryId);
    category && category.items.delete(itemId);
    this.refresh && this.refresh();
  }
  public getItemIdsByCategory(categoryId: string) {
    const category = this.getCategoryById(categoryId);
    return category ? Array.from(category?.items.keys()) : [];
  }
  public getItemsByCategory(categoryId: string) {
    return Array.from(this.getCategoryById(categoryId)?.items.values() ?? []);
  }

  public getOutfitStatistic() {
    const totalCost = this.getCategories().reduce((acc, curr) => {
      const thisAcc = Array.from(curr.items.values()).reduce((accItem, currItem) => accItem + (currItem.cost ?? 0), 0);
      return acc + thisAcc;
    }, 0);
    const totalItems = this.getCategories().reduce((acc, curr) => acc + curr.items.size, 0);
    const totalWears = this.getCategories().reduce((acc, curr) => {
      const thisAcc = Array.from(curr.items.values()).reduce((accItem, currItem) => accItem + (currItem.wears ?? 0), 0);
      return acc + thisAcc;
    }, 0);
    return [
      { label: "Total Cost", value: totalCost, suffix: "€" },
      { label: "Total Items", value: totalItems },
      { label: "Total Wears", value: totalWears },
    ];
  }

  public hasCategories() {
    return this.categories.size > 0;
  }

  public getPreparedForDatabase() {
    return {
      uuid: this.uuid,
      name: this.name ?? "Default Name",
      imageURL: this.imageURL ?? null,
      data: Array.from(this.categories.keys())
        .map((key) => {
          const itemKeys = this.categories.get(key)?.items;
          const values = itemKeys ? Array.from(itemKeys.keys()) : [];
          return { categoryID: key, itemIDs: values };
        })
        .filter((c) => c.itemIDs.length > 0),
    };
  }

  public getItemImageURLs() {
    const imageUrls = Array.from(this.categories.values())
      .flatMap((c) => Array.from(c.items.values()).flatMap((i) => i.getImage()))
      .filter((url): url is string => !!url);
    return imageUrls.length > 0 ? imageUrls : undefined;
  }
}
