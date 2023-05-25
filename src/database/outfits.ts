import * as SQLite from "expo-sqlite";
import { Outfit } from "@Classes/Outfit";
import { TableNames } from "./database.definitions";
import { ItemImagePreview, OutfitDataResponse, OutfitDatabaseData, OutfitMap, OutfitOverview } from "@Models/Outfit";
import { createMultipleValues, deleteFromJunctionTable, getFromJunctionTableResolved } from "./generics";
import { Item } from "@Classes/Item";
import { getWardrobeItemsById, updateWearDetails } from "./item";

// CREATE
export const createOutfit = async (db: SQLite.WebSQLDatabase, outfit: Outfit) => {
  const preparedOutfit = outfit.getPreparedForDatabase();
  console.log("PREPERADE TEAGS", preparedOutfit.tags);
  preparedOutfit.tags && (await createMultipleValues(db, preparedOutfit.tags, TableNames.TAGS, outfit.uuid, TableNames.OUTFIT_TAGS));

  db.transaction((tx) => {
    tx.executeSql(
      `INSERT INTO ${TableNames.OUTFITS} (uuid, name, imageURL, bookmarked) VALUES (?,?,?,?)`,
      [preparedOutfit.uuid, preparedOutfit.name, preparedOutfit.imageURL, preparedOutfit.bookmarked],
      (txObj, resultSet) => console.log("Success", resultSet),
      (txObj, error) => {
        console.log("Error", txObj, error);
        return false;
      }
    );
  });

  await addToOutfitJunctionTable(db, preparedOutfit.uuid, preparedOutfit.data);

  const plannedDate = outfit.getPlannedDate();
  plannedDate && plannedDate.map((date) => addToPlannedOutfits(db, preparedOutfit.uuid, date));
};

// READ
export const getOutfits = async (db: SQLite.WebSQLDatabase) => {
  return new Promise<Outfit[]>((resolve, reject) => {
    db.transaction(
      (tx) =>
        tx.executeSql(`SELECT * FROM ${TableNames.OUTFITS}`, [], async (t, res) => {
          const outfits = await Promise.all(
            res.rows._array.map(async (outfit: OutfitDataResponse) => {
              const wearDetails = await getOutfitWearDetails(db, outfit.uuid);
              return new Outfit({
                uuid: outfit.uuid,
                name: outfit.name,
                wears: wearDetails.wears,
                lastWorn: wearDetails.lastWorn ?? undefined,
                imageURL: outfit.imageURL ?? undefined,
                bookmarked: outfit.bookmarked,
                items: await getOutfitItemByCategory(db, outfit.uuid),
                tags: await getFromJunctionTableResolved(db, outfit.uuid, "tags"),
                planned: await getPlannedOutfitById(db, outfit.uuid),
              });
            })
          );
          resolve(outfits.sort((a, b) => a.name.localeCompare(b.name)));
        }),
      (error) => {
        reject("Error fetching outfits:" + error);
        return false;
      }
    );
  });
};

export const getOutfitById = async (db: SQLite.WebSQLDatabase, outfitID: string) => {
  return new Promise<Outfit>((resolve, reject) => {
    db.transaction(
      (tx) =>
        tx.executeSql(`SELECT * FROM ${TableNames.OUTFITS} WHERE uuid='${outfitID}'`, [], async (t, res) => {
          const outfit = await Promise.all(
            res.rows._array.map(async (outfit: OutfitDataResponse) => {
              const wearDetails = await getOutfitWearDetails(db, outfit.uuid);
              return new Outfit({
                uuid: outfit.uuid,
                name: outfit.name,
                wears: wearDetails.wears,
                lastWorn: wearDetails.lastWorn ?? undefined,
                imageURL: outfit.imageURL ?? undefined,
                bookmarked: outfit.bookmarked,
                items: await getOutfitItemByCategory(db, outfit.uuid),
                tags: await getFromJunctionTableResolved(db, outfit.uuid, "tags"),
                planned: await getPlannedOutfitById(db, outfit.uuid),
              });
            })
          );
          resolve(outfit[0]);
        }),
      (error) => {
        reject("Error fetching outfits:" + error);
        return false;
      }
    );
  });
};

// TODO: DELETE this maybe?
export const getOutfitItemURLs = async (db: SQLite.WebSQLDatabase, outfitId: string) => {
  return new Promise<Array<ItemImagePreview> | undefined>((resolve, reject) => {
    db.transaction((tx) =>
      tx.executeSql(
        `SELECT W.uuid, W.imageURL, W.name FROM ${TableNames.OUTFIT_WARDROBE} OCW
        INNER JOIN ${TableNames.OUTFITS} O ON O.uuid = OCW.outfitID
        INNER JOIN ${TableNames.WARDROBE} W ON W.uuid = OCW.itemID
        WHERE OCW.outfitID = '${outfitId}'
        `,
        [],
        (t, res) => {
          // const imageURLs = res.rows._array.map((i) => i.imageURL).filter((url): url is string => !!url);
          const items: Array<ItemImagePreview> = res.rows._array.map((i: ItemImagePreview) => {
            return { uuid: i.uuid, name: i.name, imageURL: i.imageURL };
          });
          resolve(items.length > 0 ? items : undefined);
        },
        (t, error) => {
          reject(error);
          return true;
        }
      )
    );
  });
};

