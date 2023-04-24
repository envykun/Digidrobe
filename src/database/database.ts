import * as SQLite from "expo-sqlite";
import { TableNames, initBaseData, tableDefinitionQuery } from "./database.definitions";
import { ItemDataResponse, ItemMetadata } from "@Models/Item";
import { Item } from "src/classes/Item";
import { Category } from "@Models/Category";
import TestData from "./TestData.json";
import { formatTimeAgo } from "@DigiUtils/helperFunctions";

export const initDatabase = async () => {
  const db = SQLite.openDatabase("digidrobe.db");
  tableDefinitionQuery.forEach(async (definition) => await createTable(db, definition.name, definition.query));
  await createMultipleValues(db, initBaseData.baseCategories, TableNames.CATEGORIES);
  return db;
};

export const getDatabase = () => {
  return SQLite.openDatabase("digidrobe.db");
};

export const createTable = async (db: SQLite.WebSQLDatabase, tableName: string, definitionQuery: string) => {
  db.transaction((tx) => {
    tx.executeSql(`CREATE TABLE IF NOT EXISTS ${tableName} (${definitionQuery})`);
  });
};

// CRUD for Wardrobe-items

export const createItem = async (db: SQLite.WebSQLDatabase, item: Item) => {
  const dbParsedItem = item.getDBParsedItem();

  dbParsedItem.category &&
    (await createMultipleValues(db, dbParsedItem.category, TableNames.CATEGORIES, item.uuid, TableNames.WARDROBE_CATEGORY));
  dbParsedItem.fabric && (await createMultipleValues(db, dbParsedItem.fabric, TableNames.FABRICS, item.uuid, TableNames.WARDROBE_FABRIC));
  dbParsedItem.color && (await createMultipleValues(db, dbParsedItem.color, TableNames.COLORS, item.uuid, TableNames.WARDROBE_COLOR));

  const brand = dbParsedItem.brand ? await createValueInTable(db, dbParsedItem.brand, TableNames.BRANDS) : null;
  const bought_from = dbParsedItem.boughtFrom ? await createValueInTable(db, dbParsedItem.boughtFrom, TableNames.BOUGHT_FROM) : null;

  db.transaction((tx) => {
    tx.executeSql(
      `INSERT INTO ${TableNames.WARDROBE} (uuid, name, wears, last_worn, cost, brand, model, size, bought_date, bought_from, notes, imageURL) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        dbParsedItem.uuid,
        dbParsedItem.name,
        dbParsedItem.wears,
        dbParsedItem.lastWorn,
        dbParsedItem.cost,
        brand,
        dbParsedItem.model,
        dbParsedItem.size,
        dbParsedItem.bought,
        bought_from,
        dbParsedItem.notes,
        dbParsedItem.image,
      ],
      (txObj, resultSet) => console.log("Success", resultSet),
      (txObj, error) => {
        console.log("Error", txObj, error);
        return false;
      }
    );
  });
};

export const getWardrobeItems = (db: SQLite.WebSQLDatabase, setWardrobe: React.Dispatch<React.SetStateAction<Item[]>>) => {
  db.transaction((tx) =>
    tx.executeSql(
      "SELECT * FROM wardrobe",
      [],
      async (txObj, resultSet) => {
        const wardrobe = await Promise.all(
          resultSet.rows._array.map(async (item: ItemDataResponse) => {
            return new Item({
              uuid: item.uuid,
              name: item.name,
              wears: item.wears,
              lastWorn: item.last_worn ?? undefined,
              cost: item.cost ?? undefined,
              brand: await getValueById(db, item.brand, TableNames.BRANDS),
              model: item.model ?? undefined,
              size: item.size ?? undefined,
              bought: item.bought_date ?? undefined,
              boughtFrom: await getValueById(db, item.bought_from, TableNames.BOUGHT_FROM),
              notes: item.notes ?? undefined,
              image: item.imageURL ?? undefined,
              category: (await getFromJunctionTableResolved(db, item.uuid, "categories")) ?? undefined,
              fabric: (await getFromJunctionTableResolved(db, item.uuid, "fabrics")) ?? undefined,
              color: (await getFromJunctionTableResolved(db, item.uuid, "colors")) ?? undefined,
            });
          })
        );
        setWardrobe(wardrobe.sort((a, b) => a.name.localeCompare(b.name)));
      },
      (error) => {
        console.log("Error getting wardrobe items: ", error);
        return true;
      }
    )
  );
};

// CRUD Category/Brand/Store/Fabric
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

export const getCategories = (db: SQLite.WebSQLDatabase, setCategories: React.Dispatch<React.SetStateAction<Array<Category>>>) => {
  // return new Promise<Array<any>>((resolve, reject) =>
  db.transaction((tx) =>
    tx.executeSql(
      `SELECT * FROM ${TableNames.CATEGORIES}`,
      [],
      (_txCb, res) => setCategories(res.rows._array.sort((a, b) => a.label.localeCompare(b.label))),
      (_txCb, error) => {
        console.log("error", error);
        // reject(error);
        return true;
      }
    )
  );
  // );
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
    console.log("ITEM", i);
    const item = new Item({
      uuid: i.uuid,
      bought: i.bought ?? undefined,
      boughtFrom: i.boughtFrom,
      brand: i.brand,
      category: i.category,
      color: i.color ?? undefined,
      cost: i.cost,
      fabric: i.fabric,
      image: i.image ?? undefined,
      lastWorn: i.lastWorn ?? undefined,
      model: i.model,
      name: i.name,
      notes: i.notes ?? undefined,
      size: i.size ?? undefined,
      wears: i.wears,
    });
    await createItem(db, item);
  });
};

export const wipeOutfits = (db: SQLite.WebSQLDatabase) => {
  db.transaction((tx) => tx.executeSql(`DELETE FROM ${TableNames.OUTFITS}`));
  db.transaction((tx) => tx.executeSql(`DELETE FROM ${TableNames.OUTFIT_CATEGORY_WARDROBE}`));
};
