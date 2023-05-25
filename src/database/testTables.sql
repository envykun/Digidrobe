CREATE TABLE IF NOT EXISTS categories(
    id INTEGER NOT NULL PRIMARY KEY,
    label TEXT NOT NULL UNIQUE
)

CREATE TABLE IF NOT EXISTS wardrobe_category(
    wardrobeID TEXT NOT NULL REFERENCES wardrobe(id),
    categoryID TEXT NOT NULL REFERENCES categories(id)
)

CREATE TABLE IF NOT EXISTS wardrobe(
    uuid TEXT NOT NULL PRIMARY KEY, name TEXT NOT NULL, wears INTEGER, last_worn TEXT, cost INTEGER, brand INTEGER, model TEXT, size INTEGER, bought TEXT, bought_from INTEGER, notes TEXT, image TEXT
)

CREATE TABLE IF NOT EXISTS brands(
    id INTEGER NOT NULL PRIMARY KEY,
    label TEXT NOT NULL UNIQUE
)

CREATE TABLE IF NOT EXISTS stores(
    id INTEGER NOT NULL PRIMARY KEY,
    label TEXT NOT NULL UNIQUE
)

CREATE TABLE IF NOT EXISTS outfits(
    id TEXT NOT NULL PRIMARY KEY,
    imageURL TEXT
)

CREATE TABLE IF NOT EXISTS outfit_wardrobe(
    outfitID TEXT NOT NULL REFERENCES outfits(id),
    itemID TEXT NOT NULL REFERENCES wardrobe(uuid),
    UNIQUE(outfitID,itemID)
)

CREATE TABLE IF NOT EXISTS planned_outfit(
    outfitID TEXT NOT NULL REFERENCES outfits(id),
    date TEXT NOT NULL,
    UNIQUE(outfitID, date)
)

INSERT INTO categories (label) VALUES ("Schuhe")
INSERT INTO categories (label) VALUES ("Hose")
INSERT INTO categories (label) VALUES ("Hemd")
INSERT INTO brands (label) VALUES ("Nike")
INSERT INTO brands (label) VALUES ("Puma")
INSERT OR IGNORE INTO brands (label) VALUES ("Adidas2"), ("Hermes2"),
INSERT OR IGNORE INTO brands (label) VALUES ("Adidas")
INSERT INTO stores (label) VALUES ("Amazon")
INSERT INTO wardrobe (uuid, name, brand, bought_from) VALUES ("1-1-1-3", "Joggers", (SELECT id from brands WHERE label = "Puma"), (SELECT id from stores WHERE label = "Amazon"))
INSERT INTO wardrobe_category (wardrobeID, categoryID) VALUES ((SELECT id from wardrobe WHERE name = "Joggers2"), (SELECT id from categories WHERE label = "Hose"))
INSERT INTO wardrobe (uuid, label, wears) VALUES (?,"Peter",?)

INSERT INTO outfits (id, imageURL) VALUES ("1-1-1-3", "someImage.url") 
INSERT INTO outfit_category_wardrobe (outfitID, categoryID, itemID) VALUES ("1-1-1-2", 2, "1-1-1-1") 

INSERT INTO planned_outfit (outfitID, date) VALUES ("1-1-1-3", "2023-05-22T18:35:16.179Z")

-- Select from junction table
SELECT label FROM wardrobe_category WC 
INNER JOIN wardrobe W ON W.uuid = WC.wardrobeID 
INNER JOIN categories C ON C.id = WC.categoryID 
WHERE W.uuid = "1-1-1-1"

-- Select all outfits resolved
SELECT * FROM outfit_category_wardrobe OCW
INNER JOIN outfits O ON O.id = OCW.outfitID
INNER JOIN wardrobe W ON W.uuid = OCW.itemID
WHERE OCW.itemID = "1-1-1-2"
-- INNER JOIN categories C ON C.id = OCW.categoryID

DROP TABLE categories
DROP TABLE outfits
DROP TABLE outfit_category_wardrobe
DROP TABLE wardrobe
DROP TABLE wardrobe_category

DELETE FROM categories WHERE label = "Hose"


SELECT * FROM planned_outfit PO
INNER JOIN outfits O ON O.id = PO.outfitID
WHERE date LIKE '2023-05-20%'