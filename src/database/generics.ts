import * as SQLite from "expo-sqlite";
import { TableNames } from "./database.definitions";

export const createValueInTable = async (db: SQLite.WebSQLDatabase, value: string, table: string) => {
  return new Promise<number | null>((resolve, reject) =>
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT OR IGNORE INTO ${table} (label) VALUES (?)`,
        [value],
        (_txCb, res) => resolve(res.insertId ?? null),
        (_txCb, error) => {
          console.log("error", error);
          reject(error);
          return true;
        }
      );
    })
  );
};

export const createMultipleValues = async (
  db: SQLite.WebSQLDatabase,
  values: Array<string>,
  table: string,
  itemID?: string,
  junctionTable?: string
) => {
  return Promise.all(
    values.map(async (value) => {
      const dbIds = await createValueInTable(db, value, table);
      itemID && junctionTable ? await addToJunctionTable(db, itemID, { value: value, valueTable: table }, junctionTable) : null;
      return dbIds;
    })
  );
};

export const addToJunctionTable = async (
  db: SQLite.WebSQLDatabase,
  itemID: string,
  { value, valueTable }: { value: string; valueTable: string },
  table: string
) => {
  return new Promise<SQLite.SQLResultSet | null>((resolve, reject) =>
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT OR IGNORE INTO ${table} (itemID, propID) VALUES ("${itemID}", (SELECT id FROM ${valueTable} WHERE label = "${value}"))`,
        undefined,
        (_txCb, res) => resolve(res ?? null),
        (_txCb, error) => {
          console.log("error", error);
          reject(error);
          return true;
        }
      );
    })
  );
};

export const getValueById = async (db: SQLite.WebSQLDatabase, id: number | null, table: string) => {
  return new Promise<string | undefined>((resolve, reject) =>
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT label from ${table} WHERE id = ${id}`,
        undefined,
        (_txCb, res) => resolve(res.rows._array[0]?.label ?? undefined),
        (_txCb, error) => {
          console.log("error", error);
          reject(error);
          return true;
        }
      );
    })
  );
};

export const getFromJunctionTableResolved = async (
  db: SQLite.WebSQLDatabase,
  itemID: string,
  type: "categories" | "colors" | "fabrics" | "tags"
) => {
  let junctionTable: string;
  let tableName: string;
  let mainTable: string;

  switch (type) {
    case "categories":
      junctionTable = TableNames.WARDROBE_CATEGORY;
      tableName = TableNames.CATEGORIES;
      mainTable = TableNames.WARDROBE;
      break;
    case "colors":
      junctionTable = TableNames.WARDROBE_COLOR;
      tableName = TableNames.COLORS;
      mainTable = TableNames.WARDROBE;
      break;
    case "fabrics":
      junctionTable = TableNames.WARDROBE_FABRIC;
      tableName = TableNames.FABRICS;
      mainTable = TableNames.WARDROBE;
      break;
    case "tags":
      junctionTable = TableNames.OUTFIT_TAGS;
      tableName = TableNames.TAGS;
      mainTable = TableNames.OUTFITS;
      break;
    default:
      return;
  }

  return new Promise<Array<string> | undefined>((resolve, reject) => {
    const query = `SELECT label FROM ${junctionTable} INNER JOIN ${mainTable} ON ${mainTable}.uuid = ${junctionTable}.itemID INNER JOIN ${tableName} ON ${tableName}.id = ${junctionTable}.propID WHERE ${mainTable}.uuid = "${itemID}"`;
    db.transaction((tx) => {
      tx.executeSql(
        query,
        undefined,
        (_txCb, res) => resolve(res.rows._array.length > 0 ? res.rows._array.map((v) => v.label) : undefined),
        (_txCb, error) => {
          reject(`Error fetching ${type}:` + error);
          return false;
        }
      );
    });
  });
};

export const deleteFromJunctionTable = async (db: SQLite.WebSQLDatabase, itemID: string, table: string) => {
  return new Promise<SQLite.SQLResultSet | null>((resolve, reject) =>
    db.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM ${table} WHERE itemID='${itemID}'`,
        undefined,
        (_txCb, res) => resolve(res ?? null),
        (_txCb, error) => {
          console.log("error", error);
          reject(error);
          return true;
        }
      );
    })
  );
};
