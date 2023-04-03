import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { WeatherResponse } from "@Models/WeatherAndLocation";

export const useWeatherAndLocation = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [geoCodedAdress, setGeoCodedAdress] = useState<Location.LocationGeocodedAddress | null>(null);
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(true);
  const [isLoadingGeoCodedAdress, setIsLoadingGeoCodedAdress] = useState<boolean>(true);
  const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoadingLocation(true);
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("No permission.");
        return;
      }
    })();
    Location.getCurrentPositionAsync({})
      .then((location) => {
        setLocation(location);
      })
      .catch((err) => setError(err))
      .finally(() => setIsLoadingLocation(false));
  }, []);

  useEffect(() => {
    if (!location || error) return;
    setIsLoadingGeoCodedAdress(true);
    Location.reverseGeocodeAsync(location.coords)
      .then((region) => {
        setGeoCodedAdress(region[0]);
      })
      .catch((err) => setError(err))
      .finally(() => setIsLoadingGeoCodedAdress(false));
  }, [location]);

  useEffect(() => {
    if (!location || error) return;
    setIsLoadingWeather(true);
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${location?.coords.latitude}&longitude=${location?.coords.longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min&forecast_days=1&timezone=Europe%2FBerlin`
    )
      .then((res) => res.json())
      .then((data) => setWeather(data))
      .finally(() => setIsLoadingWeather(false));
  }, [location]);

  return {
    location: geoCodedAdress,
    weatherCurrent: weather?.current_weather,
    weatherForecast: weather?.daily,
    error,
    isLoading: isLoadingLocation || isLoadingGeoCodedAdress || isLoadingWeather,
  };
};
