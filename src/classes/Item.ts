import { InputType } from "@Components/Inputs/DetailInput";
import { ItemMetadata } from "@Models/Item";
import { randomUUID } from "expo-crypto";
import { KeyboardTypeOptions } from "react-native";

export class Item implements ItemMetadata {
  uuid: string;
  name: string;
  wears: number;
  lastWorn?: Date;
  cost?: number;
  category?: Array<string>;
  brand?: string;
  model?: string;
  size?: number;
  fabric?: Array<string>;
  bought?: Date;
  boughtFrom?: string;
  notes?: string;
  savedOutfits?: Array<any>;
  image?: string;
  color?: Array<string>;

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
          this.category ? this.category.push(value) : (this.category = [value]);
        },
        inputType: "multi-select",
        data: ["Hiose", "jacke", "ehsel"],
      },
      {
        key: "brand",
        label: "Brand",
        setter: (value) => {
          this.brand = value;
        },
      },
      {
        key: "model",
        label: "Model",
        setter: (value) => {
          this.model = value;
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
          this.bought = new Date(value);
        },
        inputType: "date",
      },
      {
        key: "boughtFrom",
        label: "Bought from",
        setter: (value) => {
          this.boughtFrom = value;
        },
      },
      {
        key: "notes",
        label: "Notes",
        setter: (value) => {
          this.notes = value;
        },
      },
    ];
  }

  public getDBParsedItem() {
    return {
      uuid: this.uuid,
      name: this.name,
      wears: this.wears ?? null,
      lastWorn: this.lastWorn?.toString() ?? null,
      cost: this.cost ?? null,
      brand: this.brand ?? null,
      model: this.model ?? null,
      size: this.size ?? null,
      bought: this.bought?.toDateString() ?? null,
      boughtFrom: this.boughtFrom ?? null,
      notes: this.notes ?? null,
      image: this.image ?? null,
      category: this.category ?? null,
      fabric: this.fabric ?? null,
      color: this.color ?? null,
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
}

interface ConstructorInput {
  key: keyof ItemMetadata;
  label: string;
  placeholder?: string;
  inputType?: InputType;
  data?: Array<string>;
  setter: (value?: string) => void;
  keyboardType?: KeyboardTypeOptions;
}
