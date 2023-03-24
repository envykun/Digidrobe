import { IItem } from "@Models/Item";

export class Item {
  id: string;
  name: string;
  wears?: number;
  cost?: number;
  lastWorn?: Date;
  bought?: Date;
  category: any;
  savedOutfits?: Array<any>;

  constructor({ name, id }: IItem) {
    this.id = id;
    this.name = name;
  }
}
