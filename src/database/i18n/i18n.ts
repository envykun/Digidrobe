import de_DE from "./de_DE.json";
import en_US from "./en_US.json";
import { I18n } from "i18n-js";
import * as Localization from "expo-localization";

const translations = {
  de_DE,
  en_US,
};

export const i18n = new I18n(translations);

i18n.enableFallback = true;
i18n.defaultLocale = "en_US";
i18n.locale = Localization.locale;
