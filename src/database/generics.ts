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
  type: "categories" | "colors" | "fabrics"
) => {
  let junctionTable: string;
  let tableName: string;

  switch (type) {
    case "categories":
      junctionTable = TableNames.WARDROBE_CATEGORY;
      tableName = TableNames.CATEGORIES;
      break;
    case "colors":
      junctionTable = TableNames.WARDROBE_COLOR;
      tableName = TableNames.COLORS;
      break;
    case "fabrics":
      junctionTable = TableNames.WARDROBE_FABRIC;
      tableName = TableNames.FABRICS;
      break;
    default:
      return;
  }

  return new Promise<any>((resolve, reject) => {
    const query = `SELECT label FROM ${junctionTable} INNER JOIN ${TableNames.WARDROBE} ON ${TableNames.WARDROBE}.uuid = ${junctionTable}.itemID INNER JOIN ${tableName} ON ${tableName}.id = ${junctionTable}.propID WHERE ${TableNames.WARDROBE}.uuid = "${itemID}"`;
    db.transaction((tx) => {
      tx.executeSql(
        query,
        undefined,
        (_txCb, res) => resolve(res.rows._array.length > 0 ? res.rows._array.map((v) => v.label) : null),
        (_txCb, error) => {
          console.log("error", error);
          reject(error);
          return true;
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
