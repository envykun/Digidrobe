import { ItemMetadata } from "@Models/Item";

export class Item implements ItemMetadata {
  private id: string;
  name?: string;
  wears?: number;
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

  constructor({
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
    savedOutfits,
    image,
  }: ItemMetadata) {
    this.id = "id;";
    this.name = name;
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
  }

  public getConstructorKeys(): Array<ConstructorInput> {
    return [
      {
        key: "cost",
        label: "Cost",
        setter: (value) => {
          this.cost = parseFloat(value);
        },
      },
      {
        key: "category",
        label: "Categories",
        setter: (value) => {
          this.category = [value];
        },
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
          this.size = parseFloat(value);
        },
      },
      {
        key: "fabric",
        label: "Fabric",
        setter: (value) => {
          this.fabric = [value];
        },
      },
      {
        key: "bought",
        label: "Bought",
        setter: (value) => {
          this.bought = new Date(value);
        },
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
}

interface ConstructorInput {
  key: keyof ItemMetadata;
  label: string;
  placeholder?: string;
  inputType?: string;
  setter: (value: string) => void;
}
