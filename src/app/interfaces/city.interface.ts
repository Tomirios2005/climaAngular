export interface City {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state: string;
}

export interface CitySearchResult {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state: string;
  local_names?: { [key: string]: string };
}