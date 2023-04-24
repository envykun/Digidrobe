import { formatRelative, formatDistanceToNow } from "date-fns";

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

// TODO: Map all icons to their respective weathercodes.
export const getWeatherIconByCode = (code?: number): FontistoIcon => {
  switch (code) {
    case 0:
      return "day-sunny";
    case 1:
    case 2:
    case 3:
      return "day-cloudy";
    default:
      return;
  }
};

// TODO: Map all strings to their respective weathercodes.
export const getWeatherTextByCode = (code?: number): string => {
  switch (code) {
    case 0:
      return "Sonnig";
    case 1:
    case 2:
    case 3:
      return "Bewölkt";
    default:
      return "";
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

export const formatTimeAgo = (lastWorn?: string) => {
  if (!lastWorn) return "-";
  let date = new Date(lastWorn);
  return formatDistanceToNow(date, { addSuffix: true });
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

export const mapPredefinedCategories = (id: keyof CategoryIDs, locale: "en" | "de") => {
  switch (locale) {
    case "de":
      return categoryTranslation.de[id];
    case "en":
      return categoryTranslation.en[id];
    default:
      return;
  }
};
