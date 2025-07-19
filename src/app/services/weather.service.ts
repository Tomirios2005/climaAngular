import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { WeatherData, WeatherDisplay } from '../interfaces/weather.interface';
import { CitySearchResult } from '../interfaces/city.interface';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private readonly apiKey = 'c1107c21652adeb2a440fbe30e0dc935';
  private readonly baseUrl = 'https://api.openweathermap.org';

  constructor(private http: HttpClient) { }

  searchCities(cityName: string): Observable<CitySearchResult[]> {
    const url = `${this.baseUrl}/geo/1.0/direct?q=${cityName}&limit=5&appid=${this.apiKey}`;
    return this.http.get<CitySearchResult[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  getWeatherByCoordinates(lat: number, lon: number): Observable<WeatherDisplay> {
    const url = `${this.baseUrl}/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`;
    return this.http.get<WeatherData>(url).pipe(
      map(this.transformWeatherData),
      catchError(this.handleError)
    );
  }

  getWeatherByCity(cityName: string): Observable<WeatherDisplay> {
    const url = `${this.baseUrl}/data/2.5/weather?q=${cityName}&units=metric&appid=${this.apiKey}`;
    return this.http.get<WeatherData>(url).pipe(
      map(this.transformWeatherData),
      catchError(this.handleError)
    );
  }

  private transformWeatherData(data: WeatherData): WeatherDisplay {
    return {
      city: data.name,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      pressure: data.main.pressure,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6 * 100) / 100, // Convert m/s to km/h
      windDirection: data.wind.deg,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      lat: data.coord.lat,           // 👈 extraído desde WeatherData
      lon: data.coord.lon,
      country: data.sys.country || '' // Agregado para incluir el país

    };
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ha ocurrido un error desconocido';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 404:
          errorMessage = 'Ciudad no encontrada';
          break;
        case 401:
          errorMessage = 'API key inválida';
          break;
        case 429:
          errorMessage = 'Demasiadas solicitudes. Intente más tarde';
          break;
        default:
          errorMessage = `Error del servidor: ${error.status}`;
      }
    }
    return throwError(() => new Error(errorMessage));
  }
}