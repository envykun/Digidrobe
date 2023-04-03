import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { Fontisto, SimpleLineIcons } from "@expo/vector-icons";
import { useWeatherAndLocation } from "@Hooks/useWeatherAndLocation";
import { getWeatherIconByCode, getWeatherTextByCode } from "@DigiUtils/helperFunctions";

export default function WeatherAndLocation() {
  const { location, weatherCurrent, weatherForecast, error, isLoading } = useWeatherAndLocation();
  return (
    <View style={styles.weatherContainer}>
      {error ? (
        <Text>{error}</Text>
      ) : isLoading ? (
        // TODO: Replace with skeleton loading indicator.
        <ActivityIndicator size="large" color="black" />
      ) : (
        <View style={styles.container}>
          <View style={{ rowGap: 8 }}>
            <View style={{ flexDirection: "row", columnGap: 12, alignItems: "baseline" }}>
              <Fontisto name={getWeatherIconByCode(weatherCurrent?.weathercode)} size={52} color="black" />
              <Text style={{ fontSize: 24 }}>{getWeatherTextByCode(weatherCurrent?.weathercode)}</Text>
            </View>
            <Text numberOfLines={1} ellipsizeMode="tail" style={{ width: "100%" }}>
              <SimpleLineIcons name="location-pin" size={12} color="black" /> {location?.city}, {location?.district}
            </Text>
          </View>
          <View>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ fontSize: 64 }}>{weatherCurrent && Math.round(weatherCurrent.temperature)}</Text>
              <Text style={{ fontSize: 48 }}>°</Text>
            </View>
            <View style={{ flexDirection: "row", columnGap: 6, marginTop: -8 }}>
              <Text style={{ fontSize: 10 }}>
                <Fontisto name="arrow-up-l" size={9} color="black" />
                {weatherForecast && Math.round(weatherForecast.temperature_2m_max[0])}°C
              </Text>
              <Text style={{ fontSize: 10 }}>
                <Fontisto name="arrow-down-l" size={9} color="black" />
                {weatherForecast && Math.round(weatherForecast.temperature_2m_min[0])}°C
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  weatherContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
