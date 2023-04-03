export interface WeatherResponse {
  current_weather: {
    temperature: number;
    time: string;
    weathercode: number;
    winddirection: number;
    windspeed: number;
  };
  elevation: number;
  latitude: number;
  longitude: number;
  timezone: string;
  daily: {
    temperature_2m_max: Array<number>;
    temperature_2m_min: Array<number>;
  };
}
