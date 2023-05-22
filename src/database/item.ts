import { Item } from "@Classes/Item";
import * as SQLite from "expo-sqlite";
import { TableNames } from "./database.definitions";
import { ItemDataResponse } from "@Models/Item";
import { createMultipleValues, createValueInTable, getValueById, getFromJunctionTableResolved, deleteFromJunctionTable } from "./generics";

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

export const updateItem = async (db: SQLite.WebSQLDatabase, item: Item) => {
  const oldItem = await getWardrobeItemsById(db, item.uuid);
  const dbParsedItem = item.getDBParsedItem();

  // let brand = dbParsedItem.brand ? await getValueById(db, item.brand, TableNames.BRANDS) : null
  console.log("TODO: update BRAND and BOUGHT_FROM");

  // if category changed
  if (JSON.stringify(dbParsedItem.category) !== JSON.stringify(oldItem[0].category)) {
    await deleteFromJunctionTable(db, dbParsedItem.uuid, TableNames.WARDROBE_CATEGORY);
    dbParsedItem.category &&
      (await createMultipleValues(db, dbParsedItem.category, TableNames.CATEGORIES, dbParsedItem.uuid, TableNames.WARDROBE_CATEGORY));
  }
  // if fabric changed
  if (JSON.stringify(dbParsedItem.fabric) !== JSON.stringify(oldItem[0].fabric)) {
    await deleteFromJunctionTable(db, dbParsedItem.uuid, TableNames.WARDROBE_FABRIC);
    dbParsedItem.fabric && (await createMultipleValues(db, dbParsedItem.fabric, TableNames.FABRICS, item.uuid, TableNames.WARDROBE_FABRIC));
  }
  // if color changed
  if (JSON.stringify(dbParsedItem.color) !== JSON.stringify(oldItem[0].color)) {
    await deleteFromJunctionTable(db, dbParsedItem.uuid, TableNames.WARDROBE_COLOR);
    dbParsedItem.color && (await createMultipleValues(db, dbParsedItem.color, TableNames.COLORS, item.uuid, TableNames.WARDROBE_COLOR));
  }
  // if brand changed
  if (dbParsedItem.brand !== oldItem[0].brand) {
    const brand = dbParsedItem.brand ? await createValueInTable(db, dbParsedItem.brand, TableNames.BRANDS) : null;
  }
  // if boughtFrom changed
  if (dbParsedItem.boughtFrom !== oldItem[0].boughtFrom) {
    const bought_from = dbParsedItem.boughtFrom ? await createValueInTable(db, dbParsedItem.boughtFrom, TableNames.BOUGHT_FROM) : null;
  }

  return new Promise<number | undefined>((resolve, reject) =>
    db.transaction((tx) => {
      tx.executeSql(
        `UPDATE ${TableNames.WARDROBE} SET name=?, cost=?, model=?, size=?, bought_date=?, notes=?, imageURL=? WHERE uuid='${item.uuid}'`,
        [
          dbParsedItem.name,
          dbParsedItem.cost,
          dbParsedItem.model,
          dbParsedItem.size,
          dbParsedItem.bought,
          dbParsedItem.notes,
          dbParsedItem.image,
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

export const deleteItem = async (db: SQLite.WebSQLDatabase, itemID: string) => {
  // Delete from wardrobe
  const deleteItem = new Promise<number | undefined>((resolve, reject) =>
    db.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM ${TableNames.WARDROBE} WHERE uuid='${itemID}'`,
        [],
        (_, res) => resolve(res.insertId),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    })
  );
  // Delete from wardrobe_wears
  const deleteWears = await deleteFromJunctionTable(db, itemID, TableNames.WARDROBE_WEARS);
  // Delete from wardrobe_category
  const deleteCat = await deleteFromJunctionTable(db, itemID, TableNames.WARDROBE_CATEGORY);
  // Delete from wardrobe_fabric
  const deleteFab = await deleteFromJunctionTable(db, itemID, TableNames.WARDROBE_FABRIC);
  // Delete from wardrobe_color
  const deleteCol = await deleteFromJunctionTable(db, itemID, TableNames.WARDROBE_COLOR);
  return Promise.all([deleteItem, deleteWears, deleteCat, deleteFab, deleteCol]);
};
