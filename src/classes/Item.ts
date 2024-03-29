import { DetailProps } from "@Components/Detail/Detail";
import { DetailInputProps, InputType } from "@Components/Inputs/DetailInput";
import { BaseCategories, BaseCategory } from "@Database/constants";
import { i18n } from "@Database/i18n/i18n";
import { calculateCostPerWear } from "@DigiUtils/helperFunctions";
import { GenericBottomSheetItem } from "@Models/Generic";
import { ItemMetadata } from "@Models/Item";
import { KeyboardTypeOptions } from "react-native";

export class Item implements ItemMetadata {
  uuid: string;
  name: string;
  wears: number;
  lastWorn?: Date;
  cost?: number;
  category?: Array<string>;
  baseCategory: BaseCategory;
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
    baseCategory,
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
    this.name =
      name && name !== ""
        ? name
        : this.brand && this.model
        ? `${this.brand} ${this.model}`
        : "Untitled";
    this.wears = wears;
    this.lastWorn = lastWorn;
    this.cost = cost;
    this.category = category;
    this.baseCategory = baseCategory;
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
        label: i18n.t("item.cost"),
        value: this.cost?.toString(),
        editable: true,
        inputType: "default",
        setter: (value: string) => {
          if (!value || Array.isArray(value)) return;
          this.cost = parseFloat(value);
        },
        keyboardType: "number-pad",
        detailProps: { suffix: " €" },
      },
      {
        key: "costPerWear",
        label: i18n.t("item.costPerWear"),
        editable: false,
        value:
          this.cost && this.wears > 0
            ? calculateCostPerWear(this.cost, this.wears)
            : this.cost?.toString(),
        detailProps: { suffix: " €" },
      },
      {
        key: "category",
        label: i18n.t("item.categories"),
        value: this.category,
        editable: true,
        setter: (value: GenericBottomSheetItem[]) => {
          if (!value || !Array.isArray(value)) return;
          this.category = value.map((v) => v.label);
        },
        inputType: "multi-select",
      },
      {
        key: "baseCategory",
        label: i18n.t("item.categoryGroup"),
        value: BaseCategories[this.baseCategory],
        editable: true,
        setter: (value: GenericBottomSheetItem) => {
          if (!value || Array.isArray(value)) return;
          this.baseCategory = value.id as unknown as BaseCategory;
        },
        inputType: "select",
      },
      {
        key: "brand",
        label: i18n.t("item.brand"),
        value: this.brand,
        editable: true,
        setter: (value: string) => {
          if (!value || Array.isArray(value)) return;
          this.brand = value?.trim();
        },
      },
      {
        key: "model",
        label: i18n.t("item.model"),
        value: this.model,
        editable: true,
        setter: (value: string) => {
          if (!value || Array.isArray(value)) return;
          this.model = value?.trim();
        },
      },
      {
        key: "size",
        label: i18n.t("item.size"),
        value: this.size?.toString(),
        editable: true,
        setter: (value: string) => {
          if (!value || Array.isArray(value)) return;
          this.size = parseFloat(value);
        },
        keyboardType: "number-pad",
      },
      {
        key: "fabric",
        label: i18n.t("item.fabric"),
        value: this.fabric,
        editable: true,
        setter: (value: GenericBottomSheetItem[]) => {
          if (!value || !Array.isArray(value)) return;
          this.fabric = value.map((v) => v.label);
        },
        inputType: "multi-select",
      },
      {
        key: "bought",
        label: i18n.t("item.bought"),
        value: this.bought,
        isDate: true,
        editable: true,
        setter: (value: string) => {
          if (!value || Array.isArray(value)) return;
          this.bought = value;
        },
        inputType: "date",
      },
      {
        key: "boughtFrom",
        label: i18n.t("item.boughtFrom"),
        value: this.boughtFrom,
        editable: true,
        setter: (value: string) => {
          if (!value || Array.isArray(value)) return;
          this.boughtFrom = value.trim();
        },
      },
      {
        key: "color",
        label: i18n.t("item.color"),
        value: this.color,
        editable: true,
        setter: (value: GenericBottomSheetItem[]) => {
          if (!value || !Array.isArray(value)) return;
          this.color = value.map((v) => v.label);
        },
        inputType: "multi-select-color",
      },
      {
        key: "notes",
        label: i18n.t("item.notes"),
        value: this.notes,
        editable: true,
        setter: (value: string) => {
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
      category:
        this.category && this.category.length > 0 ? this.category : null,
      fabric: this.fabric && this.fabric.length > 0 ? this.fabric : null,
      color: this.color && this.color.length > 0 ? this.color : null,
      favorite: this.favorite ?? 0,
      baseCategory: this.baseCategory ?? 0,
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
  setter?: (value?: any) => void;
  keyboardType?: KeyboardTypeOptions;
  detailProps?: Partial<DetailProps>;
  detailInputProps?: Partial<DetailInputProps>;
}
