export interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  coord: {
    lon: number;
    lat: number;
  };
}

export interface WeatherDisplay {
  city: string;
  temperature: number;
  feelsLike: number;
  pressure: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  description: string;
  icon: string;
  lat: number;   // 👈 añadidos
  lon: number; 
}