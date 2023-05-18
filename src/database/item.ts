import { Item } from "@Classes/Item";
import * as SQLite from "expo-sqlite";
import { TableNames } from "./database.definitions";
import { ItemDataResponse } from "@Models/Item";
import { createMultipleValues, createValueInTable, getValueById, getFromJunctionTableResolved } from "./generics";

export const createItem = async (db: SQLite.WebSQLDatabase, item: Item) => {
  const dbParsedItem = item.getDBParsedItem();

  dbParsedItem.category &&
    (await createMultipleValues(db, dbParsedItem.category, TableNames.CATEGORIES, item.uuid, TableNames.WARDROBE_CATEGORY));
  dbParsedItem.fabric && (await createMultipleValues(db, dbParsedItem.fabric, TableNames.FABRICS, item.uuid, TableNames.WARDROBE_FABRIC));
  dbParsedItem.color && (await createMultipleValues(db, dbParsedItem.color, TableNames.COLORS, item.uuid, TableNames.WARDROBE_COLOR));

  const brand = dbParsedItem.brand ? await createValueInTable(db, dbParsedItem.brand, TableNames.BRANDS) : null;
  const bought_from = dbParsedItem.boughtFrom ? await createValueInTable(db, dbParsedItem.boughtFrom, TableNames.BOUGHT_FROM) : null;

  return new Promise<number | undefined>((resolve, reject) =>
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO ${TableNames.WARDROBE} (uuid, name, cost, brand, model, size, bought_date, bought_from, notes, imageURL, favorite) VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
        [
          dbParsedItem.uuid,
          dbParsedItem.name,
          dbParsedItem.cost,
          brand,
          dbParsedItem.model,
          dbParsedItem.size,
          dbParsedItem.bought,
          bought_from,
          dbParsedItem.notes,
          dbParsedItem.image,
          dbParsedItem.favorite,
        ],
        (_, res) => resolve(res.insertId),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    })
  );
};

export const getWardrobeItems = async (db: SQLite.WebSQLDatabase) => {
  return new Promise<Item[]>((resolve, reject) => {
    db.transaction(
      (tx) =>
        tx.executeSql("SELECT * FROM wardrobe", [], async (t, res) => {
          const wardrobe = await Promise.all(
            res.rows._array.map(async (item: ItemDataResponse) => {
              const wearDetails = await getWarobeWearDetails(db, item.uuid);
              return new Item({
                uuid: item.uuid,
                name: item.name,
                wears: wearDetails.wears,
                lastWorn: wearDetails.lastWorn ?? undefined,
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
                favorite: item.favorite,
              });
            })
          );
          resolve(wardrobe.sort((a, b) => a.name.localeCompare(b.name)));
        }),
      (error) => {
        reject(error);
        return false;
      }
    );
  });
};

export const getWardrobeItemsById = async (db: SQLite.WebSQLDatabase, uuid: string) => {
  return new Promise<Item[]>((resolve, reject) => {
    db.transaction(
      (tx) =>
        tx.executeSql(`SELECT * FROM wardrobe WHERE uuid='${uuid}'`, [], async (t, res) => {
          const wardrobe = await Promise.all(
            res.rows._array.map(async (item: ItemDataResponse) => {
              const wearDetails = await getWarobeWearDetails(db, item.uuid);
              return new Item({
                uuid: item.uuid,
                name: item.name,
                wears: wearDetails.wears,
                lastWorn: wearDetails.lastWorn ?? undefined,
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
                favorite: item.favorite,
              });
            })
          );
          resolve(wardrobe.sort((a, b) => a.name.localeCompare(b.name)));
        }),
      (error) => {
        reject(error);
        return false;
      }
    );
  });
};

export const getWarobeWearDetails = async (db: SQLite.WebSQLDatabase, uuid: string) => {
  return new Promise<{ wears: number; lastWorn: Date | null }>((resolve, reject) => {
    db.transaction(
      (tx) =>
        tx.executeSql(`SELECT * FROM ${TableNames.WARDROBE_WEARS} WHERE itemID='${uuid}'`, [], (_, res) => {
          const wearCount = res.rows._array.length;
          const lastWorn = wearCount > 0 ? new Date(res.rows._array.reduce((a, b) => (a.date > b.date ? a : b)).date) : null;
          const wearDetails = { wears: wearCount, lastWorn: lastWorn };
          console.log("RES", wearDetails);
          resolve(wearDetails);
        }),
      (error) => {
        reject(error);
        return false;
      }
    );
  });
};

export const setItemAsFavorite = (db: SQLite.WebSQLDatabase, item: Item) => {
  const query = `UPDATE ${TableNames.WARDROBE} SET favorite = ${item.favorite} WHERE uuid = '${item.uuid}'`;
  return new Promise<number | undefined>((resolve, reject) =>
    db.transaction((tx) => {
      tx.executeSql(
        query,
        [],
        (_, res) => resolve(res.insertId),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    })
  );
};

export const updateWearDetails = (db: SQLite.WebSQLDatabase, item: Item, date: Date) => {
  console.log("ITEM WEARS", item.wears);
  const query = `INSERT INTO ${TableNames.WARDROBE_WEARS} (itemID, date) VALUES (?,?)`;
  return new Promise<number | undefined>((resolve, reject) =>
    db.transaction((tx) => {
      tx.executeSql(
        query,
        [item.uuid, date.toISOString()],
        (_, res) => resolve(res.insertId),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    })
  );
};

// export const updateWearCount = (db: SQLite.WebSQLDatabase, item: Item) => {
//   console.log("ITEM WEARS", item.wears);
//   const query = `UPDATE ${TableNames.WARDROBE} SET wears = ${item.wears + 1} WHERE uuid = '${item.uuid}'`;
//   return new Promise<number | undefined>((resolve, reject) =>
//     db.transaction((tx) => {
//       tx.executeSql(
//         query,
//         [],
//         (_, res) => resolve(res.insertId),
//         (_, error) => {
//           reject(error);
//           return false;
//         }
//       );
//     })
//   );
// };

// export const updateLastWorn = (db: SQLite.WebSQLDatabase, itemID: string, date: Date) => {
//   const query = `UPDATE ${TableNames.WARDROBE} SET last_worn = '${date.toISOString()}' WHERE uuid = '${itemID}'`;
//   return new Promise<number | undefined>((resolve, reject) =>
//     db.transaction((tx) => {
//       tx.executeSql(
//         query,
//         [],
//         (_, res) => resolve(res.insertId),
//         (_, error) => {
//           reject(error);
//           return false;
//         }
//       );
//     })
//   );
// };
