import { GenericBottomSheetItem } from "@Models/Generic";
import { NavigationProp } from "@react-navigation/native";
import { formatRelative, formatDistanceToNow } from "date-fns";
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";

export const calculateCostPerWear = (cost: number, wear: number) => {
  return (cost / wear).toFixed(2);
};

/** 
  WMO Weather interpretation codes (WW)

  Code	      Description
  ------------------------------------------------------------------------
  0	          Clear sky
  1, 2, 3	    Mainly clear, partly cloudy, and overcast
  45, 48	    Fog and depositing rime fog
  51, 53, 55	Drizzle: Light, moderate, and dense intensity
  56, 57	    Freezing Drizzle: Light and dense intensity
  61, 63, 65	Rain: Slight, moderate and heavy intensity
  66, 67	    Freezing Rain: Light and heavy intensity
  71, 73, 75	Snow fall: Slight, moderate, and heavy intensity
  77	        Snow grains
  80, 81, 82	Rain showers: Slight, moderate, and violent
  85, 86	    Snow showers slight and heavy
  95 *	      Thunderstorm: Slight or moderate
  96, 99 *	  Thunderstorm with slight and heavy hail
  -------------------------------------------------------------------------
  (*) Thunderstorm forecast with hail is only available in Central Europe
 */

// Fontisto
type FontistoIcon =
  | "day-sunny"
  | "cloudy"
  | "day-cloudy"
  | "cloudy-gusts"
  | "day-haze"
  | "day-lightning"
  | "day-rain"
  | "day-snow"
  | "fog"
  | "lightning"
  | "lightnings"
  | "night-alt-cloudy"
  | "night-alt-lightning"
  | "night-alt-rain"
  | "night-alt-snow"
  | "night-clear"
  | "rain"
  | "rains"
  | "snow"
  | "snows"
  | undefined;

export const getWeatherIconByCode = (code?: number): FontistoIcon => {
  switch (code) {
    case 0:
      return "day-sunny";
    case 1:
    case 2:
      return "day-cloudy";
    case 3:
      return "cloudy";
    case 45:
    case 48:
      return "fog";
    case 51:
    case 53:
    case 55:
      return "day-rain";
    case 56:
    case 57:
      return "day-snow";
    case 61:
    case 63:
      return "rain";
    case 65:
      return "rains";
    case 66:
    case 67:
      return "rain";
    case 71:
    case 73:
    case 75:
      return "snow";
    case 77:
      return "snows";
    case 80:
    case 81:
    case 82:
      return "day-rain";
    case 85:
    case 86:
      return "day-snow";
    case 95:
      return "lightning";
    case 96:
    case 99:
      return "lightnings";
    default:
      return "night-clear";
  }
};

export const getWeatherTextByCode = (code?: number): string => {
  switch (code) {
    case 0:
      return "Sonnig";
    case 1:
      return "Leicht bewölkt";
    case 2:
      return "Wolkig";
    case 3:
      return "Bewölkt";
    case 45:
      return "Nebel";
    case 48:
      return "Nebel, raureif";
    case 51:
    case 53:
    case 55:
      return "Nieselregen";
    case 56:
    case 57:
      return "Schneeregen";
    case 61:
    case 63:
      return "Regen";
    case 65:
      return "Starkregen";
    case 66:
    case 67:
      return "Schneeregen";
    case 71:
    case 73:
    case 75:
      return "Schnee";
    case 77:
      return "Hagel";
    case 80:
    case 81:
    case 82:
      return "Regenschauer";
    case 85:
    case 86:
      return "Schneeschauer";
    case 95:
      return "Gewitter";
    case 96:
    case 99:
      return "starke Gewitter";
    default:
      return "unknown";
  }
};

// const formatter = new Intl.RelativeTimeFormat(undefined, {
//   numeric: "auto",
// });

// const DIVISIONS: Array<{ amount: number; name: string }> = [
//   { amount: 60, name: "seconds" },
//   { amount: 60, name: "minutes" },
//   { amount: 24, name: "hours" },
//   { amount: 7, name: "days" },
//   { amount: 4.34524, name: "weeks" },
//   { amount: 12, name: "months" },
//   { amount: Number.POSITIVE_INFINITY, name: "years" },
// ];

export const formatTimeAgo = (lastWorn?: Date) => {
  if (!lastWorn) return "-";
  return formatDistanceToNow(lastWorn, { addSuffix: true });
};

type CategoryIDs = {
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
};

interface ICategoryTranslation {
  en: CategoryIDs;
  de: CategoryIDs;
}

/**
 * TOPS
 * BOTTOMS
 * SHOES
 */
const categoryTranslation: ICategoryTranslation = {
  en: {
    1: "Headpiece",
    2: "Upper body",
    3: "Lower body",
    4: "Footwear",
    5: "Accessories",
    6: "No category",
  },
  de: {
    1: "Kopfbedeckung",
    2: "Oberkörper",
    3: "Unterkörper",
    4: "Fußbekleidung",
    5: "Accessoires",
    6: "Keine Kategory",
  },
};

export const mapPredefinedCategories = (
  id: keyof CategoryIDs,
  locale: "en" | "de"
) => {
  switch (locale) {
    case "de":
      return categoryTranslation.de[id];
    case "en":
      return categoryTranslation.en[id];
    default:
      return;
  }
};

export interface IHeaderOnScrollTransition {
  event: NativeSyntheticEvent<NativeScrollEvent>;
  navigation: NavigationProp<ReactNavigation.RootParamList>;
  headerHeight: number;
  headerBackgroundColor?: string;
}

export const headerOnScrollTransition = ({
  event,
  navigation,
  headerHeight,
  headerBackgroundColor,
}: IHeaderOnScrollTransition) => {
  const headerOpacity =
    Math.min(
      Math.max(event.nativeEvent.contentOffset.y, 0) / headerHeight,
      1.0
    ) ?? 0.0;
  navigation.setOptions({
    headerStyle: {
      elevation: headerOpacity,
      backgroundColor: headerBackgroundColor
        ? `rgba(${headerBackgroundColor},${headerOpacity})`
        : `rgba(255,255,255,${headerOpacity})`,
    },
    headerShadowVisible: headerOpacity == 1 ? true : false,
  });
};

export interface ICalculateOutfitContainerSize {
  inset: number;
  gap: number;
}
export const calculateOutfitContainerSize = ({
  inset,
  gap,
}: ICalculateOutfitContainerSize) => {
  const outfitImageWidth =
    (Dimensions.get("screen").width - 2 * inset - gap) / 2;
  const itemImageWidth = (outfitImageWidth - gap) / 2;
  const outfitImageHeight = itemImageWidth * 3 + 2 * gap;
  const itemImageHeight = itemImageWidth;
  return {
    outfitImageWidth,
    outfitImageHeight,
    itemImageWidth,
    itemImageHeight,
  };
};

export const addOrRemoveToArray = (prev: Array<string>, item: string) => {
  if (prev.includes(item)) {
    return prev.filter((p) => p !== item);
  }
  return [...prev, item];
};

export const pickRandomElement = <T>(array: Array<T>): T => {
  return array[Math.floor(Math.random() * array.length)];
};

export const getKeyByValue = <T>(object: any, value: T) => {
  return Object.keys(object).find((key) => object[key] === value);
};

export const transformValueToBottomSheetItem = (
  value: string | string[]
): GenericBottomSheetItem | GenericBottomSheetItem[] => {
  if (Array.isArray(value)) {
    return value.map((v) => {
      return { id: v, label: v };
    });
  }
  return { id: value, label: value };
};
