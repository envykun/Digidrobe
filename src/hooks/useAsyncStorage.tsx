import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Settings {
  isInitialized: boolean;
  name?: string;
  locale: string;
  accentColor: string;
  quoteDisabled: boolean;
}

export type SettingsKey = keyof Settings;

export const useAsyncStorage = () => {
  const [data, setData] = useState<Settings>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    AsyncStorage.getItem("@settings")
      .then((res) => {
        res != null && setData(JSON.parse(res));
      })
      .catch((err) => setError(err))
      .finally(() => {
        setIsLoading(false);
      });
  };

  const updateSettingsValue = async (key: SettingsKey, value?: string | boolean) => {
    if (value === undefined || value === null) return;
    const newData = { ...data, [key]: value };
    await AsyncStorage.setItem("@settings", JSON.stringify(newData));
  };

  const refetch = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, isLoading, error, refetch, updateSettingsValue };
};

export const initializeSettings = async () => {
  const value = await AsyncStorage.getItem("@settings");
  if (value !== null) {
    const settings = JSON.parse(value) as Settings;
    if (!settings.isInitialized) {
      const initSettings: Settings = {
        isInitialized: true,
        name: undefined,
        locale: "en_US",
        accentColor: "#E2C895",
        quoteDisabled: false,
      };
      await AsyncStorage.setItem("@settings", JSON.stringify(initSettings));
    }
  }
};
