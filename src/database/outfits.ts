import * as SQLite from "expo-sqlite";
import { Outfit } from "@Classes/Outfit";
import { TableNames } from "./database.definitions";
import { OutfitCategoryProp } from "@Components/Box/OutfitCategory";
import { OutfitOverview } from "@Models/Outfit";

// CREATE
export const createOutfit = (db: SQLite.WebSQLDatabase, outfit: Outfit) => {
  const preparedOutfit = outfit.getPreparedForDatabase();

  db.transaction((tx) => {
    tx.executeSql(
      `INSERT INTO ${TableNames.OUTFITS} (uuid, name, imageURL) VALUES (?,?,?)`,
      [preparedOutfit.uuid, preparedOutfit.name, preparedOutfit.imageURL],
      (txObj, resultSet) => console.log("Success", resultSet),
      (txObj, error) => {
        console.log("Error", txObj, error);
        return false;
      }
    );
  });

  addToOutfitJunctionTable(db, preparedOutfit.uuid, preparedOutfit.data);
};

// READ
export const getOutfits = (db: SQLite.WebSQLDatabase, setOutfits: React.Dispatch<React.SetStateAction<OutfitOverview[]>>) => {
  db.transaction(
    (tx) =>
      tx.executeSql(`SELECT * FROM outfits`, [], async (t, res) => {
        const outfits = await Promise.all(
          res.rows._array.map(async (outfit) => {
            const outfitOverview: OutfitOverview = {
              uuid: outfit.uuid,
              name: outfit.name,
              imageURL: outfit.imageURL,
              itemImageURLs: await getOutfitItemURLs(db, outfit.uuid),
            };
            return outfitOverview;
          })
        );
        setOutfits(outfits);
      }),
    (error) => {
      console.log("Error getting outfits: ", error);
      return true;
    }
  );
};

export const getOutfitItemURLs = async (db: SQLite.WebSQLDatabase, outfitId: string) => {
  return new Promise<Array<string> | undefined>((resolve, reject) => {
    db.transaction((tx) =>
      tx.executeSql(
        `SELECT W.imageURL FROM ${TableNames.OUTFIT_CATEGORY_WARDROBE} OCW
        INNER JOIN ${TableNames.OUTFITS} O ON O.uuid = OCW.outfitID
        INNER JOIN ${TableNames.WARDROBE} W ON W.uuid = OCW.itemID
        WHERE OCW.outfitID = '${outfitId}'
        `,
        [],
        (t, res) => {
          const imageURLs = res.rows._array.map((i) => i.imageURL).filter((url): url is string => !!url);
          resolve(imageURLs.length > 0 ? imageURLs : undefined);
        },
        (t, error) => {
          reject(error);
          return true;
        }
      )
    );
  });
};

// UPDATE
export const updateOutfit = (db: SQLite.WebSQLDatabase) => {};

// DELETE
export const deleteOutfit = (db: SQLite.WebSQLDatabase) => {};

/**
 * [
 *  {categoryID: "1-1-1", itemIDs: ["id-1", "id-2", "id-3"]},
 *  {categoryID: "1-1-2", itemIDs: ["id-1", "id-2", "id-3"]},
 *  {categoryID: "1-1-3", itemIDs: ["id-1", "id-2", "id-3"]},
 * ]
 *
 */

const addToOutfitJunctionTable = (db: SQLite.WebSQLDatabase, outfitID: string, data: Array<OutfitDatabaseData>) => {
  const values = data
    .flatMap((category) => category.itemIDs.map((itemID) => `('${outfitID}', ${category.categoryID}, '${itemID}')`))
    .join(",");
  console.log("VALUES", values);
  db.transaction((tx) => {
    tx.executeSql(
      `INSERT OR IGNORE INTO ${TableNames.OUTFIT_CATEGORY_WARDROBE} (outfitID, categoryID, itemID) VALUES ${values}`,
      [],
      (txObj, resultSet) => console.log("Success", resultSet),
      (txObj, error) => {
        console.log("Error", txObj, error);
        return false;
      }
    );
  });
};

interface OutfitDatabaseData {
  categoryID: string;
  itemIDs: Array<string>;
}
