import { InputType } from "@Components/Inputs/DetailInput";
import { ItemMetadata } from "@Models/Item";
import { randomUUID } from "expo-crypto";
import { KeyboardTypeOptions } from "react-native";

export class Item implements ItemMetadata {
  uuid: string;
  name: string;
  wears: number;
  lastWorn?: string;
  cost?: number;
  category?: Array<string>;
  brand?: string;
  model?: string;
  size?: number;
  fabric?: Array<string>;
  bought?: string;
  boughtFrom?: string;
  notes?: string;
  savedOutfits?: Array<any>;
  image?: string;
  color?: Array<string>;
  favorite?: number;

  constructor({
    uuid,
    name,
    brand,
    wears = 0,
    lastWorn,
    category,
    cost,
    model,
    size,
    fabric,
    bought,
    boughtFrom,
    notes,
    image,
    color,
    savedOutfits,
    favorite,
  }: ItemMetadata) {
    this.uuid = uuid;
    this.name = name && name !== "" ? name : this.brand && this.model ? `${this.brand} ${this.model}` : "Untitled";
    this.wears = wears;
    this.lastWorn = lastWorn;
    this.cost = cost;
    this.category = category;
    this.brand = brand;
    this.model = model;
    this.size = size;
    this.fabric = fabric;
    this.bought = bought;
    this.boughtFrom = boughtFrom;
    this.notes = notes;
    this.image = image;
    this.color = color;
    this.favorite = favorite;
  }

  public setImage(imgURL?: string) {
    this.image = imgURL;
  }

  public getImage() {
    return this.image;
  }

  public getConstructorKeys(): Array<ConstructorInput> {
    return [
      {
        key: "cost",
        label: "Cost",
        inputType: "default",
        setter: (value) => {
          if (!value) return;
          this.cost = parseFloat(value);
        },
        keyboardType: "number-pad",
      },
      {
        key: "category",
        label: "Categories",
        setter: (value) => {
          if (!value) return;
          this.category ? this.category.push(value.trim()) : (this.category = [value.trim()]);
        },
        inputType: "multi-select",
      },
      {
        key: "brand",
        label: "Brand",
        setter: (value) => {
          this.brand = value?.trim();
        },
      },
      {
        key: "model",
        label: "Model",
        setter: (value) => {
          this.model = value?.trim();
        },
      },
      {
        key: "size",
        label: "Size",
        setter: (value) => {
          if (!value) return;
          this.size = parseFloat(value);
        },
        keyboardType: "number-pad",
      },
      {
        key: "fabric",
        label: "Fabric",
        setter: (value) => {
          if (!value) return;
          this.fabric = value.split(",").map((v) => v.trim());
        },
      },
      {
        key: "bought",
        label: "Bought",
        setter: (value) => {
          if (!value) return;
          this.bought = value;
        },
        inputType: "date",
      },
      {
        key: "boughtFrom",
        label: "Bought from",
        setter: (value) => {
          this.boughtFrom = value?.trim();
        },
      },
      {
        key: "notes",
        label: "Notes",
        setter: (value) => {
          this.notes = value?.trim();
        },
      },
    ];
  }

  public getDBParsedItem() {
    return {
      uuid: this.uuid,
      name: this.name.trim(),
      wears: this.wears ?? null,
      lastWorn: this.lastWorn ?? null,
      cost: this.cost ?? null,
      brand: this.brand ?? null,
      model: this.model ?? null,
      size: this.size ?? null,
      bought: this.bought ?? null,
      boughtFrom: this.boughtFrom ?? null,
      notes: this.notes ?? null,
      image: this.image ?? null,
      category: this.category ?? null,
      fabric: this.fabric ?? null,
      color: this.color ?? null,
      favorite: this.favorite ?? 0,
    };
  }

  public getArrayByType(type: "category" | "fabric") {
    if (type === "category") {
      return this.category?.join("; ");
    }
    if (type === "fabric") {
      return this.fabric?.join("; ");
    }
  }

  public isFavorite(): boolean {
    return this.favorite === 1 ? true : false;
  }

  public toggleFavorite(updateDatabase: () => void): number {
    this.favorite = this.isFavorite() ? 0 : 1;
    updateDatabase();
    return this.favorite;
  }
}

interface ConstructorInput {
  key: keyof ItemMetadata;
  label: string;
  placeholder?: string;
  inputType?: InputType;
  // data?: Array<string>;
  setter: (value?: string) => void;
  keyboardType?: KeyboardTypeOptions;
}
