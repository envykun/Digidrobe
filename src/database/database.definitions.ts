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
  STORES = "stores",
  TAGS = "Tags",
  WARDROBE_CATEGORY = "wardrobe_category",
  WARDROBE_COLOR = "wardrobe_color",
  WARDROBE_FABRIC = "wardrobe_fabric",
  WARDROBE_WEARS = "wardrobe_wears",
  OUTFITS = "outfits",
  PLANNED_OUTFITS = "planned_outfits",
  OUTFIT_TAGS = "outfit_tags",
  OUTFIT_WARDROBE = "outfit_wardrobe",
}

export const tableDefinitionQuery: Array<TableDefinitionQuery> = [
  {
    name: TableNames.WARDROBE,
    query: createQuery(wardrobeQuery),
  },
  {
    name: TableNames.OUTFITS,
    query: "uuid TEXT NOT NULL PRIMARY KEY, name TEXT NOT NULL, imageURL TEXT, bookmarked INTEGER NOT NULL",
  },
  {
    name: TableNames.CATEGORIES,
    query: "id INTEGER NOT NULL PRIMARY KEY, label TEXT NOT NULL UNIQUE",
  },
  {
    name: TableNames.TAGS,
    query: "id INTEGER NOT NULL PRIMARY KEY, label TEXT NOT NULL UNIQUE",
  },
  {
    name: TableNames.COLORS,
    query: "id INTEGER NOT NULL PRIMARY KEY, label TEXT NOT NULL UNIQUE",
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
    name: TableNames.BOUGHT_FROM,
    query: "id INTEGER NOT NULL PRIMARY KEY, label TEXT NOT NULL UNIQUE",
  },
  {
    name: TableNames.WARDROBE_CATEGORY,
    query: "itemID TEXT NOT NULL REFERENCES wardrobe(uuid), propID INTEGER NOT NULL REFERENCES categories(id), UNIQUE(itemID, propID)",
  },
  {
    name: TableNames.WARDROBE_FABRIC,
    query: "itemID TEXT NOT NULL REFERENCES wardrobe(uuid), propID INTEGER NOT NULL REFERENCES fabrics(id), UNIQUE(itemID, propID)",
  },
  {
    name: TableNames.WARDROBE_WEARS,
    // query: createQuery(wardrobeWearsQuery),
    query: "itemID TEXT NOT NULL REFERENCES wardrobe(uuid), date TEXT NOT NULL, UNIQUE(itemID, date)",
  },
  {
    name: TableNames.WARDROBE_COLOR,
    query: "itemID TEXT NOT NULL REFERENCES wardrobe(uuid), propID INTEGER NOT NULL REFERENCES colors(id), UNIQUE(itemID, propID)",
  },
  {
    name: TableNames.OUTFIT_WARDROBE,
    query: "outfitID TEXT NOT NULL REFERENCES outfits(uuid), itemID TEXT NOT NULL REFERENCES wardrobe(uuid), UNIQUE(outfitID, itemID)",
  },
  {
    name: TableNames.OUTFIT_TAGS,
    query: "itemID TEXT NOT NULL REFERENCES outfits(uuid), propID INTEGER NOT NULL REFERENCES tags(id), UNIQUE(itemID, propID)",
  },
  {
    name: TableNames.PLANNED_OUTFITS,
    // query: createQuery(outfitPlannedQuery),
    query: "outfitID TEXT NOT NULL REFERENCES outfits(uuid), date TEXT NOT NULL, worn INTEGER NOT NULL, UNIQUE(outfitID, date)",
  },
];
