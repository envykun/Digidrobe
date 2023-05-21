import { DetailProps } from "@Components/Detail/Detail";
import { DetailInputProps, InputType } from "@Components/Inputs/DetailInput";
import { calculateCostPerWear } from "@DigiUtils/helperFunctions";
import { ItemMetadata } from "@Models/Item";
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
  bought?: string;
  boughtFrom?: string;
  notes?: string;
  image?: string;
  color?: Array<string>;
  favorite?: number;
  refresh?: () => void;

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
    console.log("SETTING IMAGE", imgURL);
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
        value: this.cost?.toString(),
        editable: true,
        inputType: "default",
        setter: (value) => {
          if (!value || Array.isArray(value)) return;
          this.cost = parseFloat(value);
        },
        keyboardType: "number-pad",
        detailProps: { suffix: " €" },
      },
      {
        key: "costPerWear",
        label: "Cost per wear",
        editable: false,
        value: this.cost && this.wears > 0 ? calculateCostPerWear(this.cost, this.wears) : this.cost?.toString(),
        detailProps: { suffix: " €" },
      },
      {
        key: "category",
        label: "Categories",
        value: this.category,
        editable: true,
        setter: (value) => {
          if (!value || !Array.isArray(value)) return;
          this.category = value;
        },
        inputType: "multi-select",
      },
      {
        key: "brand",
        label: "Brand",
        value: this.brand,
        editable: true,
        setter: (value) => {
          if (!value || Array.isArray(value)) return;
          this.brand = value?.trim();
        },
      },
      {
        key: "model",
        label: "Model",
        value: this.model,
        editable: true,
        setter: (value) => {
          if (!value || Array.isArray(value)) return;
          this.model = value?.trim();
        },
      },
      {
        key: "size",
        label: "Size",
        value: this.size?.toString(),
        editable: true,
        setter: (value) => {
          if (!value || Array.isArray(value)) return;
          this.size = parseFloat(value);
        },
        keyboardType: "number-pad",
      },
      {
        key: "fabric",
        label: "Fabric",
        value: this.fabric,
        editable: true,
        setter: (value) => {
          if (!value || !Array.isArray(value)) return;
          this.fabric = value;
        },
        inputType: "multi-select",
      },
      {
        key: "bought",
        label: "Bought",
        value: this.bought,
        isDate: true,
        editable: true,
        setter: (value) => {
          if (!value || Array.isArray(value)) return;
          this.bought = value;
        },
        inputType: "date",
      },
      {
        key: "boughtFrom",
        label: "Bought from",
        value: this.boughtFrom,
        editable: true,
        setter: (value) => {
          if (!value || Array.isArray(value)) return;
          this.boughtFrom = value.trim();
        },
      },
      {
        key: "color",
        label: "Color",
        value: this.color,
        editable: true,
        setter: (value) => {
          if (!value || !Array.isArray(value)) return;
          this.color = value;
        },
        inputType: "multi-select",
      },
      {
        key: "notes",
        label: "Notes",
        value: this.notes,
        editable: true,
        setter: (value) => {
          if (!value || Array.isArray(value)) return;
          this.notes = value.trim();
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
      category: this.category && this.category.length > 0 ? this.category : null,
      fabric: this.fabric && this.fabric.length > 0 ? this.fabric : null,
      color: this.color && this.color.length > 0 ? this.color : null,
      favorite: this.favorite ?? 0,
    };
  }

  public isFavorite(): boolean {
    return this.favorite === 1 ? true : false;
  }

  public toggleFavorite() {
    this.favorite = this.isFavorite() ? 0 : 1;
  }

  public updateWearDetails(date?: Date) {
    this.wears = this.wears + 1;
    if (!date) return;
    if (!this.lastWorn || this.lastWorn < date) {
      this.lastWorn = date;
    }
  }
}

interface ConstructorInput {
  key: string & keyof ItemMetadata;
  label: string;
  value?: string | Array<string>;
  isDate?: boolean;
  editable?: boolean;
  placeholder?: string;
  inputType?: InputType;
  setter?: (value?: string | Array<string>) => void;
  keyboardType?: KeyboardTypeOptions;
  detailProps?: Partial<DetailProps>;
  detailInputProps?: Partial<DetailInputProps>;
}
