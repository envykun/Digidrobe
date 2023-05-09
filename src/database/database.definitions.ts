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
}

export interface QueryType {
  key: string;
  type: "TEXT" | "INTEGER";
  params?: Array<ParamsType>;
}

export type ParamsType = "NOT NULL" | "PRIMARY KEY";

export const wardrobeQuery: Array<QueryType> = [
  { key: "uuid", type: "TEXT", params: ["NOT NULL", "PRIMARY KEY"] },
  { key: "name", type: "TEXT", params: ["NOT NULL"] },
  { key: "wears", type: "INTEGER" },
  { key: "last_worn", type: "TEXT" },
  { key: "cost", type: "INTEGER" },
  { key: "brand", type: "INTEGER" },
  { key: "model", type: "TEXT" },
  { key: "size", type: "INTEGER" },
  { key: "bought_date", type: "TEXT" },
  { key: "bought_from", type: "INTEGER" },
  { key: "notes", type: "TEXT" },
  { key: "imageURL", type: "TEXT" },
  { key: "favorite", type: "INTEGER", params: ["NOT NULL"] },
];

export const createQuery = (queryDefinition: Array<QueryType>): string => {
  return queryDefinition
    .map((col) => {
      return `${col.key} ${col.type} ${col.params?.join(" ")}`;
    })
    .join(", ");
};

export const tableDefinitionQuery: Array<TableDefinitionQuery> = [
  {
    name: TableNames.WARDROBE,
    query: createQuery(wardrobeQuery),
    // query:
    // "uuid TEXT NOT NULL PRIMARY KEY, name TEXT NOT NULL, wears INTEGER, last_worn TEXT, cost INTEGER, brand INTEGER, model TEXT, size INTEGER, bought_date TEXT, bought_from INTEGER, notes TEXT, imageURL TEXT",
  },
  {
    name: TableNames.CATEGORIES,
    query: "id INTEGER NOT NULL PRIMARY KEY, label TEXT NOT NULL UNIQUE",
  },
  {
    name: TableNames.WARDROBE_CATEGORY,
    query: "itemID TEXT NOT NULL REFERENCES wardrobe(uuid), propID INTEGER NOT NULL REFERENCES categories(id)",
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
    query: "itemID TEXT NOT NULL REFERENCES wardrobe(uuid), propID INTEGER NOT NULL REFERENCES fabrics(id)",
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
    query: "itemID TEXT NOT NULL REFERENCES wardrobe(uuid), propID INTEGER NOT NULL REFERENCES colors(id)",
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
    query: "outfitID TEXT NOT NULL REFERENCES outfits(uuid), date TEXT NOT NULL, UNIQUE(outfitID, date)",
  },
];

export const initBaseData = {
  baseCategories: ["Head", "UpperBody", "LowerBody", "Feet", "Accessoirs", "NoCategory"],
};
