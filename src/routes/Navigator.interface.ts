import { Item } from "@Classes/Item";
import { Outfit } from "@Classes/Outfit";

export type RootStackParamList = {
  Root: undefined;
  ItemDetails: { item: Item };
  NewOutfit: undefined;
  NewItem: undefined;
  Outfits: undefined;
  OutfitDetails: { outfit: Outfit };
  Favorites: undefined;
  Recent: undefined;
  UserSettings: undefined;
  Calendar: undefined;
  NotFound: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  Wardrobe: {
    itemID?: string;
    favoriteFilter?: boolean;
  };
  Outfitter: {
    bookmarkFilter?: boolean;
  };
  Statistic: undefined;
};
