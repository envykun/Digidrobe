import { createQuery, outfitPlannedQuery, wardrobeQuery, wardrobeWearsQuery } from "./database.queries";

export interface TableDefinitionQuery {
  name: string;
  query: string;
}

export enum TableNames {
  WARDROBE = "wardrobe",
  BRANDS = "brands",
  BOUGHT_FROM = "stores",
  CATEGORIES = "categories",
  COLORS = "colors",
  FABRICS = "fabrics",
  WARDROBE_CATEGORY = "wardrobe_category",
  WARDROBE_COLOR = "wardrobe_color",
  WARDROBE_FABRIC = "wardrobe_fabric",
  OUTFITS = "outfits",
  OUTFIT_CATEGORY_WARDROBE = "outfit_category_wardrobe",
  PLANNED_OUTFITS = "planned_outfits",
  WARDROBE_WEARS = "wardrobe_wears",
  OUTFIT_WEARS = "outfit_wears",
}

export const tableDefinitionQuery: Array<TableDefinitionQuery> = [
  {
    name: TableNames.WARDROBE,
    query: createQuery(wardrobeQuery),
  },
  {
    name: TableNames.CATEGORIES,
    query: "id INTEGER NOT NULL PRIMARY KEY, label TEXT NOT NULL UNIQUE",
  },
  {
    name: TableNames.WARDROBE_CATEGORY,
    query: "itemID TEXT NOT NULL REFERENCES wardrobe(uuid), propID INTEGER NOT NULL REFERENCES categories(id), UNIQUE(itemID, propID)",
  },
  {
    name: TableNames.BRANDS,
    query: "id INTEGER NOT NULL PRIMARY KEY, label TEXT NOT NULL UNIQUE",
  },
  {
    name: TableNames.FABRICS,
    query: "id INTEGER NOT NULL PRIMARY KEY, label TEXT NOT NULL UNIQUE",
  },
  {
    name: TableNames.WARDROBE_FABRIC,
    query: "itemID TEXT NOT NULL REFERENCES wardrobe(uuid), propID INTEGER NOT NULL REFERENCES fabrics(id), UNIQUE(itemID, propID)",
  },
  {
    name: TableNames.BOUGHT_FROM,
    query: "id INTEGER NOT NULL PRIMARY KEY, label TEXT NOT NULL UNIQUE",
  },
  {
    name: TableNames.COLORS,
    query: "id INTEGER NOT NULL PRIMARY KEY, label TEXT NOT NULL UNIQUE",
  },
  {
    name: TableNames.WARDROBE_COLOR,
    query: "itemID TEXT NOT NULL REFERENCES wardrobe(uuid), propID INTEGER NOT NULL REFERENCES colors(id), UNIQUE(itemID, propID)",
  },
  {
    name: TableNames.OUTFITS,
    query: "uuid TEXT NOT NULL PRIMARY KEY, name TEXT NOT NULL, imageURL TEXT, bookmarked INTEGER NOT NULL",
  },
  {
    name: TableNames.OUTFIT_CATEGORY_WARDROBE,
    query:
      "outfitID TEXT NOT NULL REFERENCES outfits(uuid), categoryID INTEGER NOT NULL REFERENCES categories(id), itemID TEXT NOT NULL REFERENCES wardrobe(uuid), UNIQUE(outfitID, categoryID, itemID)",
  },
  {
    name: TableNames.PLANNED_OUTFITS,
    // query: createQuery(outfitPlannedQuery),
    query: "outfitID TEXT NOT NULL REFERENCES outfits(uuid), date TEXT NOT NULL, worn INTEGER NOT NULL, UNIQUE(outfitID, date)",
  },
  {
    name: TableNames.WARDROBE_WEARS,
    // query: createQuery(wardrobeWearsQuery),
    query: "itemID TEXT NOT NULL REFERENCES wardrobe(uuid), date TEXT NOT NULL, UNIQUE(itemID, date)",
  },
];

export const initBaseData = {
  baseCategories: ["Head", "UpperBody", "LowerBody", "Feet", "Accessoirs", "NoCategory"],
};