export const getOutfitItemByCategory = async (db: SQLite.WebSQLDatabase, outfitId: string) => {
  return new Promise<OutfitMap>((resolve, reject) => {
    db.transaction((tx) =>
      tx.executeSql(
        `SELECT * FROM ${TableNames.OUTFIT_WARDROBE} WHERE outfitID = '${outfitId}'`,
        [],
        async (t, res) => {
          const itemIDs: Array<string> = res.rows._array.map((r: { outfitID: string; itemID: string }) => r.itemID);
          const items: Array<Item> = await getWardrobeItemsById(db, itemIDs);
          const outfitItems: OutfitMap = items.reduce(
            (acc, curr) => acc.set(curr.baseCategory, [...(acc.get(curr.baseCategory) || []), curr]),
            new Map()
          );
          // console.log(JSON.stringify(Array.from(outfitItems.entries()), 0, 2));
          resolve(outfitItems);
        },
        (t, error) => {
          reject(error);
          return true;
        }
      )
    );
  });
};

export const getOutfitWearDetails = async (db: SQLite.WebSQLDatabase, uuid: string) => {
  return new Promise<{ wears: number; lastWorn: Date | null }>((resolve, reject) => {
    db.transaction(
      (tx) =>
        tx.executeSql(`SELECT * FROM ${TableNames.PLANNED_OUTFITS} WHERE outfitID='${uuid}'`, [], (_, res) => {
          const filteredWithoutPlanned = res.rows._array.filter((d) => Boolean(Number(d.worn)));
          const wearCount = filteredWithoutPlanned.length;
          const lastWorn = wearCount > 0 ? new Date(filteredWithoutPlanned.reduce((a, b) => (a.date > b.date ? a : b)).date) : null;
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

// UPDATE
export const updateOutfit = async (db: SQLite.WebSQLDatabase, outfit: Outfit) => {
  const oldOutfit = await getOutfitById(db, outfit.uuid);
  const dbParsedOutfit = outfit.getPreparedForDatabase();

  // update Items
  if (outfit.itemsUpdated) {
    await deleteFromTableById(db, outfit.uuid, TableNames.OUTFIT_WARDROBE);
    await addToOutfitJunctionTable(db, dbParsedOutfit.uuid, dbParsedOutfit.data);
    outfit.itemsUpdated = false;
  }

  // update/create Tags
  if (JSON.stringify(dbParsedOutfit.tags) !== JSON.stringify(oldOutfit.tags)) {
    await deleteFromJunctionTable(db, dbParsedOutfit.uuid, TableNames.OUTFIT_TAGS);
    dbParsedOutfit.tags && (await createMultipleValues(db, dbParsedOutfit.tags, TableNames.TAGS, outfit.uuid, TableNames.OUTFIT_TAGS));
  }

  // update Name, Image
  return new Promise<number | undefined>((resolve, reject) =>
    db.transaction((tx) => {
      tx.executeSql(
        `UPDATE ${TableNames.OUTFITS} SET name=?, imageURL=? WHERE uuid='${outfit.uuid}'`,
        [dbParsedOutfit.name, dbParsedOutfit.imageURL],
        (_, res) => resolve(res.insertId),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    })
  );
};

// DELETE
export const deleteOutfit = async (db: SQLite.WebSQLDatabase, outfitID: string) => {
  // Delete from outfit
  const deleteOutfit = new Promise<number | undefined>((resolve, reject) =>
    db.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM ${TableNames.OUTFITS} WHERE uuid='${outfitID}'`,
        [],
        (_, res) => resolve(res.insertId),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    })
  );
  // Delete planned outfits
  const deletePlanned = await deletePlannedOutfit(db, outfitID);
  // Delete wardrobe item junction
  const deleteItemJunction = await deleteFromTableById(db, outfitID, TableNames.OUTFIT_WARDROBE);
  // Delete from tags
  const deleteTags = await deleteFromJunctionTable(db, outfitID, TableNames.OUTFIT_TAGS);

  return Promise.all([deleteOutfit, deletePlanned, deleteItemJunction, deleteTags]);
};

const addToOutfitJunctionTable = async (db: SQLite.WebSQLDatabase, outfitID: string, data: Array<OutfitDatabaseData>) => {
  const values = data.flatMap((c) => c.itemIDs.map((itemID) => `('${outfitID}', '${itemID}')`)).join(",");
  db.transaction((tx) => {
    tx.executeSql(
      `INSERT OR IGNORE INTO ${TableNames.OUTFIT_WARDROBE} (outfitID, itemID) VALUES ${values}`,
      [],
      (txObj, resultSet) => console.log("Success", resultSet),
      (txObj, error) => {
        console.log("Error", txObj, error);
        return false;
      }
    );
  });
};

export const deleteFromTableById = async (db: SQLite.WebSQLDatabase, outfitID: string, table: string) => {
  return new Promise<SQLite.SQLResultSet | null>((resolve, reject) =>
    db.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM ${table} WHERE outfitID='${outfitID}'`,
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

// ######## PLANNED OUTFITS ########
export const addToPlannedOutfits = async (db: SQLite.WebSQLDatabase, outfitID: string, date: Date) => {
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return new Promise<number | undefined>((resolve, reject) =>
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT OR IGNORE INTO ${TableNames.PLANNED_OUTFITS} (outfitID, date, worn) VALUES (?,?,?)`,
        [outfitID, date.toISOString(), 0],
        (_, res) => resolve(res.insertId),
        (_, error) => {
          reject(error);
          console.log("Error", error);
          return false;
        }
      );
    })
  );
};

export const getPlannedOutfitByDate = (db: SQLite.WebSQLDatabase, date: Date) => {
  const parsedDate = date.toISOString().split("T")[0] + "%";
  return new Promise<Outfit[]>((resolve, reject) =>
    db.transaction(
      (tx) =>
        tx.executeSql(
          `SELECT * FROM ${TableNames.PLANNED_OUTFITS} PO INNER JOIN ${TableNames.OUTFITS} O ON O.uuid = PO.outfitID WHERE date LIKE '${parsedDate}'`,
          [],
          async (t, res) => {
            const outfits = await Promise.all(
              res.rows._array.map(async (outfit) => {
                return new Outfit({
                  uuid: outfit.uuid,
                  name: outfit.name,
                  imageURL: outfit.imageURL,
                });
              })
            );
            resolve(outfits);
          }
        ),
      (error) => {
        reject(error);
        return true;
      }
    )
  );
};

export const getPlannedOutfitById = (db: SQLite.WebSQLDatabase, outfitID: string) => {
  const today = new Date();
  return new Promise<Array<Date>>((resolve, reject) =>
    db.transaction(
      (tx) =>
        tx.executeSql(`SELECT * FROM ${TableNames.PLANNED_OUTFITS} WHERE outfitID='${outfitID}'`, [], async (t, res) => {
          const futurePlanned = res.rows._array.filter((p) => new Date(p.date) > today && p.worn === 0).map((p) => new Date(p.date));
          resolve(futurePlanned);
        }),
      (error) => {
        reject(error);
        return true;
      }
    )
  );
};

export const removePlannedDate = (db: SQLite.WebSQLDatabase, outfitID: string, date: Date) => {
  const parsedDate = date.toISOString().split("T")[0] + "%";
  console.log("parsedDate", parsedDate);
  return new Promise<number | undefined>((resolve, reject) =>
    db.transaction(
      (tx) =>
        tx.executeSql(
          `DELETE FROM ${TableNames.PLANNED_OUTFITS} WHERE outfitID='${outfitID}' AND date='${parsedDate}'`,
          [],
          async (t, res) => resolve(res.insertId)
        ),
      (error) => {
        reject(error);
        return true;
      }
    )
  );
};

export const deletePlannedOutfit = (db: SQLite.WebSQLDatabase, outfitID: string) => {
  return new Promise<number | undefined>((resolve, reject) =>
    db.transaction(
      (tx) =>
        tx.executeSql(`DELETE FROM ${TableNames.PLANNED_OUTFITS} WHERE outfitID='${outfitID}'`, [], async (t, res) =>
          resolve(res.insertId)
        ),
      (error) => {
        reject(error);
        return true;
      }
    )
  );
};

export const setOutfitAsBookmarked = (db: SQLite.WebSQLDatabase, outfit: Outfit) => {
  const query = `UPDATE ${TableNames.OUTFITS} SET bookmarked = ${outfit.bookmarked} WHERE uuid = '${outfit.uuid}'`;
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

export const updateOutfitWearDetails = async (db: SQLite.WebSQLDatabase, outfit: Outfit, date: Date) => {
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);

  // Update wearcount of all outfit items.
  await Promise.all(outfit.getAllItems().map(async (item) => await updateWearDetails(db, item, date)));

  const query = `REPLACE INTO ${TableNames.PLANNED_OUTFITS} (outfitID, date, worn) VALUES (?,?,?)`;
  return new Promise<number | undefined>((resolve, reject) =>
    db.transaction((tx) => {
      tx.executeSql(
        query,
        [outfit.uuid, date.toISOString(), 1],
        (_, res) => resolve(res.insertId),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    })
  );
};
