export interface QueryType {
  key: string;
  type: "TEXT" | "INTEGER";
  params?: Array<ParamsType>;
}
export type ParamsType = "NOT NULL" | "PRIMARY KEY" | any;

export const wardrobeQuery: Array<QueryType> = [
  { key: "uuid", type: "TEXT", params: ["NOT NULL", "PRIMARY KEY"] },
  { key: "name", type: "TEXT", params: ["NOT NULL"] },
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

export const wardrobeWearsQuery: Array<QueryType> = [
  { key: "itemID", type: "TEXT", params: ["NOT NULL", "REFERENCES wardrobe(uuid)"] },
  { key: "date", type: "TEXT", params: ["NOT NULL", "UNIQUE(itemID, date)"] },
];

export const outfitPlannedQuery: Array<QueryType> = [
  { key: "outfitID", type: "TEXT", params: ["NOT NULL", "REFERENCES outfits(uuid)"] },
  { key: "date", type: "TEXT", params: ["NOT NULL"] },
  { key: "worn", type: "INTEGER", params: ["NOT NULL,", "UNIQUE(itemID, date)"] },
];

export const createQuery = (queryDefinition: Array<QueryType>): string => {
  return queryDefinition
    .map((col) => {
      return `${col.key} ${col.type} ${col.params?.join(" ")}`;
    })
    .join(", ");
};
