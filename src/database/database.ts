import * as SQLite from "expo-sqlite";
import { TableNames, tableDefinitionQuery } from "./database.definitions";
import { Item } from "src/classes/Item";
import TestData from "./TestData.json";
import { createItem } from "./item";
import { BaseCategory } from "./constants";

export const initDatabase = async () => {
  const db = SQLite.openDatabase("digidrobe.db");
  for (const definition of tableDefinitionQuery) {
    await createTable(db, definition.name, definition.query);
  }
  return db;
};

export const getDatabase = () => {
  return SQLite.openDatabase("digidrobe.db");
};

export const createTable = async (db: SQLite.WebSQLDatabase, tableName: string, definitionQuery: string) => {
  return new Promise<number | undefined>((resolve, reject) =>
    db.transaction(
      (tx) => {
        tx.executeSql(`CREATE TABLE IF NOT EXISTS ${tableName} (${definitionQuery})`, [], (_, res) => {
          console.log(`Creating ${tableName} successful.`);
          resolve(res.insertId);
        });
      },
      (error) => {
        reject(error);
        console.log("ERROR", error);
      }
    )
  );
};

export const getCategories = <T>(db: SQLite.WebSQLDatabase) => {
  return new Promise<Array<T>>((resolve, reject) =>
    db.transaction((tx) =>
      tx.executeSql(
        `SELECT * FROM ${TableNames.CATEGORIES}`,
        [],
        (_, res) => resolve(res.rows._array.sort((a, b) => a.label.localeCompare(b.label))),
        (_, error) => {
          reject(error);
          return true;
        }
      )
    )
  );
};

export const getFabrics = <T>(db: SQLite.WebSQLDatabase) => {
  return new Promise<Array<T>>((resolve, reject) =>
    db.transaction((tx) =>
      tx.executeSql(
        `SELECT * FROM ${TableNames.FABRICS}`,
        [],
        (_, res) => resolve(res.rows._array.sort((a, b) => a.label.localeCompare(b.label))),
        (_, error) => {
          reject(error);
          return true;
        }
      )
    )
  );
};

export const getTags = <T>(db: SQLite.WebSQLDatabase) => {
  return new Promise<Array<T>>((resolve, reject) =>
    db.transaction((tx) =>
      tx.executeSql(
        `SELECT * FROM ${TableNames.TAGS}`,
        [],
        (_, res) => resolve(res.rows._array.sort((a, b) => a.label.localeCompare(b.label))),
        (_, error) => {
          reject(error);
          return true;
        }
      )
    )
  );
};

// Delete Database
export const deleteDatabase = (db: SQLite.WebSQLDatabase) => {
  db.closeAsync();
  db.deleteAsync();
};

export const wipeDatabase = (db: SQLite.WebSQLDatabase) => {
  db.transaction((tx) => tableDefinitionQuery.forEach((table) => tx.executeSql(`DELETE FROM ${table.name}`)));
};

// Add Testdata
export const initializeTestData = (db: SQLite.WebSQLDatabase) => {
  TestData.forEach(async (i) => {
    const item = new Item({
      uuid: i.uuid,
      bought: i.bought ?? undefined,
      boughtFrom: i.boughtFrom,
      brand: i.brand,
      baseCategory: i.baseCategory as BaseCategory,
      category: i.category,
      color: i.color ?? undefined,
      cost: i.cost,
      fabric: i.fabric,
      image: i.image ?? undefined,
      model: i.model,
      name: i.name,
      notes: i.notes ?? undefined,
      size: i.size ?? undefined,
    });
    await createItem(db, item);
  });
};

export const wipeOutfits = (db: SQLite.WebSQLDatabase) => {
  db.transaction((tx) => tx.executeSql(`DELETE FROM ${TableNames.OUTFITS}`));
  db.transaction((tx) => tx.executeSql(`DELETE FROM ${TableNames.OUTFIT_WARDROBE}`));
};

export const dropOutfits = (db: SQLite.WebSQLDatabase) => {
  db.transaction((tx) => tx.executeSql(`DROP TABLE IF EXISTS ${TableNames.OUTFITS}`));
};

export const wipePlannedOutfits = (db: SQLite.WebSQLDatabase) => {
  db.transaction((tx) => tx.executeSql(`DELETE FROM ${TableNames.PLANNED_OUTFITS}`));
};
